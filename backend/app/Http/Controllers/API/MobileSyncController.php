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
                        $villageCode = $data['village_code'] ?? $data['id'] ?? ('VLG-' . mt_rand(1000, 9999));
                        Village::updateOrCreate(
                            ['village_code' => $villageCode],
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
                        $familyCode = $data['family_code'] ?? $data['id'] ?? ('FAM-' . mt_rand(1000, 9999));
                        
                        // Resolve villageId string code to DB integer ID
                        $villageId = $data['villageId'] ?? $data['village_id'] ?? null;
                        if (!empty($villageId) && !is_numeric($villageId)) {
                            $village = Village::where('village_code', $villageId)->first();
                            if ($village) {
                                $villageId = $village->id;
                            }
                        }

                        Family::updateOrCreate(
                            ['family_code' => $familyCode],
                            [
                                'village_id' => $villageId,
                                'house_no' => $data['houseNo'] ?? $data['house_no'],
                                'economic_status' => $data['economicStatus'] ?? $data['economic_status'] ?? 'BPL',
                                'occupation' => $data['occupation'] ?? null,
                                'drinking_water_source' => $data['drinkingWater'] ?? $data['drinking_water_source'] ?? 'Tap',
                                'toilet_availability' => $data['toilet'] ?? $data['toilet_availability'] ?? 'Yes',
                            ]
                        );
                        $processedCount++;
                        break;

                    case 'individual':
                        $individualCode = $data['individual_code'] ?? $data['id'] ?? ('JR-' . mt_rand(1000, 9999));

                        // Resolve familyId string code to DB integer ID
                        $familyId = $data['familyId'] ?? $data['family_id'] ?? null;
                        if (!empty($familyId) && !is_numeric($familyId)) {
                            $family = Family::where('family_code', $familyId)->first();
                            if ($family) {
                                $familyId = $family->id;
                            }
                        }

                        $individual = Individual::updateOrCreate(
                            ['individual_code' => $individualCode],
                            [
                                'family_id' => $familyId,
                                'name' => $data['name'],
                                'age' => $data['age'],
                                'gender' => $data['gender'],
                                'mobile_number' => $data['phone'] ?? $data['mobile_number'] ?? null,
                                'blood_group' => $data['bloodGroup'] ?? $data['blood_group'] ?? null,
                                'pregnancy_status' => $data['pregnancyStatus'] ?? $data['pregnancy_status'] ?? 'No',
                                'vaccination_status' => $data['vaccinationStatus'] ?? $data['vaccination_status'] ?? 'None',
                                'disability_status' => $data['disabilityStatus'] ?? $data['disability_status'] ?? 'No',
                                'malnutrition_status' => $data['malnutritionStatus'] ?? $data['malnutrition_status'] ?? 'none',
                                'living_alone' => $data['livingAlone'] ?? $data['living_alone'] ?? 'no',
                            ]
                        );

                        // Save a baseline health record safely by assigning non-fillable required fields directly
                        $healthRecord = new HealthRecord([
                            'individual_id' => $individual->id,
                            'height_cm' => null,
                            'weight_kg' => null,
                            'bp_systolic' => null,
                            'bp_diastolic' => null,
                            'chronic_diseases' => $data['chronicDiseases'] ?? [],
                        ]);
                        $healthRecord->general_notes = 'Baseline profile imported via PWA sync.';
                        $healthRecord->recorded_on = now()->toDateString();
                        $healthRecord->recorded_by = $request->user()->id ?? 3;
                        $healthRecord->save();

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
                        // Resolve familyId string code to DB integer ID
                        $familyId = $data['familyId'] ?? $data['family_id'] ?? null;
                        if (!empty($familyId) && !is_numeric($familyId)) {
                            $family = Family::where('family_code', $familyId)->first();
                            if ($family) {
                                $familyId = $family->id;
                            }
                        }

                        Visit::create([
                            'user_id' => $request->user()?->id ?? 3, // VHW ID or default seeder
                            'family_id' => $familyId,
                            'visit_date' => now(),
                            'temperature_f' => $data['tempDeg'] ?? $data['temperature_f'] ?? null,
                            'bp_systolic' => $data['bpSys'] ?? $data['bp_systolic'] ?? null,
                            'bp_diastolic' => $data['bpDia'] ?? $data['bp_diastolic'] ?? null,
                            'notes' => $data['notes'],
                            'gps_location' => $data['gps'] ?? $data['gps_location'] ?? null,
                            'follow_up_date' => $data['followUpDate'] ?? $data['follow_up_date'] ?? null,
                        ]);
                        $processedCount++;
                        break;

                    case 'program':
                        // Resolve villageId string code to DB integer ID
                        $villageId = $data['villageId'] ?? $data['village_id'] ?? null;
                        if (!empty($villageId) && !is_numeric($villageId)) {
                            $village = Village::where('village_code', $villageId)->first();
                            if ($village) {
                                $villageId = $village->id;
                            }
                        }

                        CommunityProgram::create([
                            'village_id' => $villageId,
                            'topic' => $data['topic'],
                            'program_date' => now(),
                            'participants_count' => $data['participants'] ?? $data['participants_count'] ?? 0,
                            'outcome_summary' => $data['outcome'] ?? $data['outcome_summary'] ?? null,
                        ]);
                        $processedCount++;
                        break;

                    case 'family_registration':
                        $controller = app()->make(\App\Http\Controllers\API\FamilyRegisterController::class);
                        $subRequest = new \Illuminate\Http\Request();
                        $subRequest->replace($data);
                        $subRequest->setUserResolver(fn() => $request->user());
                        $controller->register($subRequest);
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
