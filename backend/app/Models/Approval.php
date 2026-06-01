<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Approval extends Model
{
    protected $fillable = [
        'approvable_type',
        'approvable_id',
        'requested_by',
        'reviewed_by',
        'status',
        'reviewer_notes',
        'submitted_at',
        'reviewed_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'reviewed_at'  => 'datetime',
    ];

    /**
     * Get the owning approvable model (LeaveRequest, Referral, BeneficiarySupport, etc.)
     */
    public function approvable()
    {
        return $this->morphTo();
    }

    /**
     * Get the user who submitted the approval request.
     */
    public function requestedBy()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    /**
     * Get the director/admin who reviewed the request.
     */
    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * Scope: pending review only.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'Pending');
    }
}
