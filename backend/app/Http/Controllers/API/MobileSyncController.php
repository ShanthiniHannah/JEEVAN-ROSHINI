<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CommunityProgram;
use App\Models\Family;
use App\Models\HealthRecord;
use App\Models\Individual;
use App\Models\RiskAlert;
use App\Models\Village;
use App\Models\Visit;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MobileSyncController extends Controller
{
    /**
     * Process synchronization payload from the Mobile PWA.
     */
    public function syncOfflineQueue(Request $request)
    {
        $request->validate([
            'queue' => 'required|array',
        ]);

        $queue = $request->input('queue');
        $processedCount = 0;
        $triggeredAlerts = [];

        DB::beginTransaction();

        try {
            foreach ($queue as $item) {
                $type = $item['type'] ?? '';
                $data = $item['data'] ?? [];

                if (empty($data)) {
                    continue;
                }

                switch ($type) {
                    case 'village':
                        Village::updateOrCreate(
                            ['id' => $data['id']],
                            [
                                'block_id' => $data['block_id'] ?? 1, // Fallback to default block
                                'name' => $data['name'],
                                'population' => $data['population'] ?? 0,
                                'water_status' => $data['waterStatus'] ?? 'Adequate',
                                'sanitation_status' => $data['sanitationStatus'] ?? 'Good',
                                'risk_status' => $data['riskStatus'] ?? 'Low',
                            ]
                        );
                        $processedCount++;
                        break;

                    case 'family':
                        Family::updateOrCreate(
                            ['id' => $data['id']],
                            [
                                'village_id' => $data['villageId'],
                                'house_no' => $data['houseNo'],
                                'economic_status' => $data['economicStatus'] ?? 'BPL',
                                'occupation' => $data['occupation'] ?? null,
                                'drinking_water_source' => $data['drinkingWater'] ?? 'Tap',
                                'toilet_availability' => $data['toilet'] ?? 'Yes',
                            ]
                        );
                        $processedCount++;
                        break;

                    case 'individual':
                        $individual = Individual::updateOrCreate(
                            ['id' => $data['id']],
                            [
                                'family_id' => $data['familyId'],
                                'name' => $data['name'],
                                'age' => $data['age'],
                                'gender' => $data['gender'],
                                'mobile_number' => $data['phone'] ?? null,
                                'blood_group' => $data['bloodGroup'] ?? null,
                                'pregnancy_status' => $data['pregnancyStatus'] ?? 'No',
                                'vaccination_status' => $data['vaccinationStatus'] ?? 'None',
                                'disability_status' => $data['disabilityStatus'] ?? 'No',
                                'malnutrition_status' => $data['malnutritionStatus'] ?? 'none',
                                'living_alone' => $data['livingAlone'] ?? 'no',
                            ]
                        );

                        // Save a baseline health record
                        $hasDiseases = ! empty($data['chronicDiseases']);
                        $healthRecord = HealthRecord::create([
                            'individual_id' => $individual->id,
                            'height_cm' => null,
                            'weight_kg' => null,
                            'bp_systolic' => null,
                            'bp_diastolic' => null,
                            'chronic_diseases' => $data['chronicDiseases'] ?? [],
                            'diagnosis_notes' => 'Baseline profile imported via PWA sync.',
                        ]);

                        // Server-side Clinical Risk Engine Validation
                        $alerts = $this->evaluateIndividualRisk($individual, $data['chronicDiseases'] ?? []);
                        foreach ($alerts as $al) {
                            $newAlert = RiskAlert::create([
                                'individual_id' => $individual->id,
                                'type' => $al['type'],
                                'severity' => $al['severity'],
                                'reason' => $al['reason'],
                                'status' => 'Active',
                                'date_flagged' => now(),
                            ]);
                            $triggeredAlerts[] = [
                                'patient' => $individual->name,
                                'alert_type' => $newAlert->type,
                                'reason' => $newAlert->reason,
                            ];
                        }

                        $processedCount++;
                        break;

                    case 'visit':
                        Visit::create([
                            'user_id' => $request->user()->id ?? 3, // VHW ID or default seeder
                            'family_id' => $data['familyId'],
                            'visit_date' => now(),
                            'temperature_f' => $data['tempDeg'] ?? null,
                            'bp_systolic' => $data['bpSys'] ?? null,
                            'bp_diastolic' => $data['bpDia'] ?? null,
                            'notes' => $data['notes'],
                            'gps_location' => $data['gps'] ?? null,
                            'follow_up_date' => $data['followUpDate'] ?? null,
                        ]);
                        $processedCount++;
                        break;

                    case 'program':
                        CommunityProgram::create([
                            'village_id' => $data['villageId'],
                            'topic' => $data['topic'],
                            'program_date' => now(),
                            'participants_count' => $data['participants'] ?? 0,
                            'outcome_summary' => $data['outcome'] ?? null,
                        ]);
                        $processedCount++;
                        break;
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Synchronization completed.',
                'synced_records' => $processedCount,
                'triggered_risk_alerts' => $triggeredAlerts,
            ], 200);

        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Synchronization failed: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper to evaluate clinical risks in PHP during sync
     */
    private function evaluateIndividualRisk($individual, $diseases)
    {
        $alerts = [];
        $age = intval($individual->age);
        $isFemale = strtolower($individual->gender) === 'female';
        $isPregnant = strtolower($individual->pregnancy_status) === 'yes';

        // 1. High-Risk Pregnancy
        if ($isFemale && $isPregnant) {
            if ($age < 18) {
                $alerts[] = ['type' => 'High-Risk Pregnancy', 'severity' => 'high', 'reason' => 'Teenage pregnancy (Age under 18)'];
            } elseif ($age > 35) {
                $alerts[] = ['type' => 'High-Risk Pregnancy', 'severity' => 'high', 'reason' => 'Advanced maternal age (Age over 35)'];
            }
            if (in_array('Hypertension', $diseases)) {
                $alerts[] = ['type' => 'High-Risk Pregnancy', 'severity' => 'critical', 'reason' => 'Gestational Hypertension / Preeclampsia risk'];
            }
            if (in_array('Diabetes', $diseases)) {
                $alerts[] = ['type' => 'High-Risk Pregnancy', 'severity' => 'critical', 'reason' => 'Gestational Diabetes risk'];
            }
        }

        // 2. Severe Malnutrition
        if ($age <= 5 && $individual->malnutrition_status === 'severe') {
            $alerts[] = ['type' => 'Severe Malnutrition', 'severity' => 'critical', 'reason' => 'SAM under-5 child alert'];
        }

        // 3. Elderly Alone
        if ($age >= 65 && strtolower($individual->living_alone) === 'yes') {
            $alerts[] = ['type' => 'Elderly Living Alone', 'severity' => 'high', 'reason' => 'Geriatric isolation support request'];
        }

        return $alerts;
    }
}
