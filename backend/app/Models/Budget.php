<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    protected $fillable = [
        'financial_year',
        'project_name',
        'allocated_amount',
    ];

    /**
     * Get the expenses under this budget.
     */
    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
}
