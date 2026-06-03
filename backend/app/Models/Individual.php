<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Individual extends Model
{
    use SoftDeletes;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'id',
        'family_id',
        'name',
        'date_of_birth',
        'age',
        'gender',
        'mobile_number',
        'aadhaar_masked',
        'blood_group',
        'pregnancy_status',
        'vaccination_status',
        'disability_status',
        'allergy_history',
        'malnutrition_status',
        'living_alone',
        'status',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    /**
     * Get the family this individual belongs to.
     */
    public function family()
    {
        return $this->belongsTo(Family::class, 'family_id');
    }

    /**
     * Get baseline vitals health records of the individual.
     */
    public function healthRecords()
    {
        return $this->hasMany(HealthRecord::class);
    }

    /**
     * Get all clinical diagnoses for this individual.
     */
    public function diagnoses()
    {
        return $this->hasMany(Diagnosis::class);
    }

    /**
     * Get all medication prescriptions for this individual.
     */
    public function medications()
    {
        return $this->hasMany(Medication::class);
    }

    /**
     * Get all lab reports for this individual.
     */
    public function labReports()
    {
        return $this->hasMany(LabReport::class);
    }

    /**
     * Get all follow-ups scheduled for this individual.
     */
    public function followups()
    {
        return $this->hasMany(Followup::class);
    }

    /**
     * Get all referrals raised for this individual.
     */
    public function referrals()
    {
        return $this->hasMany(Referral::class);
    }

    /**
     * Get active/resolved clinical risk alerts triggered for this individual.
     */
    public function riskAlerts()
    {
        return $this->hasMany(RiskAlert::class);
    }

    /**
     * Get only active risk alerts.
     */
    public function activeRiskAlerts()
    {
        return $this->hasMany(RiskAlert::class)->where('status', 'Active');
    }

    /**
     * Get vulnerable group tags associated with this individual.
     */
    public function vulnerableTags()
    {
        return $this->hasMany(VulnerableGroup::class);
    }

    /**
     * Get social support disbursements given to this individual.
     */
    public function socialSupports()
    {
        return $this->hasMany(BeneficiarySupport::class);
    }

    /**
     * Polymorphic documents (prescriptions, photos, govt docs, etc.)
     */
    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    /**
     * Scope: active individuals only.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }

    /**
     * Scope: individuals with active risk alerts.
     */
    public function scopeAtRisk($query)
    {
        return $query->whereHas('riskAlerts', fn ($q) => $q->where('status', 'Active'));
    }
}
