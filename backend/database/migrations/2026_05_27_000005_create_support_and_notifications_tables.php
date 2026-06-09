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
        // 1. Vulnerable Group Registry
        Schema::create('vulnerable_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_id')->constrained('individuals')->onDelete('cascade');
            $table->string('category'); // Widow, Elderly Living Alone, Disabled, Orphan, Palliative Patient, Pregnant Mother, SAM Child
            $table->string('severity')->default('Moderate'); // Mild, Moderate, Critical
            $table->text('special_notes')->nullable();
            $table->string('status')->default('Active'); // Active, Resolved, Monitoring
            $table->foreignId('registered_by')->nullable()->constrained('users')->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
        });

        // 2. Beneficiary Support Distributions (with full approval workflow)
        Schema::create('beneficiary_supports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_id')->constrained('individuals')->onDelete('cascade');
            $table->string('support_type'); // Financial Assistance, Nutrition Kit, Medicine Support, Government Scheme Linkage, Emergency Aid
            $table->text('description')->nullable();
            $table->decimal('financial_amount', 10, 2)->nullable();
            $table->date('distribution_date')->nullable();

            // Full approval workflow
            $table->string('status')->default('Draft'); // Draft, Submitted, Approved, Rejected, Distributed, Completed
            $table->foreignId('submitted_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_notes')->nullable();

            $table->softDeletes();
            $table->timestamps();
        });

        // 3. Multi-Channel Notification Logs
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade'); // Recipient user
            $table->string('type'); // SMS, WhatsApp, Email, System Push
            $table->string('channel')->default('System'); // System, SMS, WhatsApp, Email
            $table->string('recipient_address'); // Phone number or Email
            $table->string('title');
            $table->text('message_body');
            $table->string('status')->default('Pending'); // Pending, Sent, Failed, Read
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->string('reference_type')->nullable(); // Optional link: RiskAlert, Referral, etc.
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('beneficiary_supports');
        Schema::dropIfExists('vulnerable_groups');
    }
};
