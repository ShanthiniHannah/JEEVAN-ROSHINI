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
        // 1. Medicines catalog/batch info
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('medicine_name', 100);
            $table->string('batch_no', 50);
            $table->date('expiry_date');
            $table->string('unit'); // e.g. tablets, capsules, syrup bottles
            $table->timestamps();

            // Index batch info
            $table->index(['medicine_name', 'batch_no']);
        });

        // 2. Stock levels per village
        Schema::create('medicine_stock', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medicine_id')->constrained('medicines')->onDelete('cascade');
            $table->foreignId('village_id')->constrained('villages')->onDelete('cascade');
            $table->integer('quantity')->default(0);
            $table->timestamps();

            $table->unique(['medicine_id', 'village_id']);
        });

        // 3. Request flow from VHW to PD/District
        Schema::create('medicine_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requested_by')->constrained('users')->onDelete('cascade'); // VHW
            $table->foreignId('medicine_id')->constrained('medicines')->onDelete('cascade');
            $table->integer('quantity');
            $table->string('status')->default('Pending'); // Pending, Approved, Issued, Rejected
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null'); // PD
            $table->timestamp('approved_at')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicine_requests');
        Schema::dropIfExists('medicine_stock');
        Schema::dropIfExists('medicines');
    }
};
