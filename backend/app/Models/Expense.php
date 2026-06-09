<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        'budget_id',
        'expense_type',
        'amount',
        'bill_path',
        'approved_by',
        'status',
        'remarks',
    ];

    /**
     * Get the budget this expense is filed against.
     */
    public function budget()
    {
        return $this->belongsTo(Budget::class);
    }

    /**
     * Get the reviewer who approved this expense.
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
