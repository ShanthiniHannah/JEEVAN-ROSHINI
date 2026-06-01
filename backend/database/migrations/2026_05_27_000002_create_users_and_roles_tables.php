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
        // 1. Users
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('status')->default('Active'); // Active, Suspended
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Staff Profiles (VHW/Directors extra metadata)
        Schema::create('staff_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('designation'); // Project Director, Coordinator, Village Health Worker
            $table->json('assigned_villages')->nullable(); // Array of village IDs assigned
            $table->string('contact_number')->nullable();
            $table->timestamps();
        });

        // 3. User Activity & Security Audit Logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('action'); // LOGIN, INSERT_FAMILY, UPDATE_ECHR, RISK_ALERT
            $table->text('description');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('staff_profiles');
        Schema::dropIfExists('users');
    }
};
