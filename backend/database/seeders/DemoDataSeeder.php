<?php

namespace Database\Seeders;

use App\Models\Attendance;
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
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Execution order is critical — parents must exist before children due to FK constraints.
     * Run this AFTER RolesAndPermissionsSeeder so that users already exist.
     */
    public function run(): void
    {
        // ─────────────────────────────────────────────────────────────────
        // 0. RESOLVE EXISTING SEEDED USERS
        //    (RolesAndPermissionsSeeder must run first)
        // ─────────────────────────────────────────────────────────────────
        $adminUser = User::where('email', 'admin@ayathanatrust.org')->first();
        $directorUser = User::where('email', 'director@ayathanatrust.org')->first();
        $vhwUser1 = User::where('email', 'preema@ayathanatrust.org')->first();

        // Create a second VHW for richer attendance data
        $vhwUser2 = User::firstOrCreate(
            ['email' => 'suresh.vhw@ayathanatrust.org'],
            [
                'name' => 'Suresh Naik',
                'password' => Hash::make('SureshVhw2026!'),
                'status' => 'Active',
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
            'description' => 'Ayathana Trust is a non-profit organization committed to community health development in rural Karnataka. The Jeevan Roshini programme focuses on preventive care, maternal & child health, and social inclusion across Chikkamagaluru district.',
            'contact_email' => 'info@ayathanatrust.org',
            'address' => 'No. 12, Gandhi Nagar, Chikkamagaluru - 577101, Karnataka, India',
            'status' => 'Active',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 2. DISTRICTS
        // ─────────────────────────────────────────────────────────────────
        $distChikkamagaluru = District::create([
            'organization_id' => $org->id,
            'name' => 'Chikkamagaluru',
            'state' => 'Karnataka',
        ]);

        $distShivamogga = District::create([
            'organization_id' => $org->id,
            'name' => 'Shivamogga',
            'state' => 'Karnataka',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 3. BLOCKS / TALUKS
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
        // 4. VILLAGES  (5 villages — string custom IDs)
        // ─────────────────────────────────────────────────────────────────
        $villageBettadapura = Village::create([
            'id' => 'VLG-4829',
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
            'id' => 'VLG-4830',
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
            'id' => 'VLG-4831',
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
            'id' => 'VLG-4832',
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
            'id' => 'VLG-4833',
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
        // 5. STAFF PROFILES  (link to users)
        // ─────────────────────────────────────────────────────────────────
        StaffProfile::create([
            'user_id' => $vhwUser1->id,
            'designation' => 'Village Health Worker',
            'assigned_villages' => ['VLG-4829', 'VLG-4830'],
            'contact_number' => '9876543210',
        ]);

        StaffProfile::create([
            'user_id' => $vhwUser2->id,
            'designation' => 'Village Health Worker',
            'assigned_villages' => ['VLG-4831', 'VLG-4832', 'VLG-4833'],
            'contact_number' => '9988776655',
        ]);

        StaffProfile::create([
            'user_id' => $directorUser->id,
            'designation' => 'Project Director',
            'assigned_villages' => [],
            'contact_number' => '9123456789',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 6. FAMILIES  (8 families across villages)
        // ─────────────────────────────────────────────────────────────────

        // Village: Bettadapura
        $famGowda = Family::create([
            'id' => 'FAM-4829-001',
            'village_id' => 'VLG-4829',
            'house_no' => 'H-001',
            'address' => 'Near Bus Stand, Bettadapura',
            'economic_status' => 'BPL',
            'occupation' => 'Agriculture',
            'drinking_water_source' => 'Tap',
            'toilet_availability' => 'Yes',
            'insurance_details' => 'PM-JAY',
        ]);

        $famKumar = Family::create([
            'id' => 'FAM-4829-002',
            'village_id' => 'VLG-4829',
            'house_no' => 'H-022',
            'address' => 'Main Road, Bettadapura',
            'economic_status' => 'APL',
            'occupation' => 'Daily Labour',
            'drinking_water_source' => 'Well',
            'toilet_availability' => 'No',
            'insurance_details' => null,
        ]);

        $famNaik = Family::create([
            'id' => 'FAM-4829-003',
            'village_id' => 'VLG-4829',
            'house_no' => 'H-045',
            'address' => 'Coffee Estate Colony, Bettadapura',
            'economic_status' => 'BPL',
            'occupation' => 'Coffee Plantation Worker',
            'drinking_water_source' => 'Handpump',
            'toilet_availability' => 'Yes',
            'insurance_details' => 'Arogya Sanjeevini',
        ]);

        // Village: Hiriyur Koppalu
        $famRaju = Family::create([
            'id' => 'FAM-4830-001',
            'village_id' => 'VLG-4830',
            'house_no' => 'H-003',
            'address' => 'North Colony, Hiriyur Koppalu',
            'economic_status' => 'Antyodaya',
            'occupation' => 'Sheep Rearing',
            'drinking_water_source' => 'River',
            'toilet_availability' => 'No',
            'insurance_details' => 'PM-JAY',
        ]);

        $famDevi = Family::create([
            'id' => 'FAM-4830-002',
            'village_id' => 'VLG-4830',
            'house_no' => 'H-018',
            'address' => 'South Street, Hiriyur Koppalu',
            'economic_status' => 'BPL',
            'occupation' => 'Agriculture',
            'drinking_water_source' => 'Well',
            'toilet_availability' => 'Yes',
            'insurance_details' => 'Arogya Sanjeevini',
        ]);

        // Village: Malalu
        $famRamesh = Family::create([
            'id' => 'FAM-4831-001',
            'village_id' => 'VLG-4831',
            'house_no' => 'H-007',
            'address' => 'Temple Street, Malalu',
            'economic_status' => 'APL',
            'occupation' => 'Shopkeeper',
            'drinking_water_source' => 'Tap',
            'toilet_availability' => 'Yes',
            'insurance_details' => null,
        ]);

        // Village: Kavalande
        $famShetty = Family::create([
            'id' => 'FAM-4832-001',
            'village_id' => 'VLG-4832',
            'house_no' => 'H-012',
            'address' => 'Kavalande Main Village',
            'economic_status' => 'BPL',
            'occupation' => 'Fishing',
            'drinking_water_source' => 'River',
            'toilet_availability' => 'No',
            'insurance_details' => 'PM-JAY',
        ]);

        // Village: Somanahalli
        $famPillai = Family::create([
            'id' => 'FAM-4833-001',
            'village_id' => 'VLG-4833',
            'house_no' => 'H-001',
            'address' => 'Somanahalli Hamlet',
            'economic_status' => 'Antyodaya',
            'occupation' => 'Agriculture',
            'drinking_water_source' => 'Handpump',
            'toilet_availability' => 'No',
            'insurance_details' => 'PM-JAY',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 7. INDIVIDUALS  (15 individuals with varied profiles)
        // ─────────────────────────────────────────────────────────────────

        // ── Family: FAM-4829-001 (Gowda) ──────────────────────────────
        $ind01 = Individual::create([
            'id' => 'JR-4829-001',
            'family_id' => 'FAM-4829-001',
            'name' => 'Manjula Gowda',
            'age' => 32,
            'gender' => 'Female',
            'mobile_number' => '9876543001',
            'aadhaar_masked' => 'XXXX-XXXX-3401',
            'blood_group' => 'B+',
            'pregnancy_status' => 'Yes',
            'vaccination_status' => 'Full',
            'disability_status' => 'No',
            'allergy_history' => null,
            'malnutrition_status' => 'none',
            'living_alone' => 'no',
        ]);

        $ind02 = Individual::create([
            'id' => 'JR-4829-002',
            'family_id' => 'FAM-4829-001',
            'name' => 'Raju Gowda',
            'age' => 35,
            'gender' => 'Male',
            'mobile_number' => '9876543002',
            'aadhaar_masked' => 'XXXX-XXXX-3402',
            'blood_group' => 'O+',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Full',
            'disability_status' => 'No',
            'allergy_history' => null,
            'malnutrition_status' => 'none',
            'living_alone' => 'no',
        ]);

        $ind03 = Individual::create([
            'id' => 'JR-4829-003',
            'family_id' => 'FAM-4829-001',
            'name' => 'Baby Gowda',
            'age' => 0,   // Infant < 1 year
            'gender' => 'Female',
            'mobile_number' => null,
            'aadhaar_masked' => null,
            'blood_group' => 'B+',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Partial',
            'disability_status' => 'No',
            'allergy_history' => null,
            'malnutrition_status' => 'moderate',
            'living_alone' => 'no',
        ]);

        // ── Family: FAM-4829-002 (Kumar) ──────────────────────────────
        $ind04 = Individual::create([
            'id' => 'JR-4829-004',
            'family_id' => 'FAM-4829-002',
            'name' => 'Shantha Kumar',
            'age' => 62,
            'gender' => 'Female',
            'mobile_number' => '9876543003',
            'aadhaar_masked' => 'XXXX-XXXX-5501',
            'blood_group' => 'A+',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Partial',
            'disability_status' => 'No',
            'allergy_history' => 'Penicillin',
            'malnutrition_status' => 'none',
            'living_alone' => 'yes',   // Widow, elderly living alone
        ]);

        // ── Family: FAM-4829-003 (Naik) ──────────────────────────────
        $ind05 = Individual::create([
            'id' => 'JR-4829-005',
            'family_id' => 'FAM-4829-003',
            'name' => 'Veerappa Naik',
            'age' => 45,
            'gender' => 'Male',
            'mobile_number' => '9876543004',
            'aadhaar_masked' => 'XXXX-XXXX-7701',
            'blood_group' => 'AB+',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'None',
            'disability_status' => 'Yes',   // Physically disabled
            'allergy_history' => null,
            'malnutrition_status' => 'none',
            'living_alone' => 'no',
        ]);

        $ind06 = Individual::create([
            'id' => 'JR-4829-006',
            'family_id' => 'FAM-4829-003',
            'name' => 'Suma Naik',
            'age' => 28,
            'gender' => 'Female',
            'mobile_number' => '9876543005',
            'aadhaar_masked' => 'XXXX-XXXX-7702',
            'blood_group' => 'O-',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Full',
            'disability_status' => 'No',
            'allergy_history' => null,
            'malnutrition_status' => 'severe',
            'living_alone' => 'no',
        ]);

        // ── Family: FAM-4830-001 (Raju) ──────────────────────────────
        $ind07 = Individual::create([
            'id' => 'JR-4830-001',
            'family_id' => 'FAM-4830-001',
            'name' => 'Chandra Raju',
            'age' => 70,
            'gender' => 'Male',
            'mobile_number' => null,
            'aadhaar_masked' => 'XXXX-XXXX-8801',
            'blood_group' => 'B-',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Partial',
            'disability_status' => 'No',
            'allergy_history' => 'Aspirin',
            'malnutrition_status' => 'moderate',
            'living_alone' => 'yes',  // Elderly, living alone
        ]);

        $ind08 = Individual::create([
            'id' => 'JR-4830-002',
            'family_id' => 'FAM-4830-001',
            'name' => 'Kaveri Raju',
            'age' => 14,
            'gender' => 'Female',
            'mobile_number' => null,
            'aadhaar_masked' => 'XXXX-XXXX-8802',
            'blood_group' => 'A-',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Full',
            'disability_status' => 'No',
            'allergy_history' => null,
            'malnutrition_status' => 'severe',  // SAM child
            'living_alone' => 'no',
        ]);

        // ── Family: FAM-4830-002 (Devi) ──────────────────────────────
        $ind09 = Individual::create([
            'id' => 'JR-4830-003',
            'family_id' => 'FAM-4830-002',
            'name' => 'Lakshmi Devi',
            'age' => 25,
            'gender' => 'Female',
            'mobile_number' => '9876543006',
            'aadhaar_masked' => 'XXXX-XXXX-9901',
            'blood_group' => 'O+',
            'pregnancy_status' => 'Yes',  // High-risk pregnancy
            'vaccination_status' => 'Full',
            'disability_status' => 'No',
            'allergy_history' => null,
            'malnutrition_status' => 'moderate',
            'living_alone' => 'no',
        ]);

        // ── Family: FAM-4831-001 (Ramesh) ──────────────────────────────
        $ind10 = Individual::create([
            'id' => 'JR-4831-001',
            'family_id' => 'FAM-4831-001',
            'name' => 'Gopal Ramesh',
            'age' => 52,
            'gender' => 'Male',
            'mobile_number' => '9876543007',
            'aadhaar_masked' => 'XXXX-XXXX-1101',
            'blood_group' => 'A+',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Full',
            'disability_status' => 'No',
            'allergy_history' => null,
            'malnutrition_status' => 'none',
            'living_alone' => 'no',
        ]);

        $ind11 = Individual::create([
            'id' => 'JR-4831-002',
            'family_id' => 'FAM-4831-001',
            'name' => 'Priya Ramesh',
            'age' => 3,
            'gender' => 'Female',
            'mobile_number' => null,
            'aadhaar_masked' => null,
            'blood_group' => 'A+',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Partial',
            'disability_status' => 'No',
            'allergy_history' => null,
            'malnutrition_status' => 'moderate',
            'living_alone' => 'no',
        ]);

        // ── Family: FAM-4832-001 (Shetty) ──────────────────────────────
        $ind12 = Individual::create([
            'id' => 'JR-4832-001',
            'family_id' => 'FAM-4832-001',
            'name' => 'Ravi Shetty',
            'age' => 40,
            'gender' => 'Male',
            'mobile_number' => '9876543008',
            'aadhaar_masked' => 'XXXX-XXXX-2201',
            'blood_group' => 'B+',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'None',
            'disability_status' => 'No',
            'allergy_history' => null,
            'malnutrition_status' => 'none',
            'living_alone' => 'no',
        ]);

        $ind13 = Individual::create([
            'id' => 'JR-4832-002',
            'family_id' => 'FAM-4832-001',
            'name' => 'Anitha Shetty',
            'age' => 8,
            'gender' => 'Female',
            'mobile_number' => null,
            'aadhaar_masked' => null,
            'blood_group' => 'O+',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Full',
            'disability_status' => 'No',
            'allergy_history' => null,
            'malnutrition_status' => 'none',
            'living_alone' => 'no',
        ]);

        // ── Family: FAM-4833-001 (Pillai) ──────────────────────────────
        $ind14 = Individual::create([
            'id' => 'JR-4833-001',
            'family_id' => 'FAM-4833-001',
            'name' => 'Mariamma Pillai',
            'age' => 68,
            'gender' => 'Female',
            'mobile_number' => null,
            'aadhaar_masked' => 'XXXX-XXXX-3301',
            'blood_group' => 'AB-',
            'pregnancy_status' => 'No',
            'vaccination_status' => 'Partial',
            'disability_status' => 'Yes',   // Bedridden / palliative
            'allergy_history' => 'Sulfa drugs',
            'malnutrition_status' => 'moderate',
            'living_alone' => 'yes',
        ]);

        $ind15 = Individual::create([
            'id' => 'JR-4833-002',
            'family_id' => 'FAM-4833-001',
            'name' => 'Thomas Pillai (Orphan)',
            'age' => 9,
            'gender' => 'Male',
            'mobile_number' => null,
            'aadhaar_masked' => null,
            'blood_group' => null,
            'pregnancy_status' => 'No',
            'vaccination_status' => 'None',
            'disability_status' => 'No',
            'allergy_history' => null,
            'malnutrition_status' => 'severe',
            'living_alone' => 'no',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 8. COMMUNITY PROGRAMS  (3 events)
        // ─────────────────────────────────────────────────────────────────
        CommunityProgram::create([
            'village_id' => 'VLG-4829',
            'topic' => 'Menstrual Hygiene & Reproductive Health',
            'program_date' => Carbon::now()->subDays(14)->toDateString(),
            'participants_count' => 38,
            'outcome_summary' => 'Distributed 38 sanitary kits. Educated women on menstrual hygiene and infection prevention. Collected 12 individual ECHR referrals for follow-up.',
            'photo_path' => 'programs/bettadapura_menstrual_2026-05-13.jpg',
            'feedback_text' => 'Participants appreciated the session. Requested a follow-up session on maternal nutrition.',
        ]);

        CommunityProgram::create([
            'village_id' => 'VLG-4830',
            'topic' => 'Tobacco Prevention & Cancer Awareness',
            'program_date' => Carbon::now()->subDays(7)->toDateString(),
            'participants_count' => 55,
            'outcome_summary' => 'Conducted street play on dangers of tobacco use. Screened 20 individuals for oral cancer symptoms. Referred 3 cases to PHC Mudigere.',
            'photo_path' => 'programs/hiriyur_tobacco_2026-05-20.jpg',
            'feedback_text' => 'Village panchayat expressed willingness to declare village tobacco-free. Good community engagement.',
        ]);

        CommunityProgram::create([
            'village_id' => 'VLG-4831',
            'topic' => 'Child Nutrition & Supplementary Feeding Drive',
            'program_date' => Carbon::now()->subDays(3)->toDateString(),
            'participants_count' => 24,
            'outcome_summary' => 'Held nutrition demonstration session with Anganwadi. Weighed 18 children. Identified 4 moderate acute malnutrition cases and enrolled them in supplementary programme.',
            'photo_path' => 'programs/malalu_nutrition_2026-05-24.jpg',
            'feedback_text' => 'Mothers were receptive. Anganwadi worker expressed interest in monthly joint sessions.',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 9. TRAININGS  (2 modules with quiz questions)
        // ─────────────────────────────────────────────────────────────────
        $training1 = Training::create([
            'title' => 'Maternal & Child Health — VHW Certification Module 1',
            'instructor' => 'Dr. Anitha Rao',
            'scheduled_date' => Carbon::now()->subDays(30)->toDateString(),
            'video_url' => 'https://training.ayathanatrust.org/videos/mch-module-1.mp4',
            'quiz_questions' => [
                [
                    'question' => 'What is the normal range for haemoglobin in a pregnant woman?',
                    'options' => ['6–8 g/dL', '9–10 g/dL', '11–13 g/dL', 'Above 14 g/dL'],
                    'answer' => '11–13 g/dL',
                ],
                [
                    'question' => 'Which vaccine is given at birth to prevent tuberculosis?',
                    'options' => ['DPT', 'BCG', 'OPV', 'MMR'],
                    'answer' => 'BCG',
                ],
                [
                    'question' => 'SAM stands for:',
                    'options' => ['Severe Acute Malnutrition', 'Sub-acute Malaria', 'Systemic Arterial Monitoring', 'Social Aid Module'],
                    'answer' => 'Severe Acute Malnutrition',
                ],
                [
                    'question' => 'At which age should the measles vaccine (Measles 1) be administered?',
                    'options' => ['At birth', '6 weeks', '9 months', '15 months'],
                    'answer' => '9 months',
                ],
                [
                    'question' => 'What does MUAC stand for?',
                    'options' => ['Maternal Uterine Age Check', 'Mid-Upper Arm Circumference', 'Multiple Ulcer Acute Care', 'Morbidity Under Assessment Chart'],
                    'answer' => 'Mid-Upper Arm Circumference',
                ],
            ],
        ]);

        $training2 = Training::create([
            'title' => 'Non-Communicable Disease Screening — VHW Module 2',
            'instructor' => 'Dr. Sunil Menon',
            'scheduled_date' => Carbon::now()->subDays(15)->toDateString(),
            'video_url' => 'https://training.ayathanatrust.org/videos/ncd-module-2.mp4',
            'quiz_questions' => [
                [
                    'question' => 'What blood pressure reading is classified as Stage 2 Hypertension?',
                    'options' => ['<120/80 mmHg', '130–139/80–89 mmHg', '≥140/≥90 mmHg', '160/100 mmHg'],
                    'answer' => '≥140/≥90 mmHg',
                ],
                [
                    'question' => 'Which fasting blood glucose reading indicates diabetes?',
                    'options' => ['<100 mg/dL', '100–125 mg/dL', '≥126 mg/dL', '≥200 mg/dL on OGTT'],
                    'answer' => '≥126 mg/dL',
                ],
                [
                    'question' => 'BMI above which value is classified as Obese (Class I)?',
                    'options' => ['25', '27.5', '30', '35'],
                    'answer' => '30',
                ],
                [
                    'question' => 'The DOTS strategy is used to treat which disease?',
                    'options' => ['Malaria', 'Tuberculosis', 'Hypertension', 'Anaemia'],
                    'answer' => 'Tuberculosis',
                ],
            ],
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 10. TRAINING SESSIONS  (VHWs complete training)
        // ─────────────────────────────────────────────────────────────────
        TrainingSession::create([
            'training_id' => $training1->id,
            'user_id' => $vhwUser1->id,
            'completed_at' => Carbon::now()->subDays(28),
            'quiz_score' => 88,
            'certificate_path' => 'certificates/preema_mch_module1_cert.pdf',
        ]);

        TrainingSession::create([
            'training_id' => $training1->id,
            'user_id' => $vhwUser2->id,
            'completed_at' => Carbon::now()->subDays(27),
            'quiz_score' => 76,
            'certificate_path' => 'certificates/suresh_mch_module1_cert.pdf',
        ]);

        TrainingSession::create([
            'training_id' => $training2->id,
            'user_id' => $vhwUser1->id,
            'completed_at' => Carbon::now()->subDays(12),
            'quiz_score' => 92,
            'certificate_path' => 'certificates/preema_ncd_module2_cert.pdf',
        ]);

        TrainingSession::create([
            'training_id' => $training2->id,
            'user_id' => $vhwUser2->id,
            'completed_at' => Carbon::now()->subDays(11),
            'quiz_score' => 68,  // Failed — below 70
            'certificate_path' => null,
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 11. ATTENDANCE RECORDS  (last 7 days for each VHW)
        // ─────────────────────────────────────────────────────────────────
        $vhwUsers = [$vhwUser1, $vhwUser2];

        for ($i = 6; $i >= 1; $i--) {
            $attendanceDate = Carbon::now()->subDays($i)->toDateString();
            $dayOfWeek = Carbon::now()->subDays($i)->dayOfWeek; // 0=Sun, 6=Sat

            foreach ($vhwUsers as $idx => $vhw) {
                // Sunday is day off — mark as Leave
                if ($dayOfWeek === Carbon::SUNDAY) {
                    Attendance::create([
                        'user_id' => $vhw->id,
                        'date' => $attendanceDate,
                        'check_in_time' => null,
                        'check_out_time' => null,
                        'gps_coords' => null,
                        'status' => 'Leave',
                    ]);
                } else {
                    // Alternate gps coords between two villages per VHW
                    $gpsOptions = $idx === 0
                        ? ['13.12380000,75.94210000', '13.09510000,75.96730000']
                        : ['13.54720000,76.00850000', '13.60190000,76.02340000'];

                    Attendance::create([
                        'user_id' => $vhw->id,
                        'date' => $attendanceDate,
                        'check_in_time' => '08:3'.$idx.':00',
                        'check_out_time' => '17:0'.$idx.':00',
                        'gps_coords' => $gpsOptions[$i % 2],
                        'status' => 'Present',
                    ]);
                }
            }
        }

        // ─────────────────────────────────────────────────────────────────
        // 12. VULNERABLE GROUPS  (5 entries)
        // ─────────────────────────────────────────────────────────────────

        // Widow, Elderly Living Alone — Shantha Kumar
        VulnerableGroup::create([
            'individual_id' => 'JR-4829-004',
            'category' => 'Widow',
            'special_notes' => 'Widowed 3 years ago. Hypertension history. Needs monthly BP monitoring and social check-ins.',
        ]);

        VulnerableGroup::create([
            'individual_id' => 'JR-4829-004',
            'category' => 'Elderly Living Alone',
            'special_notes' => 'Lives alone; no children nearby. Enrolled in IGNOAPS (Old Age Pension). Requires VHW visits twice a month.',
        ]);

        // Elderly Living Alone — Chandra Raju
        VulnerableGroup::create([
            'individual_id' => 'JR-4830-001',
            'category' => 'Elderly Living Alone',
            'special_notes' => 'Diabetic and mobility-impaired. Assigned to VHW Preema for fortnightly home visits.',
        ]);

        // Palliative Patient — Mariamma Pillai (bedridden)
        VulnerableGroup::create([
            'individual_id' => 'JR-4833-001',
            'category' => 'Palliative Patient',
            'special_notes' => 'Stage 3 cervical cancer. Under palliative home care. Connected with Rotary Palliative Care Unit, Sagar.',
        ]);

        // Orphan — Thomas Pillai
        VulnerableGroup::create([
            'individual_id' => 'JR-4833-002',
            'category' => 'Orphan',
            'special_notes' => 'Both parents deceased. Under care of grandmother (Mariamma). Referred to Child Welfare Committee for government scholarship and hostel scheme.',
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 13. BENEFICIARY SUPPORT RECORDS  (5 entries)
        // ─────────────────────────────────────────────────────────────────

        // Nutrition kit for SAM infant (Baby Gowda)
        BeneficiarySupport::create([
            'individual_id' => 'JR-4829-003',
            'support_type' => 'Nutrition Kit',
            'description' => 'Monthly NRC take-home ration including ready-to-use therapeutic food (RUTF), fortified cereals, and iron-folic acid supplements.',
            'financial_amount' => 0.00,
            'status' => 'Distributed',
            'distribution_date' => Carbon::now()->subDays(10)->toDateString(),
        ]);

        // Financial assistance for widow — Shantha Kumar
        BeneficiarySupport::create([
            'individual_id' => 'JR-4829-004',
            'support_type' => 'Financial Assistance',
            'description' => 'IGNOAPS widow pension linkage assistance. First instalment processed through village panchayat.',
            'financial_amount' => 1000.00,
            'status' => 'Distributed',
            'distribution_date' => Carbon::now()->subDays(20)->toDateString(),
        ]);

        // Government scheme linkage — Disabled Veerappa
        BeneficiarySupport::create([
            'individual_id' => 'JR-4829-005',
            'support_type' => 'Government Scheme Linkage',
            'description' => 'Registered with NIMHANS Disability Certification programme. Referred for disability certificate application at Taluk office.',
            'financial_amount' => 0.00,
            'status' => 'Pending Scheme Linkage',
            'distribution_date' => Carbon::now()->subDays(5)->toDateString(),
        ]);

        // Nutrition kit for SAM child — Kaveri Raju
        BeneficiarySupport::create([
            'individual_id' => 'JR-4830-002',
            'support_type' => 'Nutrition Kit',
            'description' => 'Adolescent nutrition kit: Iron tablets, Vitamin A, high-protein biscuits. Coordinated with Anganwadi, Hiriyur Koppalu.',
            'financial_amount' => 0.00,
            'status' => 'Distributed',
            'distribution_date' => Carbon::now()->subDays(7)->toDateString(),
        ]);

        // Emergency aid + scheme for orphan — Thomas Pillai
        BeneficiarySupport::create([
            'individual_id' => 'JR-4833-002',
            'support_type' => 'Emergency Aid',
            'description' => 'Emergency food kit and school stationery provided. Linked with PM CARES for Children (orphan support scheme). Case filed with CWC Shivamogga.',
            'financial_amount' => 500.00,
            'status' => 'Distributed',
            'distribution_date' => Carbon::now()->subDays(2)->toDateString(),
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 14. NOTIFICATION RECORDS  (6 entries — SMS, WhatsApp, Email)
        // ─────────────────────────────────────────────────────────────────

        Notification::create([
            'user_id' => $vhwUser1->id,
            'type' => 'SMS',
            'recipient_address' => '9876543210',
            'title' => 'Attendance Reminder',
            'message_body' => 'Dear Preema, please ensure GPS attendance is submitted before 9:00 AM daily. Contact 1800-XXX-XXXX for any issues. — Ayathana Trust',
            'status' => 'Sent',
            'sent_at' => Carbon::now()->subDays(3),
        ]);

        Notification::create([
            'user_id' => $vhwUser1->id,
            'type' => 'WhatsApp',
            'recipient_address' => '9876543210',
            'title' => 'High-Risk Pregnancy Alert: Manjula Gowda',
            'message_body' => '⚠️ Alert: JR-4829-001 Manjula Gowda (32F, VLG-4829) has been flagged as High-Risk Pregnancy. Please schedule a home visit within 48 hours and refer to PHC Mudigere if BP exceeds 140/90.',
            'status' => 'Sent',
            'sent_at' => Carbon::now()->subDays(1),
        ]);

        Notification::create([
            'user_id' => $vhwUser2->id,
            'type' => 'SMS',
            'recipient_address' => '9988776655',
            'title' => 'Training Module 2 Reminder',
            'message_body' => 'Dear Suresh, your NCD Screening training assessment is pending. Please complete Quiz 2 before 2026-06-01. Login: training.ayathanatrust.org',
            'status' => 'Sent',
            'sent_at' => Carbon::now()->subDays(2),
        ]);

        Notification::create([
            'user_id' => $directorUser->id,
            'type' => 'Email',
            'recipient_address' => 'ramesh.director@ayathanatrust.org',
            'title' => 'Monthly Field Report — May 2026',
            'message_body' => "Dear Dr. Ramesh,\n\nThe May 2026 field operations summary is now available in the Jeevan Roshini portal.\n\nHighlights:\n- Families Registered: 8\n- Individuals Enrolled: 15\n- Community Programs: 3\n- High-Risk Cases Flagged: 4\n- Training Completions: 3/4 VHWs\n\nPlease log in to review and approve pending leave requests.\n\nRegards,\nJeevan Roshini System",
            'status' => 'Sent',
            'sent_at' => Carbon::now()->subDays(1),
        ]);

        Notification::create([
            'user_id' => null,
            'type' => 'WhatsApp',
            'recipient_address' => '9876543006',
            'title' => 'Antenatal Care Visit Reminder — Lakshmi Devi',
            'message_body' => '🏥 Reminder: Lakshmi Devi (JR-4830-003), your next ANC check-up is scheduled at PHC Mudigere on '.Carbon::now()->addDays(5)->format('d M Y').'. Bring your Mother & Child Protection card. VHW Preema will accompany you. Call 9876543210 for queries.',
            'status' => 'Sent',
            'sent_at' => Carbon::now()->subHours(6),
        ]);

        Notification::create([
            'user_id' => $adminUser->id,
            'type' => 'Email',
            'recipient_address' => 'admin@ayathanatrust.org',
            'title' => 'New Staff Account Created — Suresh Naik',
            'message_body' => "Hello Admin,\n\nA new Village Health Worker account has been created:\n\nName: Suresh Naik\nEmail: suresh.vhw@ayathanatrust.org\nAssigned Villages: VLG-4831 (Malalu), VLG-4832 (Kavalande), VLG-4833 (Somanahalli)\n\nPlease review and confirm staff profile details in the system.\n\nJeevan Roshini Portal",
            'status' => 'Pending',
            'sent_at' => null,
        ]);

        // ─────────────────────────────────────────────────────────────────
        // 15. AUDIT LOG RECORDS  (5 entries)
        // ─────────────────────────────────────────────────────────────────

        AuditLog::create([
            'user_id' => $adminUser->id,
            'action' => 'LOGIN',
            'description' => 'Super Admin logged into the Jeevan Roshini portal from Chikkamagaluru.',
            'ip_address' => '103.56.214.11',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
        ]);

        AuditLog::create([
            'user_id' => $vhwUser1->id,
            'action' => 'INSERT_FAMILY',
            'description' => 'VHW Preema registered new family FAM-4829-001 (Gowda) in village Bettadapura (VLG-4829).',
            'ip_address' => '110.225.34.88',
            'user_agent' => 'JeevanRoshini-Mobile/2.1.0 Android/13',
        ]);

        AuditLog::create([
            'user_id' => $vhwUser1->id,
            'action' => 'INSERT_FAMILY',
            'description' => 'VHW Preema registered new family FAM-4830-001 (Raju) in village Hiriyur Koppalu (VLG-4830).',
            'ip_address' => '110.225.34.88',
            'user_agent' => 'JeevanRoshini-Mobile/2.1.0 Android/13',
        ]);

        AuditLog::create([
            'user_id' => $vhwUser1->id,
            'action' => 'UPDATE_ECHR',
            'description' => 'VHW Preema updated Electronic Community Health Record for individual JR-4829-001 (Manjula Gowda). Fields updated: pregnancy_status, malnutrition_status.',
            'ip_address' => '110.225.34.88',
            'user_agent' => 'JeevanRoshini-Mobile/2.1.0 Android/13',
        ]);

        AuditLog::create([
            'user_id' => $directorUser->id,
            'action' => 'LOGIN',
            'description' => 'Project Director Dr. Ramesh Kumar logged in and reviewed May 2026 monthly field report.',
            'ip_address' => '49.205.101.45',
            'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Safari/537.36',
        ]);

        $this->command->info('✅  DemoDataSeeder completed successfully.');
        $this->command->info('    Organization : Ayathana Trust');
        $this->command->info('    Districts    : 2');
        $this->command->info('    Blocks       : 3');
        $this->command->info('    Villages     : 5');
        $this->command->info('    Families     : 8');
        $this->command->info('    Individuals  : 15');
        $this->command->info('    Programs     : 3');
        $this->command->info('    Trainings    : 2  (4 sessions)');
        $this->command->info('    Attendance   : 14 records (7 days × 2 VHWs)');
        $this->command->info('    Vuln. Groups : 5');
        $this->command->info('    Ben. Support : 5');
        $this->command->info('    Notifications: 6');
        $this->command->info('    Audit Logs   : 5');
    }
}
