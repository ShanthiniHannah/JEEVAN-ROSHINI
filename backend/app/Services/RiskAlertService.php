<?php

namespace App\Services;

use App\Models\Followup;
use App\Models\HealthRecord;
use App\Models\Individual;
use App\Models\LabReport;
use App\Models\RiskAlert;

/**
 * RiskAlertService
 *
 * Implements rule-based automatic risk alert generation for the
 * Jeevan Roshini platform. This service is the single source of
 * truth for all alert logic — no manual alert creation needed.
 *
 * Usage:
 *   app(RiskAlertService::class)->evaluateHealthRecord($healthRecord);
 *   app(RiskAlertService::class)->evaluateIndividual($individual);
 *   app(RiskAlertService::class)->evaluateLabReport($labReport);
 *   app(RiskAlertService::class)->evaluateFollowups(); // Cron job
 */
class RiskAlertService
{
    /**
     * Evaluate a new/updated health record and fire appropriate alerts.
     */
    public function evaluateHealthRecord(HealthRecord $record): void
    {
        $individual = $record->individual;

        // ── Blood Pressure Rules ─────────────────────────────────────────────
        if ($record->bp_systolic !== null && $record->bp_diastolic !== null) {

            if ($record->bp_systolic >= 180 || $record->bp_diastolic >= 120) {
                $this->createAlert($individual, [
                    'type' => RiskAlert::TYPE_HYPERTENSION,
                    'severity' => RiskAlert::SEVERITY_CRITICAL,
                    'reason' => "Hypertensive Crisis: BP {$record->bp_systolic}/{$record->bp_diastolic} mmHg — immediate medical attention required.",
                    'trigger_data' => ['bp_systolic' => $record->bp_systolic, 'bp_diastolic' => $record->bp_diastolic],
                ]);
            } elseif ($record->bp_systolic >= 160 || $record->bp_diastolic >= 100) {
                $this->createAlert($individual, [
                    'type' => RiskAlert::TYPE_HYPERTENSION,
                    'severity' => RiskAlert::SEVERITY_HIGH,
                    'reason' => "Stage 2 Hypertension: BP {$record->bp_systolic}/{$record->bp_diastolic} mmHg — urgent follow-up required.",
                    'trigger_data' => ['bp_systolic' => $record->bp_systolic, 'bp_diastolic' => $record->bp_diastolic],
                ]);
            } elseif ($record->bp_systolic >= 140 || $record->bp_diastolic >= 90) {
                $this->createAlert($individual, [
                    'type' => RiskAlert::TYPE_HYPERTENSION,
                    'severity' => RiskAlert::SEVERITY_MEDIUM,
                    'reason' => "Stage 1 Hypertension: BP {$record->bp_systolic}/{$record->bp_diastolic} mmHg — monitor and counsel.",
                    'trigger_data' => ['bp_systolic' => $record->bp_systolic, 'bp_diastolic' => $record->bp_diastolic],
                ]);
            }
        }

        // ── Blood Sugar Rules ────────────────────────────────────────────────
        if ($record->blood_sugar_mgdl !== null) {

            if ($record->blood_sugar_mgdl >= 400) {
                $this->createAlert($individual, [
                    'type' => RiskAlert::TYPE_DIABETES,
                    'severity' => RiskAlert::SEVERITY_CRITICAL,
                    'reason' => "Dangerously High Blood Sugar: {$record->blood_sugar_mgdl} mg/dL — risk of diabetic crisis.",
                    'trigger_data' => ['blood_sugar_mgdl' => $record->blood_sugar_mgdl],
                ]);
            } elseif ($record->blood_sugar_mgdl >= 200) {
                $this->createAlert($individual, [
                    'type' => RiskAlert::TYPE_DIABETES,
                    'severity' => RiskAlert::SEVERITY_HIGH,
                    'reason' => "High Blood Sugar: {$record->blood_sugar_mgdl} mg/dL — possible uncontrolled diabetes, refer for HbA1c test.",
                    'trigger_data' => ['blood_sugar_mgdl' => $record->blood_sugar_mgdl],
                ]);
            } elseif ($record->blood_sugar_mgdl < 70) {
                $this->createAlert($individual, [
                    'type' => RiskAlert::TYPE_DIABETES,
                    'severity' => RiskAlert::SEVERITY_HIGH,
                    'reason' => "Hypoglycaemia: Blood sugar {$record->blood_sugar_mgdl} mg/dL — immediate sugar intake required.",
                    'trigger_data' => ['blood_sugar_mgdl' => $record->blood_sugar_mgdl],
                ]);
            }
        }

        // ── SpO2 Rules ───────────────────────────────────────────────────────
        if ($record->spo2_percent !== null) {
            if ($record->spo2_percent < 90) {
                $this->createAlert($individual, [
                    'type' => RiskAlert::TYPE_LOW_SPO2,
                    'severity' => RiskAlert::SEVERITY_CRITICAL,
                    'reason' => "Critical Low Oxygen Saturation: SpO2 {$record->spo2_percent}% — possible respiratory emergency.",
                    'trigger_data' => ['spo2_percent' => $record->spo2_percent],
                ]);
            } elseif ($record->spo2_percent < 94) {
                $this->createAlert($individual, [
                    'type' => RiskAlert::TYPE_LOW_SPO2,
                    'severity' => RiskAlert::SEVERITY_HIGH,
                    'reason' => "Low Oxygen Saturation: SpO2 {$record->spo2_percent}% — refer to facility for assessment.",
                    'trigger_data' => ['spo2_percent' => $record->spo2_percent],
                ]);
            }
        }

        // ── High Fever Rules ─────────────────────────────────────────────────
        if ($record->temperature_f !== null) {
            if ($record->temperature_f >= 104) {
                $this->createAlert($individual, [
                    'type' => RiskAlert::TYPE_HIGH_FEVER,
                    'severity' => RiskAlert::SEVERITY_CRITICAL,
                    'reason' => "Very High Fever: {$record->temperature_f}°F — risk of febrile convulsions, immediate referral.",
                    'trigger_data' => ['temperature_f' => $record->temperature_f],
                ]);
            } elseif ($record->temperature_f >= 101) {
                $this->createAlert($individual, [
                    'type' => RiskAlert::TYPE_HIGH_FEVER,
                    'severity' => RiskAlert::SEVERITY_MEDIUM,
                    'reason' => "Fever: {$record->temperature_f}°F — monitor and investigate cause.",
                    'trigger_data' => ['temperature_f' => $record->temperature_f],
                ]);
            }
        }
    }

