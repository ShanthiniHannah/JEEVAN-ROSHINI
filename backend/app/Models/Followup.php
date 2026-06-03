<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Followup extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'individual_id',
        'visit_id',
        'diagnosis_id',
        'followup_date',
        'plan_notes',
        'status',
        'completed_on',
        'outcome_notes',
        'assigned_to',
        'completed_by',
    ];

    protected $casts = [
        'followup_date' => 'date',
        'completed_on' => 'date',
    ];

    /**
     * Get the individual this follow-up is for.
     */
    public function individual()
    {
        return $this->belongsTo(Individual::class, 'individual_id', 'id');
    }

    /**
     * Get the originating visit.
     */
    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }

    /**
     * Get the linked diagnosis (if follow-up is for a specific condition).
     */
    public function diagnosis()
    {
        return $this->belongsTo(Diagnosis::class);
    }

    /**
     * Get the VHW assigned to conduct this follow-up.
     */
    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Get the user who marked this follow-up as completed.
     */
    public function completedBy()
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    /**
     * Scope: overdue pending follow-ups (date passed, not completed).
     */
    public function scopeOverdue($query)
    {
        return $query->where('status', 'Pending')
            ->where('followup_date', '<', now()->toDateString());
    }

    /**
     * Scope: upcoming follow-ups within a date range.
     */
    public function scopeUpcoming($query, int $days = 7)
    {
        return $query->where('status', 'Pending')
            ->whereBetween('followup_date', [now()->toDateString(), now()->addDays($days)->toDateString()]);
    }
}
