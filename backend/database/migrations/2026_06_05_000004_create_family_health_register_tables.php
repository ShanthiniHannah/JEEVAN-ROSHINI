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
        // 0. Disease Types Master (New Master Table)
        Schema::create('disease_types', function (Blueprint $table) {
            $table->id();
            $table->string('disease_name')->unique();
            $table->string('category'); // NCD, COMMUNICABLE
            $table->timestamps();
        });

        // 1. Vaccinations
        Schema::create('vaccinations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_id')->constrained('individuals')->onDelete('cascade');
            $table->string('vaccine_name');
            $table->date('dose1_date')->nullable();
            $table->date('dose2_date')->nullable();
            $table->date('dose3_date')->nullable();
            $table->date('dose4_date')->nullable();
            $table->boolean('card_verified')->default(false);
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('recorded_by')->nullable();
            $table->foreign('recorded_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
        });

        // 2. Pregnancies (ANC tracking)
        Schema::create('pregnancies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_id')->constrained('individuals')->onDelete('cascade');
            $table->date('lmp')->nullable(); // Last Menstrual Period
            $table->date('edd')->nullable(); // Expected Date of Delivery (computed)
            $table->integer('doctor_visits')->default(0);
            $table->integer('usg_count')->default(0); // Ultrasound scans
            $table->decimal('hb_level', 4, 1)->nullable(); // Haemoglobin
            $table->json('vaccinations')->nullable(); // TT vaccines etc.
            $table->integer('previous_deliveries')->default(0);
            $table->string('outcome')->default('Ongoing'); // Ongoing, Live Birth, Miscarriage, Stillbirth
            $table->date('delivery_date')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('recorded_by')->nullable();
            $table->foreign('recorded_by')->references('id')->on('users')->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
        });

        // 3. Eligible Couples (Family Planning)
        Schema::create('eligible_couples', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('male_individual_id');
            $table->foreign('male_individual_id')->references('id')->on('individuals')->onDelete('cascade');
            $table->unsignedBigInteger('female_individual_id');
            $table->foreign('female_individual_id')->references('id')->on('individuals')->onDelete('cascade');
            $table->integer('live_children')->default(0);
            $table->integer('expected_children')->nullable();
            $table->string('contraceptive_method')->default('None'); // None, Oral Pills, IUD, Condom, Sterilization, Other
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('recorded_by')->nullable();
            $table->foreign('recorded_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
        });

        // 4. Disease Records (Family Register level — NCD + Communicable)
        Schema::create('disease_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_id')->constrained('individuals')->onDelete('cascade');
            $table->foreignId('disease_type_id')->constrained('disease_types')->onDelete('cascade');
            $table->boolean('known_case')->default(true);
            $table->boolean('family_history')->default(false);
            $table->string('duration')->nullable(); // e.g. "3 months", "Chronic"
            $table->text('medication')->nullable();
            $table->date('diagnosed_date')->nullable();
            $table->string('status')->default('Active'); // Active, Controlled, Resolved
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('recorded_by')->nullable();
            $table->foreign('recorded_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
        });

        // 5. Palliative Care Patients
        Schema::create('palliative_patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_id')->constrained('individuals')->onDelete('cascade');
            $table->text('condition');
            $table->string('current_status')->default('Active'); // Active, Improved, Deceased, Discharged
            $table->date('registered_date')->nullable();
            $table->date('last_reviewed')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('recorded_by')->nullable();
            $table->foreign('recorded_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
        });

        // 6. BMI Records (time-series, auto-classified)
        Schema::create('bmi_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('individual_id')->constrained('individuals')->onDelete('cascade');
            $table->decimal('height_cm', 5, 2);
            $table->decimal('weight_kg', 5, 2);
            if (\Illuminate\Support\Facades\DB::getDriverName() === 'sqlite') {
                $table->decimal('bmi', 4, 2)->nullable();
            } else {
                $table->decimal('bmi', 4, 2)->storedAs('ROUND(weight_kg / ((height_cm / 100) * (height_cm / 100)), 2)');
            }
            $table->string('category')->nullable(); // Underweight, Normal, Overweight, Obese (set by app logic)
            $table->text('remarks')->nullable();
            $table->date('recorded_date');
            $table->unsignedBigInteger('recorded_by')->nullable();
            $table->foreign('recorded_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bmi_records');
        Schema::dropIfExists('palliative_patients');
        Schema::dropIfExists('disease_records');
        Schema::dropIfExists('eligible_couples');
        Schema::dropIfExists('pregnancies');
        Schema::dropIfExists('vaccinations');
        Schema::dropIfExists('disease_types');
    }
};
