<?php

namespace Database\Seeders;

use App\Models\DailySession;
use App\Models\AuditLog;
use App\Models\BeneficiarySupport;
use App\Models\Block;
use App\Models\CommunityProgram;
use App\Models\District;
use App\Models\Family;
use App\Models\Individual;
use App\Models\Notification;
use App\Models\Organization;
use App\Models\StaffProfile;
use App\Models\Training;
use App\Models\TrainingSession;
use App\Models\User;
use App\Models\Village;
use App\Models\VulnerableGroup;
use App\Models\HealthProfile;
use App\Models\DiseaseType;
use App\Models\DiseaseRecord;
use App\Models\Visit;
use App\Models\VisitPhoto;
use App\Models\Medicine;
use App\Models\MedicineStock;
use App\Models\MedicineRequest;
use App\Models\Budget;
use App\Models\Expense;
use App\Models\Sponsor;
use App\Models\SponsorContribution;
use App\Models\ExpansionProject;
use App\Models\Announcement;
use App\Models\State;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ─────────────────────────────────────────────────────────────────
        // 0. RESOLVE EXISTING SEEDED USERS
        // ─────────────────────────────────────────────────────────────────
        $adminUser = User::where('email', 'admin@ayathanatrust.org')->first();
        $directorUser = User::where('email', 'director@ayathanatrust.org')->first();
        $vhwUser1 = User::where('email', 'preema@ayathanatrust.org')->first();
        $financeUser = User::where('email', 'finance@ayathanatrust.org')->first();

        // Create a second VHW for richer data
        $vhwUser2 = User::firstOrCreate(
            ['email' => 'suresh.vhw@ayathanatrust.org'],
            [
                'name' => 'Suresh Naik',
                'password' => Hash::make('vhw123'),
                'status' => 'Active',
                'must_change_password' => false,
            ]
        );
        if ($vhwUser2->wasRecentlyCreated) {
            $vhwUser2->assignRole('vhw');
        }

        // ─────────────────────────────────────────────────────────────────
        // 1. ORGANIZATION
        // ─────────────────────────────────────────────────────────────────
        $org = Organization::create([
            'name' => 'Ayathana Trust',
            'description' => 'Ayathana Trust is a non-profit organization committed to community health development in rural Karnataka.',
            'contact_email' => 'info@ayathanatrust.org',
            'address' => 'No. 12, Gandhi Nagar, Chikkamagaluru - 577101, Karnataka, India',
            'status' => 'Active',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 2. STATES
        // ─────────────────────────────────────────────────────────────────
        $stateKA = State::where('code', 'KA')->first();
        if (!$stateKA) {
            $stateKA = State::create(['name' => 'Karnataka', 'code' => 'KA', 'status' => 'Active']);
        }

        // ─────────────────────────────────────────────────────────────────
        // 3. DISTRICTS
        // ─────────────────────────────────────────────────────────────────
        $distChikkamagaluru = District::create([
            'organization_id' => $org->id,
            'state_id' => $stateKA->id,
            'name' => 'Chikkamagaluru',
        ]);

        $distShivamogga = District::create([
            'organization_id' => $org->id,
            'state_id' => $stateKA->id,
            'name' => 'Shivamogga',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 4. BLOCKS / TALUKS
        // ─────────────────────────────────────────────────────────────────
        $blockMudigere = Block::create([
            'district_id' => $distChikkamagaluru->id,
            'name' => 'Mudigere',
            'code' => 'BLK-MDG-01',
        ]);

        $blockKadur = Block::create([
            'district_id' => $distChikkamagaluru->id,
            'name' => 'Kadur',
            'code' => 'BLK-KDR-02',
        ]);

        $blockSagar = Block::create([
            'district_id' => $distShivamogga->id,
            'name' => 'Sagar',
            'code' => 'BLK-SGR-01',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 5. VILLAGES  (5 villages)
        // ─────────────────────────────────────────────────────────────────
        $villageBettadapura = Village::create([
            'village_code' => 'VLG-4829',
            'block_id' => $blockMudigere->id,
            'name' => 'Bettadapura',
            'population' => 1240,
            'water_status' => 'Adequate',
            'sanitation_status' => 'Moderate',
            'risk_status' => 'Medium',
            'geo_lat' => 13.12380000,
            'geo_lng' => 75.94210000,
        ]);

        $villageHiriyur = Village::create([
            'village_code' => 'VLG-4830',
            'block_id' => $blockMudigere->id,
            'name' => 'Hiriyur Koppalu',
            'population' => 870,
            'water_status' => 'Contaminated',
            'sanitation_status' => 'Poor',
            'risk_status' => 'High',
            'geo_lat' => 13.09510000,
            'geo_lng' => 75.96730000,
        ]);

        $villageMalalu = Village::create([
            'village_code' => 'VLG-4831',
            'block_id' => $blockKadur->id,
            'name' => 'Malalu',
            'population' => 640,
            'water_status' => 'Adequate',
            'sanitation_status' => 'Good',
            'risk_status' => 'Low',
            'geo_lat' => 13.54720000,
            'geo_lng' => 76.00850000,
        ]);

        $villageKavalande = Village::create([
            'village_code' => 'VLG-4832',
            'block_id' => $blockKadur->id,
            'name' => 'Kavalande',
            'population' => 510,
            'water_status' => 'Adequate',
            'sanitation_status' => 'Moderate',
            'risk_status' => 'Low',
            'geo_lat' => 13.60190000,
            'geo_lng' => 76.02340000,
        ]);

        $villageSomanahalli = Village::create([
            'village_code' => 'VLG-4833',
            'block_id' => $blockSagar->id,
            'name' => 'Somanahalli',
            'population' => 390,
            'water_status' => 'Scarcity',
            'sanitation_status' => 'Poor',
            'risk_status' => 'High',
            'geo_lat' => 14.17340000,
            'geo_lng' => 75.02980000,
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 6. STAFF PROFILES & VILLAGE ASSIGNMENTS
        // ─────────────────────────────────────────────────────────────────
        StaffProfile::create([
            'user_id' => $vhwUser1->id,
            'designation' => 'Village Health Worker',
            'contact_number' => '9876543210',
        ]);
        DB::table('village_assignments')->insert([
            ['user_id' => $vhwUser1->id, 'village_id' => $villageBettadapura->id, 'assigned_date' => now(), 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $vhwUser1->id, 'village_id' => $villageHiriyur->id, 'assigned_date' => now(), 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
        ]);

        StaffProfile::create([
            'user_id' => $vhwUser2->id,
            'designation' => 'Village Health Worker',
            'contact_number' => '9988776655',
        ]);
        DB::table('village_assignments')->insert([
            ['user_id' => $vhwUser2->id, 'village_id' => $villageMalalu->id, 'assigned_date' => now(), 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $vhwUser2->id, 'village_id' => $villageKavalande->id, 'assigned_date' => now(), 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $vhwUser2->id, 'village_id' => $villageSomanahalli->id, 'assigned_date' => now(), 'status' => 'Active', 'created_at' => now(), 'updated_at' => now()],
        ]);

        StaffProfile::create([
            'user_id' => $directorUser->id,
            'designation' => 'Project Director',
            'contact_number' => '9123456789',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 7. FAMILIES
        // ─────────────────────────────────────────────────────────────────
        $famGowda = Family::create([
            'family_code' => 'FAM-4829-001',
            'state_id' => $stateKA->id,
            'district_id' => $distChikkamagaluru->id,
            'block_id' => $blockMudigere->id,
            'village_id' => $villageBettadapura->id,
            'house_no' => 'H-001',
            'address' => 'Near Bus Stand, Bettadapura',
            'economic_status' => 'BPL',
            'occupation' => 'Agriculture',
            'drinking_water_source' => 'Tap',
            'toilet_availability' => 'Yes',
            'insurance_details' => 'PM-JAY',
            'vhw_id' => $vhwUser1->id,
            'registration_date' => Carbon::now()->subDays(20)->toDateString(),
        ]);

        $famKumar = Family::create([
            'family_code' => 'FAM-4829-002',
            'state_id' => $stateKA->id,
            'district_id' => $distChikkamagaluru->id,
            'block_id' => $blockMudigere->id,
            'village_id' => $villageBettadapura->id,
            'house_no' => 'H-022',
            'address' => 'Main Road, Bettadapura',
            'economic_status' => 'APL',
            'occupation' => 'Daily Labour',
            'drinking_water_source' => 'Well',
            'toilet_availability' => 'No',
            'insurance_details' => null,
            'vhw_id' => $vhwUser1->id,
            'registration_date' => Carbon::now()->subDays(19)->toDateString(),
        ]);

        $famNaik = Family::create([
            'family_code' => 'FAM-4829-003',
            'state_id' => $stateKA->id,
            'district_id' => $distChikkamagaluru->id,
            'block_id' => $blockMudigere->id,
            'village_id' => $villageBettadapura->id,
            'house_no' => 'H-045',
            'address' => 'Coffee Estate Colony, Bettadapura',
            'economic_status' => 'BPL',
            'occupation' => 'Coffee Plantation Worker',
            'drinking_water_source' => 'Handpump',
            'toilet_availability' => 'Yes',
            'insurance_details' => 'Arogya Sanjeevini',
            'vhw_id' => $vhwUser1->id,
            'registration_date' => Carbon::now()->subDays(18)->toDateString(),
        ]);

        $famRaju = Family::create([
            'family_code' => 'FAM-4830-001',
            'state_id' => $stateKA->id,
            'district_id' => $distChikkamagaluru->id,
            'block_id' => $blockMudigere->id,
            'village_id' => $villageHiriyur->id,
            'house_no' => 'H-003',
            'address' => 'North Colony, Hiriyur Koppalu',
            'economic_status' => 'Antyodaya',
            'occupation' => 'Sheep Rearing',
            'drinking_water_source' => 'River',
            'toilet_availability' => 'No',
            'insurance_details' => 'PM-JAY',
            'vhw_id' => $vhwUser1->id,
            'registration_date' => Carbon::now()->subDays(17)->toDateString(),
        ]);

        $famDevi = Family::create([
            'family_code' => 'FAM-4830-002',
            'state_id' => $stateKA->id,
            'district_id' => $distChikkamagaluru->id,
            'block_id' => $blockMudigere->id,
            'village_id' => $villageHiriyur->id,
            'house_no' => 'H-018',
            'address' => 'South Street, Hiriyur Koppalu',
            'economic_status' => 'BPL',
            'occupation' => 'Agriculture',
            'drinking_water_source' => 'Well',
            'toilet_availability' => 'Yes',
            'insurance_details' => 'Arogya Sanjeevini',
            'vhw_id' => $vhwUser1->id,
            'registration_date' => Carbon::now()->subDays(16)->toDateString(),
        ]);

        $famRamesh = Family::create([
            'family_code' => 'FAM-4831-001',
            'state_id' => $stateKA->id,
            'district_id' => $distChikkamagaluru->id,
            'block_id' => $blockKadur->id,
            'village_id' => $villageMalalu->id,
            'house_no' => 'H-007',
            'address' => 'Temple Street, Malalu',
            'economic_status' => 'APL',
            'occupation' => 'Shopkeeper',
            'drinking_water_source' => 'Tap',
            'toilet_availability' => 'Yes',
            'insurance_details' => null,
            'vhw_id' => $vhwUser2->id,
            'registration_date' => Carbon::now()->subDays(15)->toDateString(),
        ]);

        $famShetty = Family::create([
            'family_code' => 'FAM-4832-001',
            'state_id' => $stateKA->id,
            'district_id' => $distChikkamagaluru->id,
            'block_id' => $blockKadur->id,
            'village_id' => $villageKavalande->id,
            'house_no' => 'H-012',
            'address' => 'Kavalande Main Village',
            'economic_status' => 'BPL',
            'occupation' => 'Fishing',
            'drinking_water_source' => 'River',
            'toilet_availability' => 'No',
            'insurance_details' => 'PM-JAY',
            'vhw_id' => $vhwUser2->id,
            'registration_date' => Carbon::now()->subDays(14)->toDateString(),
        ]);

        $famPillai = Family::create([
            'family_code' => 'FAM-4833-001',
            'state_id' => $stateKA->id,
            'district_id' => $distShivamogga->id,
            'block_id' => $blockSagar->id,
            'village_id' => $villageSomanahalli->id,
            'house_no' => 'H-001',
            'address' => 'Somanahalli Hamlet',
            'economic_status' => 'Antyodaya',
            'occupation' => 'Agriculture',
            'drinking_water_source' => 'Handpump',
            'toilet_availability' => 'No',
            'insurance_details' => 'PM-JAY',
            'vhw_id' => $vhwUser2->id,
            'registration_date' => Carbon::now()->subDays(13)->toDateString(),
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 8. INDIVIDUALS & HEALTH PROFILES
        // ─────────────────────────────────────────────────────────────────
        
        // ── Family: FAM-4829-001 (Gowda) ──────────────────────────────
        $ind01 = Individual::create([
            'family_id' => $famGowda->id,
            'individual_code' => 'JR-4829-001',
            'name' => 'Manjula Gowda',
            'relationship' => 'Spouse',
            'date_of_birth' => Carbon::now()->subYears(32),
            'age' => 32,
            'gender' => 'Female',
            'mobile_number' => '9876543001',
            'aadhaar_masked' => 'XXXX-XXXX-3401',
            'blood_group' => 'B+',
            'malnutrition_status' => 'none',
            'living_alone' => 'no',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind01->id,
            'pregnancy_status' => 'Yes',
            'vaccination_status' => 'Full',
            'disability_status' => 'No',
            'risk_category' => 'High',
        ]);

        $ind02 = Individual::create([
            'family_id' => $famGowda->id,
            'individual_code' => 'JR-4829-002',
            'name' => 'Raju Gowda',
            'relationship' => 'Head',
            'date_of_birth' => Carbon::now()->subYears(35),
            'age' => 35,
            'gender' => 'Male',
            'mobile_number' => '9876543002',
            'aadhaar_masked' => 'XXXX-XXXX-3402',
            'blood_group' => 'O+',
            'malnutrition_status' => 'none',
            'living_alone' => 'no',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind02->id,
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Full',
            'disability_status' => 'No',
            'risk_category' => 'Low',
        ]);

        $ind03 = Individual::create([
            'family_id' => $famGowda->id,
            'individual_code' => 'JR-4829-003',
            'name' => 'Baby Gowda',
            'relationship' => 'Daughter',
            'date_of_birth' => Carbon::now()->subMonths(6),
            'age' => 0,
            'gender' => 'Female',
            'mobile_number' => null,
            'aadhaar_masked' => null,
            'blood_group' => 'B+',
            'malnutrition_status' => 'moderate',
            'living_alone' => 'no',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind03->id,
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Partial',
            'disability_status' => 'No',
            'risk_category' => 'Medium',
        ]);

        // ── Family: FAM-4829-002 (Kumar) ──────────────────────────────
        $ind04 = Individual::create([
            'family_id' => $famKumar->id,
            'individual_code' => 'JR-4829-004',
            'name' => 'Shantha Kumar',
            'relationship' => 'Head',
            'date_of_birth' => Carbon::now()->subYears(62),
            'age' => 62,
            'gender' => 'Female',
            'mobile_number' => '9876543003',
            'aadhaar_masked' => 'XXXX-XXXX-5501',
            'blood_group' => 'A+',
            'malnutrition_status' => 'none',
            'living_alone' => 'yes',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind04->id,
            'allergy_history' => 'Penicillin',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Partial',
            'disability_status' => 'No',
            'risk_category' => 'Medium',
        ]);

        // ── Family: FAM-4829-003 (Naik) ──────────────────────────────
        $ind05 = Individual::create([
            'family_id' => $famNaik->id,
            'individual_code' => 'JR-4829-005',
            'name' => 'Veerappa Naik',
            'relationship' => 'Head',
            'date_of_birth' => Carbon::now()->subYears(45),
            'age' => 45,
            'gender' => 'Male',
            'mobile_number' => '9876543004',
            'aadhaar_masked' => 'XXXX-XXXX-7701',
            'blood_group' => 'AB+',
            'malnutrition_status' => 'none',
            'living_alone' => 'no',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind05->id,
            'pregnancy_status' => 'No',
            'vaccination_status' => 'None',
            'disability_status' => 'Yes',
            'risk_category' => 'Medium',
        ]);

        $ind06 = Individual::create([
            'family_id' => $famNaik->id,
            'individual_code' => 'JR-4829-006',
            'name' => 'Suma Naik',
            'relationship' => 'Spouse',
            'date_of_birth' => Carbon::now()->subYears(28),
            'age' => 28,
            'gender' => 'Female',
            'mobile_number' => '9876543005',
            'aadhaar_masked' => 'XXXX-XXXX-7702',
            'blood_group' => 'O-',
            'malnutrition_status' => 'severe',
            'living_alone' => 'no',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind06->id,
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Full',
            'disability_status' => 'No',
            'risk_category' => 'High',
        ]);

        // ── Family: FAM-4830-001 (Raju) ──────────────────────────────
        $ind07 = Individual::create([
            'family_id' => $famRaju->id,
            'individual_code' => 'JR-4830-001',
            'name' => 'Chandra Raju',
            'relationship' => 'Head',
            'date_of_birth' => Carbon::now()->subYears(70),
            'age' => 70,
            'gender' => 'Male',
            'mobile_number' => null,
            'aadhaar_masked' => 'XXXX-XXXX-8801',
            'blood_group' => 'B-',
            'malnutrition_status' => 'moderate',
            'living_alone' => 'yes',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind07->id,
            'allergy_history' => 'Aspirin',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Partial',
            'disability_status' => 'No',
            'risk_category' => 'High',
        ]);

        $ind08 = Individual::create([
            'family_id' => $famRaju->id,
            'individual_code' => 'JR-4830-002',
            'name' => 'Kaveri Raju',
            'relationship' => 'Daughter',
            'date_of_birth' => Carbon::now()->subYears(14),
            'age' => 14,
            'gender' => 'Female',
            'mobile_number' => null,
            'aadhaar_masked' => 'XXXX-XXXX-8802',
            'blood_group' => 'A-',
            'malnutrition_status' => 'severe',
            'living_alone' => 'no',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind08->id,
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Full',
            'disability_status' => 'No',
            'risk_category' => 'High',
        ]);

        // ── Family: FAM-4830-002 (Devi) ──────────────────────────────
        $ind09 = Individual::create([
            'family_id' => $famDevi->id,
            'individual_code' => 'JR-4830-003',
            'name' => 'Lakshmi Devi',
            'relationship' => 'Head',
            'date_of_birth' => Carbon::now()->subYears(25),
            'age' => 25,
            'gender' => 'Female',
            'mobile_number' => '9876543006',
            'aadhaar_masked' => 'XXXX-XXXX-9901',
            'blood_group' => 'O+',
            'malnutrition_status' => 'moderate',
            'living_alone' => 'no',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind09->id,
            'pregnancy_status' => 'Yes',
            'vaccination_status' => 'Full',
            'disability_status' => 'No',
            'risk_category' => 'Critical',
        ]);

        // ── Family: FAM-4831-001 (Ramesh) ──────────────────────────────
        $ind10 = Individual::create([
            'family_id' => $famRamesh->id,
            'individual_code' => 'JR-4831-001',
            'name' => 'Gopal Ramesh',
            'relationship' => 'Head',
            'date_of_birth' => Carbon::now()->subYears(52),
            'age' => 52,
            'gender' => 'Male',
            'mobile_number' => '9876543007',
            'aadhaar_masked' => 'XXXX-XXXX-1101',
            'blood_group' => 'A+',
            'malnutrition_status' => 'none',
            'living_alone' => 'no',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind10->id,
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Full',
            'disability_status' => 'No',
            'risk_category' => 'Low',
        ]);

        $ind11 = Individual::create([
            'family_id' => $famRamesh->id,
            'individual_code' => 'JR-4831-002',
            'name' => 'Priya Ramesh',
            'relationship' => 'Daughter',
            'date_of_birth' => Carbon::now()->subYears(3),
            'age' => 3,
            'gender' => 'Female',
            'mobile_number' => null,
            'aadhaar_masked' => null,
            'blood_group' => 'A+',
            'malnutrition_status' => 'moderate',
            'living_alone' => 'no',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind11->id,
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Partial',
            'disability_status' => 'No',
            'risk_category' => 'Medium',
        ]);

        // ── Family: FAM-4832-001 (Shetty) ──────────────────────────────
        $ind12 = Individual::create([
            'family_id' => $famShetty->id,
            'individual_code' => 'JR-4832-001',
            'name' => 'Ravi Shetty',
            'relationship' => 'Head',
            'date_of_birth' => Carbon::now()->subYears(40),
            'age' => 40,
            'gender' => 'Male',
            'mobile_number' => '9876543008',
            'aadhaar_masked' => 'XXXX-XXXX-2201',
            'blood_group' => 'B+',
            'malnutrition_status' => 'none',
            'living_alone' => 'no',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind12->id,
            'pregnancy_status' => 'No',
            'vaccination_status' => 'None',
            'disability_status' => 'No',
            'risk_category' => 'Low',
        ]);

        $ind13 = Individual::create([
            'family_id' => $famShetty->id,
            'individual_code' => 'JR-4832-002',
            'name' => 'Anitha Shetty',
            'relationship' => 'Daughter',
            'date_of_birth' => Carbon::now()->subYears(8),
            'age' => 8,
            'gender' => 'Female',
            'mobile_number' => null,
            'aadhaar_masked' => null,
            'blood_group' => 'O+',
            'malnutrition_status' => 'none',
            'living_alone' => 'no',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind13->id,
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Full',
            'disability_status' => 'No',
            'risk_category' => 'Low',
        ]);

        // ── Family: FAM-4833-001 (Pillai) ──────────────────────────────
        $ind14 = Individual::create([
            'family_id' => $famPillai->id,
            'individual_code' => 'JR-4833-001',
            'name' => 'Mariamma Pillai',
            'relationship' => 'Head',
            'date_of_birth' => Carbon::now()->subYears(68),
            'age' => 68,
            'gender' => 'Female',
            'mobile_number' => null,
            'aadhaar_masked' => 'XXXX-XXXX-3301',
            'blood_group' => 'AB-',
            'malnutrition_status' => 'moderate',
            'living_alone' => 'yes',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind14->id,
            'allergy_history' => 'Sulfa drugs',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Partial',
            'disability_status' => 'Yes',
            'risk_category' => 'High',
        ]);

        $ind15 = Individual::create([
            'family_id' => $famPillai->id,
            'individual_code' => 'JR-4833-002',
            'name' => 'Thomas Pillai (Orphan)',
            'relationship' => 'Grandson',
            'date_of_birth' => Carbon::now()->subYears(9),
            'age' => 9,
            'gender' => 'Male',
            'mobile_number' => null,
            'aadhaar_masked' => null,
            'blood_group' => null,
            'malnutrition_status' => 'severe',
            'living_alone' => 'no',
            'status' => 'Active',
        ]);
        HealthProfile::create([
            'individual_id' => $ind15->id,
            'pregnancy_status' => 'No',
            'vaccination_status' => 'None',
            'disability_status' => 'No',
            'risk_category' => 'High',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 9. DISEASE TYPES & DISEASE RECORDS
        // ─────────────────────────────────────────────────────────────────
        $dtHypertension = DiseaseType::create(['disease_name' => 'Hypertension', 'category' => 'NCD']);
        $dtDiabetes = DiseaseType::create(['disease_name' => 'Diabetes', 'category' => 'NCD']);
        $dtTuberculosis = DiseaseType::create(['disease_name' => 'Tuberculosis', 'category' => 'COMMUNICABLE']);
        $dtCancer = DiseaseType::create(['disease_name' => 'Cervical Cancer', 'category' => 'NCD']);

        // Shantha Kumar has Hypertension
        DiseaseRecord::create([
            'individual_id' => $ind04->id,
            'disease_type_id' => $dtHypertension->id,
            'known_case' => true,
            'family_history' => true,
            'duration' => '3 years',
            'medication' => 'Amlodipine 5mg QD',
            'diagnosed_date' => Carbon::now()->subYears(3),
            'status' => 'Active',
            'recorded_by' => $vhwUser1->id,
        ]);

        // Chandra Raju has Diabetes
        DiseaseRecord::create([
            'individual_id' => $ind07->id,
            'disease_type_id' => $dtDiabetes->id,
            'known_case' => true,
            'family_history' => false,
            'duration' => '5 years',
            'medication' => 'Metformin 500mg BID',
            'diagnosed_date' => Carbon::now()->subYears(5),
            'status' => 'Active',
            'recorded_by' => $vhwUser1->id,
        ]);

        // Mariamma Pillai has Cancer
        DiseaseRecord::create([
            'individual_id' => $ind14->id,
            'disease_type_id' => $dtCancer->id,
            'known_case' => true,
            'family_history' => false,
            'duration' => '1 year',
            'medication' => 'Palliative supportive medications',
            'diagnosed_date' => Carbon::now()->subYear(),
            'status' => 'Active',
            'recorded_by' => $vhwUser2->id,
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 10. VISITS & VISIT PHOTOS
        // ─────────────────────────────────────────────────────────────────
        $visitGowda = Visit::create([
            'user_id' => $vhwUser1->id,
            'family_id' => $famGowda->id,
            'visit_date' => Carbon::now()->subDays(5)->toDateString(),
            'temperature_f' => 98.4,
            'bp_systolic' => 120,
            'bp_diastolic' => 80,
            'pulse_rate' => 72,
            'notes' => 'ANC regular check-up. Manjula is in her 2nd trimester. Checked vitals and validated nutrition kit intake.',
            'gps_location' => '13.12385000,75.94215000',
            'gps_verified' => true,
            'follow_up_date' => Carbon::now()->addDays(10)->toDateString(),
            'status' => 'Submitted',
        ]);
        VisitPhoto::create([
            'visit_id' => $visitGowda->id,
            'photo_path' => 'visits/gowda_visit_photo.jpg',
            'captured_at' => Carbon::now()->subDays(5)->subMinutes(15),
        ]);

        $visitKumar = Visit::create([
            'user_id' => $vhwUser1->id,
            'family_id' => $famKumar->id,
            'visit_date' => Carbon::now()->subDays(2)->toDateString(),
            'temperature_f' => 99.0,
            'bp_systolic' => 145, // Elevated
            'bp_diastolic' => 95,
            'pulse_rate' => 84,
            'notes' => 'BP is elevated. Recommended reduction in salt intake. Shantha requested old age pension support status check.',
            'gps_location' => '13.12410000,75.94230000',
            'gps_verified' => true,
            'follow_up_date' => Carbon::now()->addDays(3)->toDateString(),
            'status' => 'Submitted',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 11. COMMUNITY PROGRAMS
        // ─────────────────────────────────────────────────────────────────
        CommunityProgram::create([
            'village_id' => $villageBettadapura->id,
            'topic' => 'Menstrual Hygiene & Reproductive Health',
            'program_date' => Carbon::now()->subDays(14)->toDateString(),
            'participants_count' => 38,
            'outcome_summary' => 'Distributed 38 sanitary kits. Educated women on menstrual hygiene and infection prevention.',
            'photo_path' => 'programs/bettadapura_menstrual_2026-05-13.jpg',
            'feedback_text' => 'Participants appreciated the session. Requested follow-up on maternal nutrition.',
            'status' => 'Approved',
        ]);

        CommunityProgram::create([
            'village_id' => $villageHiriyur->id,
            'topic' => 'Tobacco Prevention & Cancer Awareness',
            'program_date' => Carbon::now()->subDays(7)->toDateString(),
            'participants_count' => 55,
            'outcome_summary' => 'Conducted street play on dangers of tobacco use. Referred 3 cases to PHC Mudigere.',
            'photo_path' => 'programs/hiriyur_tobacco_2026-05-20.jpg',
            'feedback_text' => 'Village panchayat expressed willingness to declare village tobacco-free.',
            'status' => 'Approved',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 12. TRAININGS & SESSIONS
        // ─────────────────────────────────────────────────────────────────
        $training1 = Training::create([
            'title' => 'Maternal & Child Health — VHW Certification Module 1',
            'instructor' => 'Dr. Anitha Rao',
            'scheduled_date' => Carbon::now()->subDays(30)->toDateString(),
            'venue' => 'Mudigere Community Hall',
            'video_url' => 'https://training.ayathanatrust.org/videos/mch-module-1.mp4',
            'quiz_questions' => [
                [
                    'question' => 'What is the normal range for haemoglobin in a pregnant woman?',
                    'options' => ['6–8 g/dL', '9–10 g/dL', '11–13 g/dL', 'Above 14 g/dL'],
                    'answer' => '11–13 g/dL',
                ]
            ],
            'description' => 'MCH and ANC checkup processes training.',
            'status' => 'Completed',
        ]);

        TrainingSession::create([
            'training_id' => $training1->id,
            'user_id' => $vhwUser1->id,
            'attended' => true,
            'completed_at' => Carbon::now()->subDays(28),
            'quiz_score' => 88,
            'certificate_path' => 'certificates/preema_mch_module1_cert.pdf',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 13. DAILY SESSIONS (AUTOMATED ATTENDANCE)
        // ─────────────────────────────────────────────────────────────────
        $vhwUsers = [$vhwUser1, $vhwUser2];
        for ($i = 6; $i >= 1; $i--) {
            $sessionDate = Carbon::now()->subDays($i)->toDateString();
            $dayOfWeek = Carbon::now()->subDays($i)->dayOfWeek;

            foreach ($vhwUsers as $idx => $vhw) {
                if ($dayOfWeek === Carbon::SUNDAY) {
                    DailySession::create([
                        'vhw_id' => $vhw->id,
                        'session_date' => $sessionDate,
                        'login_time' => null,
                        'logout_time' => null,
                        'attendance_status' => 'Leave',
                    ]);
                } else {
                    DailySession::create([
                        'vhw_id' => $vhw->id,
                        'session_date' => $sessionDate,
                        'login_time' => '08:15:00',
                        'logout_time' => '17:30:00',
                        'attendance_status' => 'Present',
                    ]);
                }
            }
        }

        // ─────────────────────────────────────────────────────────────────
        // 14. VULNERABLE GROUPS
        // ─────────────────────────────────────────────────────────────────
        VulnerableGroup::create([
            'individual_id' => $ind04->id,
            'category' => 'Widow',
            'special_notes' => 'Widowed 3 years ago. Hypertension history. Needs monthly BP monitoring.',
        ]);

        VulnerableGroup::create([
            'individual_id' => $ind07->id,
            'category' => 'Elderly Living Alone',
            'special_notes' => 'Lives alone. Diabetic. Assigned for fortnightly checks.',
        ]);

        VulnerableGroup::create([
            'individual_id' => $ind14->id,
            'category' => 'Palliative Patient',
            'special_notes' => 'Stage 3 cervical cancer. Enrolled in palliative support care.',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 15. BENEFICIARY SUPPORT RECORDS
        // ─────────────────────────────────────────────────────────────────
        BeneficiarySupport::create([
            'individual_id' => $ind03->id,
            'support_type' => 'Nutrition Kit',
            'description' => 'Fortified cereals and high-nutrition baby diet supplies.',
            'financial_amount' => 0.00,
            'status' => 'Distributed',
            'distribution_date' => Carbon::now()->subDays(10)->toDateString(),
        ]);

        BeneficiarySupport::create([
            'individual_id' => $ind04->id,
            'support_type' => 'Financial Assistance',
            'description' => 'IGNOAPS pension scheme support.',
            'financial_amount' => 1000.00,
            'status' => 'Distributed',
            'distribution_date' => Carbon::now()->subDays(20)->toDateString(),
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 16. MEDICINE INVENTORY (NEW)
        // ─────────────────────────────────────────────────────────────────
        $medParacetamol = Medicine::create([
            'medicine_name' => 'Paracetamol 500mg',
            'batch_no' => 'B-PCM2026-08',
            'expiry_date' => Carbon::now()->addMonths(18)->toDateString(),
            'unit' => 'Tablets',
        ]);

        $medIronFolic = Medicine::create([
            'medicine_name' => 'Iron Folic Acid (IFA)',
            'batch_no' => 'B-IFA2026-01',
            'expiry_date' => Carbon::now()->addMonths(12)->toDateString(),
            'unit' => 'Tablets',
        ]);

        // Seed stock levels
        MedicineStock::create([
            'medicine_id' => $medParacetamol->id,
            'village_id' => $villageBettadapura->id,
            'quantity' => 500,
        ]);

        MedicineStock::create([
            'medicine_id' => $medIronFolic->id,
            'village_id' => $villageBettadapura->id,
            'quantity' => 1200,
        ]);

        // VHW Request
        MedicineRequest::create([
            'requested_by' => $vhwUser1->id,
            'medicine_id' => $medParacetamol->id,
            'quantity' => 100,
            'status' => 'Approved',
            'approved_by' => $directorUser->id,
            'approved_at' => Carbon::now()->subDays(2),
            'remarks' => 'Approved for general fever treatment in Bettadapura.',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 17. FINANCE & BUDGETS (NEW)
        // ─────────────────────────────────────────────────────────────────
        $budget = Budget::create([
            'financial_year' => '2026-2027',
            'project_name' => 'Jeevan Roshini Mudigere Operations',
            'allocated_amount' => 100000.00,
        ]);

        Expense::create([
            'budget_id' => $budget->id,
            'expense_type' => 'Medicines Procurement',
            'amount' => 12000.00,
            'bill_path' => 'bills/invoice_meds_104.pdf',
            'approved_by' => $financeUser->id,
            'status' => 'Approved',
            'remarks' => 'Purchased baseline tablets/kits from trust central depot.',
        ]);

        $sponsor = Sponsor::create([
            'sponsor_name' => 'ABC Foundation',
            'contact_person' => 'Mr. Rohit Sen',
            'email' => 'rohit@abcfoundation.org',
            'mobile' => '9880098800',
        ]);

        SponsorContribution::create([
            'sponsor_id' => $sponsor->id,
            'amount' => 50000.00,
            'purpose' => 'Nutrition Kits for SAM children and pregnant mothers',
            'contribution_date' => Carbon::now()->subDays(30)->toDateString(),
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 18. EXPANSION PROJECTS (NEW)
        // ─────────────────────────────────────────────────────────────────
        ExpansionProject::create([
            'state_id' => $stateKA->id,
            'district_id' => $distShivamogga->id,
            'village_id' => $villageSomanahalli->id,
            'budget' => 25000.00,
            'start_date' => Carbon::now()->subDays(10),
            'status' => 'StaffAssigned',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 19. ANNOUNCEMENTS (NEW)
        // ─────────────────────────────────────────────────────────────────
        Announcement::create([
            'title' => 'NCD Screening Training Scheduled',
            'message' => 'VHWs are requested to attend the online NCD Screening certification on Zoom this Thursday at 10 AM.',
            'type' => 'TRAINING',
            'created_by' => $directorUser->id,
            'publish_date' => Carbon::now()->toDateString(),
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 20. AUDIT LOGS
        // ─────────────────────────────────────────────────────────────────
        AuditLog::create([
            'user_id' => $adminUser->id,
            'action' => 'LOGIN',
            'description' => 'Super Admin logged into the Jeevan Roshini portal.',
            'ip_address' => '103.56.214.11',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ]);

        AuditLog::create([
            'user_id' => $vhwUser1->id,
            'action' => 'INSERT_FAMILY',
            'description' => 'VHW Preema registered new family Gowda (family_code: FAM-4829-001) in Bettadapura.',
            'ip_address' => '110.225.34.88',
            'user_agent' => 'JeevanRoshini-Mobile/2.1.0 Android/13',
        ]);

        AuditLog::create([
            'user_id' => $directorUser->id,
            'action' => 'LOGIN',
            'description' => 'Project Director Dr. Ramesh Kumar logged in.',
            'ip_address' => '49.205.101.45',
            'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        ]);
    }
}
