<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Enhance users table with governance & onboarding fields.
     * Supports hierarchical user creation by Super Admin / Project Director.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('mobile', 15)->nullable()->after('email');
            $table->string('employee_id', 30)->nullable()->unique()->after('mobile');
            $table->boolean('must_change_password')->default(true)->after('password'); // Force password reset on first login
            $table->unsignedBigInteger('district_id')->nullable()->after('status'); // Assigned district
            $table->foreign('district_id')->references('id')->on('districts')->onDelete('set null');
            $table->unsignedBigInteger('created_by')->nullable()->after('district_id'); // Who created this user
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 20)->nullable()->unique(); // e.g. JR-KA-CHK-01
            $table->unsignedBigInteger('state_id')->nullable();
            $table->foreign('state_id')->references('id')->on('states')->onDelete('set null');
            $table->unsignedBigInteger('district_id')->nullable();
            $table->foreign('district_id')->references('id')->on('districts')->onDelete('set null');
            $table->unsignedBigInteger('director_id')->nullable(); // Assigned Project Director
            $table->foreign('director_id')->references('id')->on('users')->onDelete('set null');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('Pending'); // Pending, Active, Suspended, Completed
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['district_id']);
            $table->dropForeign(['created_by']);
            $table->dropColumn(['mobile', 'employee_id', 'must_change_password', 'district_id', 'created_by']);
        });
    }
};
