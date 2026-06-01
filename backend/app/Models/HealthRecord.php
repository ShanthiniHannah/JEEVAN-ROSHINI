<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HealthRecord extends Model
{
    protected $fillable = [
        'individual_id',
        'height_cm',
        'weight_kg',
        'bp_systolic',
        'bp_diastolic',
        'blood_sugar_mgdl',
        'chronic_diseases',
        'diagnosis_notes',
        'referral_hospital',
        'referral_reason',
        'follow_up_plan',
        'prescription_upload_path',
        'lab_report_upload_path',
    ];

    protected $casts = [
        'chronic_diseases' => 'array', // Automatic JSON cast in Laravel
    ];

    /**
     * Get the individual member that this health record belongs to.
     */
    public function individual()
    {
        return $this->belongsTo(Individual::class);
    }
}
