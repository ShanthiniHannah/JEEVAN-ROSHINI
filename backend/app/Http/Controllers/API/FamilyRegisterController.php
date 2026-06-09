<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Family;
use App\Models\Individual;
use App\Models\Vaccination;
use App\Models\Pregnancy;
use App\Models\BmiRecord;
use App\Models\DiseaseRecord;
use App\Models\Village;
use App\Services\FamilyCodeService;
use App\Services\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FamilyRegisterController extends Controller
{
    protected $codeService;

    public function __construct(FamilyCodeService $codeService)
    {
        $this->codeService = $codeService;
    }

    public function register(Request $request)
    {
        $villageId = $request->input('village_id');
        if (!empty($villageId) && !is_numeric($villageId)) {
            $v = Village::where('village_code', $villageId)->first();
            if ($v) {
                $request->merge(['village_id' => $v->id]);
            }
        }

        $request->validate([
            'village_id'            => 'required|exists:villages,id',
            'house_no'              => 'required|string|max:50',
            'rooms'                 => 'nullable|integer|min:1',
            'electricity'           => 'nullable|boolean',
            'cooking_source'        => 'nullable|string|max:50',
            'toilet_availability'   => 'nullable|string|max:50',
            'water_source'          => 'nullable|string|max:50',
            'economic_status'       => 'required|string|in:APL,BPL',
            'occupation'            => 'nullable|string|max:100',
            'address'               => 'nullable|string|max:255',
            
            // Family Head
            'head.name'             => 'required|string|max:100',
            'head.age'              => 'required|integer|min:0',
            'head.gender'           => 'required|string|in:Male,Female,Other',
            'head.mobile_number'    => 'nullable|string|max:15',
            'head.blood_group'      => 'nullable|string|max:5',
            'head.marital_status'   => 'nullable|string|max:50',
            'head.education'        => 'nullable|string|max:100',
            'head.occupation'       => 'nullable|string|max:100',
            'head.income_per_month' => 'nullable|numeric|min:0',
            'head.resident_status'  => 'nullable|string|max:50',
            
            // Other Members
            'members'               => 'nullable|array',
            'members.*.name'        => 'required|string|max:100',
            'members.*.age'         => 'required|integer|min:0',
            'members.*.gender'      => 'required|string|in:Male,Female,Other',
            'members.*.relationship' => 'required|string|max:50',
            'members.*.mobile_number'=> 'nullable|string|max:15',
            'members.*.blood_group'  => 'nullable|string|max:5',
            'members.*.marital_status'=> 'nullable|string|max:50',
            'members.*.education'    => 'nullable|string|max:100',
            'members.*.occupation'   => 'nullable|string|max:100',
            'members.*.income_per_month'=> 'nullable|numeric|min:0',
            'members.*.resident_status' => 'nullable|string|max:50',
        ]);

        $villageId = $request->village_id;
        if (!is_numeric($villageId)) {
            $v = Village::where('village_code', $villageId)->first();
            if ($v) {
                $villageId = $v->id;
            }
        }

        $village = Village::with('block.district')->findOrFail($villageId);
        $stateId = $village->block?->district?->state_id;
        $blockId = $village->block_id;

        return DB::transaction(function () use ($request, $village, $stateId, $blockId) {
            $familyCode = $this->codeService->generateFamilyCode($village->id);

            // Create Family
            $family = Family::create([
                'id'                    => $familyCode,
                'family_code'           => $familyCode,
                'village_id'            => $village->id,
                'house_no'              => $request->house_no,
                'address'               => $request->address,
                'economic_status'       => $request->economic_status,
                'occupation'            => $request->occupation,
                'drinking_water_source' => $request->water_source,
                'toilet_availability'   => $request->toilet_availability,
                'state_id'              => $stateId,
                'block_id'              => $blockId,
                'cooking_source'        => $request->cooking_source,
                'registration_date'     => now()->toDateString(),
                'vhw_id'                => $request->user()?->id,
                'status'                => 'Active',
            ]);

            // Save Family Head
            $headCode = $familyCode . '-01';
            $head = Individual::create([
                'id'                  => $headCode,
                'family_id'           => $family->id,
                'name'                => $request->head['name'],
                'age'                 => $request->head['age'],
                'gender'              => $request->head['gender'],
                'mobile_number'       => $request->head['mobile_number'],
                'blood_group'         => $request->head['blood_group'],
                'pregnancy_status'    => isset($request->head['pregnancy']) ? 'Yes' : 'No',
                'vaccination_status'  => isset($request->head['vaccinations']) ? 'Yes' : 'No',
                'disability_status'   => 'No',
                'malnutrition_status' => 'none',
                'living_alone'        => 'no',
                'status'              => 'Active',
                'individual_code'     => $headCode,
                'relationship'        => 'Head',
                'marital_status'      => $request->head['marital_status'],
                'education'           => $request->head['education'],
                'occupation'          => $request->head['occupation'],
                'income_per_month'    => $request->head['income_per_month'],
                'resident_status'     => $request->head['resident_status'],
            ]);

            $this->saveHealthData($head, $request->head, $request->user()?->id ?? 3);

            // Save other members
            $createdMembers = [];
            if ($request->members && is_array($request->members)) {
                foreach ($request->members as $idx => $m) {
                    $mSeq = str_pad($idx + 2, 2, '0', STR_PAD_LEFT);
                    $memberCode = $familyCode . '-' . $mSeq;

                    $member = Individual::create([
                        'id'                  => $memberCode,
                        'family_id'           => $family->id,
                        'name'                => $m['name'],
                        'age'                 => $m['age'],
                        'gender'              => $m['gender'],
                        'mobile_number'       => $m['mobile_number'],
                        'blood_group'         => $m['blood_group'],
                        'pregnancy_status'    => isset($m['pregnancy']) ? 'Yes' : 'No',
                        'vaccination_status'  => isset($m['vaccinations']) ? 'Yes' : 'No',
                        'disability_status'   => 'No',
                        'malnutrition_status' => 'none',
                        'living_alone'        => 'no',
                        'status'              => 'Active',
                        'individual_code'     => $memberCode,
                        'relationship'        => $m['relationship'],
                        'marital_status'      => $m['marital_status'] ?? null,
                        'education'           => $m['education'] ?? null,
                        'occupation'          => $m['occupation'] ?? null,
                        'income_per_month'    => $m['income_per_month'] ?? null,
                        'resident_status'     => $m['resident_status'] ?? null,
                    ]);

                    $this->saveHealthData($member, $m, $request->user()?->id ?? 3);
                    $createdMembers[] = $member;
                }
            }

            AuditLogger::logAction('REGISTER_FAMILY', "Registered family: {$familyCode} with head {$head->name}");

            return response()->json([
                'success'      => true,
                'family'       => $family,
                'head'         => $head,
                'members'      => $createdMembers,
                'family_code'  => $familyCode,
            ], 201);
        });
    }

    private function saveHealthData(Individual $individual, array $data, int $vhwId)
    {
        // 1. Vaccinations
        if (isset($data['vaccinations']) && is_array($data['vaccinations'])) {
            foreach ($data['vaccinations'] as $vName => $dates) {
                Vaccination::create([
                    'individual_id' => $individual->id,
                    'vaccine_name'  => $vName,
                    'dose1_date'    => $dates['dose1'] ?? null,
                    'dose2_date'    => $dates['dose2'] ?? null,
                    'dose3_date'    => $dates['dose3'] ?? null,
                    'dose4_date'    => $dates['dose4'] ?? null,
                    'card_verified' => $dates['verified'] ?? false,
                    'recorded_by'   => $vhwId,
                ]);
            }
        }

        // 2. Pregnancy
        if (strtolower($individual->gender) === 'female' && isset($data['pregnancy'])) {
            $preg = $data['pregnancy'];
            Pregnancy::create([
                'individual_id'       => $individual->id,
                'lmp'                 => $preg['lmp'] ?? null,
                'edd'                 => $preg['edd'] ?? null,
                'doctor_visits'       => $preg['doctor_visits'] ?? 0,
                'usg_count'           => $preg['usg_count'] ?? 0,
                'hb_level'            => $preg['hb_level'] ?? null,
                'vaccinations'        => $preg['vaccinations'] ?? null,
                'previous_deliveries' => $preg['previous_deliveries'] ?? 0,
                'outcome'             => $preg['outcome'] ?? 'Ongoing',
                'delivery_date'       => $preg['delivery_date'] ?? null,
                'notes'               => $preg['notes'] ?? null,
                'recorded_by'         => $vhwId,
            ]);
        }

        // 3. BMI
        if (isset($data['bmi']) && isset($data['bmi']['height_cm']) && isset($data['bmi']['weight_kg'])) {
            $height = (float) $data['bmi']['height_cm'];
            $weight = (float) $data['bmi']['weight_kg'];
            if ($height > 0 && $weight > 0) {
                $bmiVal = round($weight / pow($height / 100, 2), 2);
                BmiRecord::create([
                    'individual_id' => $individual->id,
                    'height_cm'     => $height,
                    'weight_kg'     => $weight,
                    'bmi'           => $bmiVal,
                    'category'      => BmiRecord::classifyBmi($bmiVal),
                    'remarks'       => $data['bmi']['remarks'] ?? null,
                    'recorded_date' => now()->toDateString(),
                    'recorded_by'   => $vhwId,
                ]);
            }
        }

        // 4. Disease records (NCD / Chronic)
        if (isset($data['chronic_diseases']) && is_array($data['chronic_diseases'])) {
            foreach ($data['chronic_diseases'] as $disease) {
                $category = in_array($disease, ['Tuberculosis', 'Covid-15', 'Malaria', 'Dengue']) ? 'COMMUNICABLE' : 'NCD';
                $diseaseType = \App\Models\DiseaseType::firstOrCreate(
                    ['disease_name' => $disease],
                    ['category' => $category]
                );

                DiseaseRecord::create([
                    'individual_id'   => $individual->id,
                    'disease_type_id' => $diseaseType->id,
                    'duration'        => 'Chronic',
                    'recorded_by'     => $vhwId,
                ]);
            }
        }
    }
}
