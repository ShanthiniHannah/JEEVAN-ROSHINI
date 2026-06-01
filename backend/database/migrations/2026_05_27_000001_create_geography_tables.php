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
        // 1. Organizations (NGO Trust e.g. Ayathana Trust)
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('address')->nullable();
            $table->string('status')->default('Active'); // Active, Suspended
            $table->timestamps();
        });

        // 2. Districts
        Schema::create('districts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->string('name');
            $table->string('state')->default('Karnataka');
            $table->timestamps();
        });

        // 3. Blocks/Taluks
        Schema::create('blocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('district_id')->constrained('districts')->onDelete('cascade');
            $table->string('name');
            $table->string('code')->nullable();
            $table->timestamps();
        });

        // 4. Villages Mapping
        Schema::create('villages', function (Blueprint $table) {
            $table->string('id')->primary(); // Custom string ID e.g., VLG-4829
            $table->foreignId('block_id')->constrained('blocks')->onDelete('cascade');
            $table->string('name');
            $table->integer('population')->default(0);
            $table->string('water_status')->default('Adequate'); // Adequate, Contaminated, Scarcity
            $table->string('sanitation_status')->default('Good'); // Good, Moderate, Poor
            $table->string('risk_status')->default('Low'); // Low, Medium, High
            $table->decimal('geo_lat', 10, 8)->nullable();
            $table->decimal('geo_lng', 11, 8)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('villages');
        Schema::dropIfExists('blocks');
        Schema::dropIfExists('districts');
        Schema::dropIfExists('organizations');
    }
};
