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
        Schema::create('health_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_id')->constrained('individuals')->onDelete('cascade');
            $table->text('allergy_history')->nullable();
            $table->string('disability_status')->default('No'); // Yes, No
            $table->string('vaccination_status')->default('None'); // Full, Partial, None
            $table->string('pregnancy_status')->default('No'); // Yes, No
            $table->string('risk_category')->default('Low'); // Low, Medium, High, Critical
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_profiles');
    }
};
