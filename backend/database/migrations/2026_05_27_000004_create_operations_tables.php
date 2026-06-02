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
        // 1. Daily Household Visits
        Schema::create('visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // VHW worker
            $table->string('family_id');
            $table->foreign('family_id')->references('id')->on('families')->onDelete('cascade');
            $table->date('visit_date');

            // Quick vitals captured during visit
            $table->decimal('temperature_f', 4, 1)->nullable();
            $table->integer('bp_systolic')->nullable();
            $table->integer('bp_diastolic')->nullable();
            $table->integer('pulse_rate')->nullable();

            $table->text('notes')->nullable();
            $table->string('gps_location')->nullable(); // Optional — rural areas may not have GPS
            $table->boolean('gps_verified')->default(false);
            $table->string('visit_photo_path')->nullable();
            $table->date('follow_up_date')->nullable();

            // Visit submission workflow
            $table->string('status')->default('Draft'); // Draft, Submitted, Reviewed
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();

            $table->softDeletes(); // Never permanently delete visit records
            $table->timestamps();
        });

        // 2. Weekly Community Awareness Programs
        Schema::create('community_programs', function (Blueprint $table) {
            $table->id();
            $table->string('village_id');
            $table->foreign('village_id')->references('id')->on('villages')->onDelete('cascade');
            $table->foreignId('conducted_by')->nullable()->constrained('users')->onDelete('cascade'); // VHW
            $table->string('topic'); // Menstrual Hygiene, Tobacco Prevention, Nutrition, etc.
            $table->date('program_date');
            $table->integer('participants_count')->default(0);
            $table->text('outcome_summary')->nullable();
            $table->string('photo_path')->nullable();
            $table->text('feedback_text')->nullable();
            $table->string('status')->default('Draft'); // Draft, Submitted, Approved, Rejected
            $table->softDeletes();
            $table->timestamps();
        });

        // 3. Training Records (MVP — no LMS, no video/quiz engine)
        // Videos and quiz modules will be added in Phase 3.
        Schema::create('trainings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('instructor')->nullable();
            $table->date('scheduled_date');
            $table->string('venue')->nullable();
            $table->string('video_url')->nullable();
            $table->json('quiz_questions')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('Scheduled'); // Scheduled, Completed, Cancelled
            $table->timestamps();
        });

        // 4. VHW Training Session Tracker & Certification
        Schema::create('training_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('training_id')->constrained('trainings')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // VHW
            $table->boolean('attended')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->integer('quiz_score')->nullable();
            $table->string('certificate_path')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 5. GPS Attendance Logs (GPS is optional — soft field for rural areas)
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('date');
            $table->time('check_in_time')->nullable();
            $table->time('check_out_time')->nullable();
            $table->string('gps_coords')->nullable(); // Optional GPS coordinates
            $table->boolean('gps_verified')->default(false); // Was GPS confirmed?
            $table->string('verification_method')->default('manual'); // manual, gps, photo
            $table->string('check_in_photo_path')->nullable(); // Optional photo verification
            $table->string('status')->default('Present'); // Present, Leave, Absent, Half-Day
            $table->timestamps();
        });

        // 6. Leave Requests (with approval workflow)
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // VHW
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('days_count')->default(1);
            $table->string('leave_type')->default('Sick'); // Sick, Casual, Emergency, Maternity
            $table->text('reason');
            $table->string('status')->default('Pending'); // Pending, Approved, Rejected
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('reviewer_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('training_sessions');
        Schema::dropIfExists('trainings');
        Schema::dropIfExists('community_programs');
        Schema::dropIfExists('visits');
    }
};
