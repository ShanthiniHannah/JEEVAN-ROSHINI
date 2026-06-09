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
        // 1. Budgets catalog
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();
            $table->string('financial_year'); // e.g. "2026-2027"
            $table->string('project_name'); // e.g. "Jeevan Roshini Mudigere"
            $table->decimal('allocated_amount', 15, 2);
            $table->timestamps();
        });

        // 2. Expenses logging
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('budget_id')->constrained('budgets')->onDelete('cascade');
            $table->string('expense_type'); // e.g. "Salary", "Medicines", "Travel", "Programs"
            $table->decimal('amount', 12, 2);
            $table->string('bill_path')->nullable(); // Bill upload relative path
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null'); // Finance Head or Super Admin
            $table->string('status')->default('Pending'); // Pending, Approved, Rejected
            $table->text('remarks')->nullable();
            $table->timestamps();
        });

        // 3. Sponsors registry
        Schema::create('sponsors', function (Blueprint $table) {
            $table->id();
            $table->string('sponsor_name');
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('mobile')->nullable();
            $table->timestamps();
        });

        // 4. Sponsor Contributions
        Schema::create('sponsor_contributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sponsor_id')->constrained('sponsors')->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->text('purpose')->nullable(); // e.g. "Village Sanitation Program"
            $table->date('contribution_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sponsor_contributions');
        Schema::dropIfExists('sponsors');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('budgets');
    }
};
