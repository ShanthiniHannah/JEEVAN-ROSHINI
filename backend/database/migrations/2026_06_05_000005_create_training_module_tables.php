<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Training & Capacity Building Module tables.
     *
     * Workflow:
     *   Project Director → Create Training → Select Venue → Upload Materials
     *   → Assign VHWs → Conduct → Mark Attendance → Upload Evidence
     *   → Submit Report → Generate Certificate
     */
    public function up(): void
    {
        // 1. Venue Master (reusable across trainings)
        Schema::create('training_venues', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('address')->nullable();
            $table->foreignId('village_id')->nullable()->constrained('villages')->onDelete('set null');
            $table->unsignedBigInteger('district_id')->nullable();
            $table->foreign('district_id')->references('id')->on('districts')->onDelete('set null');
            $table->string('maps_link')->nullable(); // Google Maps URL
            $table->integer('capacity')->default(50);
            $table->string('contact_person')->nullable();
            $table->string('contact_number', 15)->nullable();
            $table->string('status')->default('Active'); // Active, Inactive
            $table->timestamps();
        });

        // 2. Enhance existing trainings table
        Schema::table('trainings', function (Blueprint $table) {
            $table->string('category')->nullable()->after('title'); // Maternal Health, Child Health, Nutrition, etc.
            $table->time('start_time')->nullable()->after('scheduled_date');
            $table->time('end_time')->nullable()->after('start_time');
            $table->unsignedBigInteger('venue_id')->nullable()->after('venue');
            $table->foreign('venue_id')->references('id')->on('training_venues')->onDelete('set null');
            $table->integer('expected_participants')->default(0)->after('venue_id');
            $table->unsignedBigInteger('conducted_by')->nullable()->after('expected_participants'); // Project Director
            $table->foreign('conducted_by')->references('id')->on('users')->onDelete('set null');
            $table->text('training_notes')->nullable()->after('description');
            $table->text('outcome_summary')->nullable()->after('training_notes');
        });

        // 3. Training Materials (PDF, PPT, DOCX, Images, Videos, Audio)
        Schema::create('training_materials', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('training_id');
            $table->foreign('training_id')->references('id')->on('trainings')->onDelete('cascade');
            $table->string('title');
            $table->string('file_path');
            $table->string('file_name')->nullable();
            $table->string('mime_type')->nullable(); // application/pdf, video/mp4, etc.
            $table->integer('file_size_kb')->nullable();
            $table->string('material_type')->default('Document'); // Document, Video, Audio, Image
            $table->unsignedBigInteger('uploaded_by')->nullable();
            $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
        });

        // 4. Enhance training_sessions (attendance tracking)
        Schema::table('training_sessions', function (Blueprint $table) {
            $table->string('attendance_status')->default('Present')->after('attended'); // Present, Absent, Late
        });

        // 5. Training Evidence (Photos / Videos / Notes for donor reporting)
        Schema::create('training_evidence', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('training_id');
            $table->foreign('training_id')->references('id')->on('trainings')->onDelete('cascade');
            $table->string('type'); // Photo, Video, Note
            $table->string('file_path')->nullable(); // null for Note type
            $table->string('caption')->nullable();
            $table->text('note_content')->nullable(); // For Note type
            $table->unsignedBigInteger('uploaded_by')->nullable();
            $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
        });

        // 6. Training Reports (formal post-training documentation)
        Schema::create('training_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('training_id');
            $table->foreign('training_id')->references('id')->on('trainings')->onDelete('cascade');
            $table->text('topics_covered');
            $table->integer('participants_count')->default(0);
            $table->integer('photos_count')->default(0);
            $table->integer('videos_count')->default(0);
            $table->text('outcome');
            $table->text('remarks')->nullable();
            $table->string('generated_pdf_path')->nullable();
            $table->unsignedBigInteger('submitted_by')->nullable();
            $table->foreign('submitted_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_reports');
        Schema::dropIfExists('training_evidence');

        Schema::table('training_sessions', function (Blueprint $table) {
            $table->dropColumn('attendance_status');
        });

        Schema::dropIfExists('training_materials');

        Schema::table('trainings', function (Blueprint $table) {
            $table->dropForeign(['venue_id']);
            $table->dropForeign(['conducted_by']);
            $table->dropColumn([
                'category', 'start_time', 'end_time', 'venue_id',
                'expected_participants', 'conducted_by', 'training_notes', 'outcome_summary',
            ]);
        });

        Schema::dropIfExists('training_venues');
    }
};
