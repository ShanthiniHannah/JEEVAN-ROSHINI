<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Individual extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'family_id',
        'name',
        'date_of_birth',
        'age',
        'gender',
        'mobile_number',
        'aadhaar_masked',
        'blood_group',
        'malnutrition_status',
        'living_alone',
        'status',
        'individual_code',
        'relationship',
        'marital_status',
        'education',
        'occupation',
        'income_per_month',
        'resident_status',
        'photo_path',
        'allergy_history',
        'disability_status',
        'vaccination_status',
        'pregnancy_status',
        'risk_category',
        'remarks',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    protected $with = ['healthProfile'];

    protected static function booted()
    {
        static::saved(function ($individual) {
            if ($individual->relationLoaded('healthProfile') && $individual->healthProfile) {
                $individual->healthProfile->individual_id = $individual->id;
                $individual->healthProfile->save();
            }
        });
    }

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
     * Get the health profile associated with this individual.
     */
    public function healthProfile()
    {
        return $this->hasOne(HealthProfile::class);
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

    /**
     * Helper to get or create the associated HealthProfile model.
     */
    protected function getOrCreateHealthProfile()
    {
        if ($this->relationLoaded('healthProfile') && $this->healthProfile) {
            return $this->healthProfile;
        }

        $profile = null;
        if ($this->exists) {
            $profile = $this->healthProfile()->first();
        }

        if (!$profile) {
            $profile = new HealthProfile();
        }

        $this->setRelation('healthProfile', $profile);
        return $profile;
    }

    public function getPregnancyStatusAttribute()
    {
        return $this->healthProfile?->pregnancy_status;
    }

    public function setPregnancyStatusAttribute($value)
    {
        $this->getOrCreateHealthProfile()->pregnancy_status = $value;
    }

    public function getVaccinationStatusAttribute()
    {
        return $this->healthProfile?->vaccination_status;
    }

    public function setVaccinationStatusAttribute($value)
    {
        $this->getOrCreateHealthProfile()->vaccination_status = $value;
    }

    public function getDisabilityStatusAttribute()
    {
        return $this->healthProfile?->disability_status;
    }

    public function setDisabilityStatusAttribute($value)
    {
        $this->getOrCreateHealthProfile()->disability_status = $value;
    }

    public function getAllergyHistoryAttribute()
    {
        return $this->healthProfile?->allergy_history;
    }

    public function setAllergyHistoryAttribute($value)
    {
        $this->getOrCreateHealthProfile()->allergy_history = $value;
    }

    public function getRiskCategoryAttribute()
    {
        return $this->healthProfile?->risk_category;
    }

    public function setRiskCategoryAttribute($value)
    {
        $this->getOrCreateHealthProfile()->risk_category = $value;
    }

    public function getRemarksAttribute()
    {
        return $this->healthProfile?->remarks;
    }

    public function setRemarksAttribute($value)
    {
        $this->getOrCreateHealthProfile()->remarks = $value;
    }
}