    /**
     * Evaluate individual-level flags (malnutrition, pregnancy risk, etc.)
     */
    public function evaluateIndividual(Individual $individual): void
    {
        // ── Malnutrition Rules ────────────────────────────────────────────────
        if ($individual->malnutrition_status === 'severe') {
            $this->createAlert($individual, [
                'type' => RiskAlert::TYPE_MALNUTRITION,
                'severity' => RiskAlert::SEVERITY_CRITICAL,
                'reason' => 'Severe Acute Malnutrition (SAM) detected — immediate therapeutic feeding and medical review required.',
                'trigger_data' => ['malnutrition_status' => 'severe'],
            ]);
        } elseif ($individual->malnutrition_status === 'moderate') {
            $this->createAlert($individual, [
                'type' => RiskAlert::TYPE_MALNUTRITION,
                'severity' => RiskAlert::SEVERITY_MEDIUM,
                'reason' => 'Moderate Acute Malnutrition (MAM) detected — nutrition counselling and supplementary feeding needed.',
                'trigger_data' => ['malnutrition_status' => 'moderate'],
            ]);
        }

        // ── High-Risk Pregnancy Rules ─────────────────────────────────────────
        if ($individual->pregnancy_status === 'Yes') {
            if ($individual->age < 18) {
                $this->createAlert($individual, [
                    'type' => RiskAlert::TYPE_HIGH_RISK_PREGNANCY,
                    'severity' => RiskAlert::SEVERITY_CRITICAL,
                    'reason' => "Adolescent Pregnancy: Age {$individual->age} — high-risk case, refer to obstetrics.",
                    'trigger_data' => ['age' => $individual->age, 'pregnancy_status' => 'Yes'],
                ]);
            } elseif ($individual->age > 35) {
                $this->createAlert($individual, [
                    'type' => RiskAlert::TYPE_HIGH_RISK_PREGNANCY,
                    'severity' => RiskAlert::SEVERITY_HIGH,
                    'reason' => "Advanced Maternal Age Pregnancy: Age {$individual->age} — monitor closely, refer for antenatal check-up.",
                    'trigger_data' => ['age' => $individual->age, 'pregnancy_status' => 'Yes'],
                ]);
            }
        }
    }

    /**
     * Evaluate a lab report for abnormal values and fire alerts.
     */
    public function evaluateLabReport(LabReport $report): void
    {
        if (! $report->is_abnormal) {
            return;
        }

        $individual = $report->individual;

        $this->createAlert($individual, [
            'type' => RiskAlert::TYPE_ABNORMAL_LAB,
            'severity' => RiskAlert::SEVERITY_MEDIUM,
            'reason' => "Abnormal Lab Result: {$report->test_name} — Result: {$report->result_value} {$report->unit} (Normal: {$report->normal_range}). Lab: {$report->lab_name}.",
            'trigger_data' => [
                'test_name' => $report->test_name,
                'result_value' => $report->result_value,
                'unit' => $report->unit,
                'normal_range' => $report->normal_range,
            ],
        ]);
    }

    /**
     * Scan all overdue follow-ups and fire missed follow-up alerts.
     * Designed to be called from a scheduled Laravel command (cron).
     */
    public function evaluateOverdueFollowups(): void
    {
        $overdue = Followup::overdue()->with('individual')->get();

        foreach ($overdue as $followup) {
            $individual = $followup->individual;

            // Avoid duplicate alerts — check if one already exists today
            $alreadyAlerted = RiskAlert::where('individual_id', $individual->id)
                ->where('type', RiskAlert::TYPE_MISSED_FOLLOWUP)
                ->where('status', 'Active')
                ->whereDate('created_at', today())
                ->exists();

            if (! $alreadyAlerted) {
                $this->createAlert($individual, [
                    'type' => RiskAlert::TYPE_MISSED_FOLLOWUP,
                    'severity' => RiskAlert::SEVERITY_MEDIUM,
                    'reason' => "Missed Follow-up: Scheduled for {$followup->followup_date->format('d M Y')} — {$followup->plan_notes}",
                    'trigger_data' => [
                        'followup_id' => $followup->id,
                        'followup_date' => $followup->followup_date->toDateString(),
                    ],
                ]);
            }
        }
    }

    /**
     * Core internal method: create alert only if no active duplicate exists.
     * Prevents the same alert being fired repeatedly for the same condition.
     */
    private function createAlert(Individual $individual, array $data): void
    {
        $existingActive = RiskAlert::where('individual_id', $individual->id)
            ->where('type', $data['type'])
            ->where('status', 'Active')
            ->exists();

        if (! $existingActive) {
            RiskAlert::create(array_merge($data, [
                'individual_id' => $individual->id,
                'status' => 'Active',
            ]));
        }
    }
}
