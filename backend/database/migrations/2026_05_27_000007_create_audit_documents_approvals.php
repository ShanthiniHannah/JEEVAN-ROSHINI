<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Enhanced Audit Logs Migration
 *
 * The existing audit_logs table in migration 000002 only captures simple
 * login/action strings. This migration REPLACES that approach with a
 * comprehensive model-level audit trail required for healthcare compliance.
 *
 * Tracks:
 *   - Who created / edited / deleted / restored any record
 *   - What the record looked like before and after changes
 *   - IP address and user agent for security
 *
 * IMPORTANT: Audit logs must NEVER use softDeletes or be deletable by any user.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the basic version from migration 000002 and replace with comprehensive version
        Schema::table('audit_logs', function (Blueprint $table) {
            // Add new columns to the existing table
            $table->string('model_type')->nullable()->after('action'); // e.g. App\Models\Individual
            $table->string('model_id')->nullable()->after('model_type'); // The PK of the affected record
            $table->json('old_values')->nullable()->after('model_id'); // State before change
            $table->json('new_values')->nullable()->after('old_values'); // State after change
            $table->string('event')->nullable()->after('new_values'); // created, updated, deleted, restored, login, export
        });

        // Add index for fast queries — "show all changes to this patient"
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->index(['model_type', 'model_id']);
            $table->index(['user_id', 'created_at']);
        });

        // Document Storage (Polymorphic — attach to any model)
        // Categories: prescriptions | lab_reports | photos | government_docs | training_docs | discharge_summaries
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('documentable_type'); // Polymorphic model class
            $table->unsignedBigInteger('documentable_id'); // Polymorphic model ID
            $table->string('category'); // prescriptions, lab_reports, photos, government_docs, training_docs, discharge_summaries
            $table->string('title');
            $table->string('file_path');
            $table->string('file_name')->nullable(); // Original upload filename
            $table->string('mime_type')->nullable(); // image/jpeg, application/pdf, etc.
            $table->integer('file_size_kb')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('uploaded_by')->constrained('users');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['documentable_type', 'documentable_id']);
        });

        // Polymorphic Approvals (reusable across multiple models)
        // Used for: leave_requests, referrals, beneficiary_supports, community_programs
        Schema::create('approvals', function (Blueprint $table) {
            $table->id();
            $table->string('approvable_type'); // Polymorphic model class
            $table->unsignedBigInteger('approvable_id'); // Polymorphic model ID
            $table->foreignId('requested_by')->constrained('users');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('status')->default('Pending'); // Pending, Approved, Rejected, Escalated
            $table->text('reviewer_notes')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['approvable_type', 'approvable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approvals');
        Schema::dropIfExists('documents');

        // Reverse audit_logs column additions
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropIndex(['model_type', 'model_id']);
            $table->dropIndex(['user_id', 'created_at']);
            $table->dropColumn(['model_type', 'model_id', 'old_values', 'new_values', 'event']);
        });
    }
};
