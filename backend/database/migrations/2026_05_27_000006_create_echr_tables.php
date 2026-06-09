<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Diagnoses
        Schema::create('diagnoses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_id')->constrained('individuals')->onDelete('cascade');
            $table->unsignedBigInteger('visit_id')->nullable(); // Linked to a specific visit
            $table->foreign('visit_id')->references('id')->on('visits')->onDelete('set null');
            $table->string('icd_code')->nullable(); // ICD-10 code e.g. I10 = Hypertension, E11 = Type 2 Diabetes
            $table->string('condition_name'); // Human-readable name
            $table->string('severity')->default('Mild'); // Mild, Moderate, Severe
            $table->string('status')->default('Active'); // Active, Resolved, Chronic, Under Observation
            $table->date('diagnosed_on');
            $table->date('resolved_on')->nullable();
            $table->text('clinical_notes')->nullable();
            $table->foreignId('diagnosed_by')->constrained('users');
            $table->softDeletes();
            $table->timestamps();
        });

        // 2. Medications / Prescriptions
        Schema::create('medications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_id')->constrained('individuals')->onDelete('cascade');
            $table->unsignedBigInteger('diagnosis_id')->nullable(); // Linked diagnosis
            $table->foreign('diagnosis_id')->references('id')->on('diagnoses')->onDelete('set null');
            $table->string('drug_name');
            $table->string('dosage')->nullable(); // e.g. 500mg
            $table->string('frequency')->nullable(); // Once daily, Twice daily, SOS
            $table->string('route')->nullable(); // Oral, Injection, Topical
            $table->date('prescribed_on');
            $table->date('end_date')->nullable();
            $table->string('status')->default('Active'); // Active, Completed, Stopped, On Hold
            $table->text('notes')->nullable();
            $table->foreignId('prescribed_by')->constrained('users');
            $table->softDeletes();
            $table->timestamps();
        });

        // 3. Lab Reports
        Schema::create('lab_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_id')->constrained('individuals')->onDelete('cascade');
            $table->unsignedBigInteger('visit_id')->nullable();
            $table->foreign('visit_id')->references('id')->on('visits')->onDelete('set null');
            $table->string('test_name'); // Haemoglobin, Blood Sugar (Fasting), Urine Routine, etc.
            $table->string('category')->default('Blood'); // Blood, Urine, Imaging, Stool, Sputum, Other
            $table->string('result_value')->nullable(); // e.g. 7.2
            $table->string('unit')->nullable(); // mg/dL, g/dL, mmol/L, etc.
            $table->string('normal_range')->nullable(); // e.g. 12–16 g/dL
            $table->boolean('is_abnormal')->default(false); // Flagged for clinician review
            $table->date('test_date');
            $table->date('report_date')->nullable(); // When result was received
            $table->string('lab_name')->nullable(); // Which lab conducted the test
            $table->string('file_path')->nullable(); // Uploaded scan of physical report
            $table->text('notes')->nullable();
            $table->foreignId('recorded_by')->constrained('users');
            $table->softDeletes();
            $table->timestamps();
        });

        // 4. Follow-ups
        Schema::create('followups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_id')->constrained('individuals')->onDelete('cascade');
            $table->unsignedBigInteger('visit_id')->nullable(); // Visit that created this follow-up
            $table->foreign('visit_id')->references('id')->on('visits')->onDelete('set null');
            $table->unsignedBigInteger('diagnosis_id')->nullable(); // Optional — for specific condition follow-up
            $table->foreign('diagnosis_id')->references('id')->on('diagnoses')->onDelete('set null');
            $table->date('followup_date'); // When the follow-up should happen
            $table->text('plan_notes'); // What should be checked/done at follow-up
            $table->string('status')->default('Pending'); // Pending, Completed, Missed, Rescheduled
            $table->date('completed_on')->nullable();
            $table->text('outcome_notes')->nullable(); // What was found at the follow-up
            $table->foreignId('assigned_to')->constrained('users'); // Assigned VHW
            $table->foreignId('completed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
        });

        // 5. Referrals (with full approval workflow)
        Schema::create('referrals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_id')->constrained('individuals')->onDelete('cascade');
            $table->unsignedBigInteger('visit_id')->nullable();
            $table->foreign('visit_id')->references('id')->on('visits')->onDelete('set null');
            $table->unsignedBigInteger('diagnosis_id')->nullable();
            $table->foreign('diagnosis_id')->references('id')->on('diagnoses')->onDelete('set null');
            $table->string('referred_to_hospital');
            $table->string('department')->nullable(); // Gynaecology, Cardiology, Orthopaedics, etc.
            $table->string('urgency')->default('Routine'); // Routine, Urgent, Emergency
            $table->text('reason'); // Clinical reason for referral
            $table->date('referral_date');
            $table->date('appointment_date')->nullable();

            // Referral status workflow
            $table->string('status')->default('Pending'); // Pending, Attended, Completed, Cancelled, No-Show
            $table->string('approval_status')->default('Draft'); // Draft, Submitted, Approved, Rejected

            $table->foreignId('referred_by')->constrained('users'); // VHW who raised referral
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null'); // Director
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_notes')->nullable();
            $table->text('outcome_notes')->nullable(); // What happened after referral
            $table->string('discharge_summary_path')->nullable(); // Uploaded hospital discharge doc

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('referrals');
        Schema::dropIfExists('followups');
        Schema::dropIfExists('lab_reports');
        Schema::dropIfExists('medications');
        Schema::dropIfExists('diagnoses');
    }
};
