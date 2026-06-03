<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Referral extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'individual_id',
        'visit_id',
        'diagnosis_id',
        'referred_to_hospital',
        'department',
        'urgency',
        'reason',
        'referral_date',
        'appointment_date',
        'status',
        'approval_status',
        'referred_by',
        'approved_by',
        'approved_at',
        'approval_notes',
        'outcome_notes',
        'discharge_summary_path',
    ];

    protected $casts = [
        'referral_date' => 'date',
        'appointment_date' => 'date',
        'approved_at' => 'datetime',
    ];

    /**
     * Get the individual being referred.
     */
    public function individual()
    {
        return $this->belongsTo(Individual::class, 'individual_id', 'id');
    }

    /**
     * Get the visit that triggered this referral.
     */
    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }

    /**
     * Get the linked diagnosis.
     */
    public function diagnosis()
    {
        return $this->belongsTo(Diagnosis::class);
    }

    /**
     * Get the VHW who raised this referral.
     */
    public function referredBy()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    /**
     * Get the director who approved this referral.
     */
    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Polymorphic approval records.
     */
    public function approvals()
    {
        return $this->morphMany(Approval::class, 'approvable');
    }

    /**
     * Polymorphic documents (discharge summaries, etc.)
     */
    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    /**
     * Scope: pending director approval.
     */
    public function scopePendingApproval($query)
    {
        return $query->where('approval_status', 'Submitted');
    }

    /**
     * Scope: emergency referrals only.
     */
    public function scopeEmergency($query)
    {
        return $query->where('urgency', 'Emergency');
    }
}
