<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Diagnosis extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'individual_id',
        'visit_id',
        'icd_code',
        'condition_name',
        'severity',
        'status',
        'diagnosed_on',
        'resolved_on',
        'clinical_notes',
        'diagnosed_by',
    ];

    protected $casts = [
        'diagnosed_on' => 'date',
        'resolved_on'  => 'date',
    ];

    /**
     * Get the individual this diagnosis belongs to.
     */
    public function individual()
    {
        return $this->belongsTo(Individual::class, 'individual_id', 'id');
    }

    /**
     * Get the visit during which this diagnosis was made.
     */
    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }

    /**
     * Get the clinician who made the diagnosis.
     */
    public function diagnosedBy()
    {
        return $this->belongsTo(User::class, 'diagnosed_by');
    }

    /**
     * Get medications linked to this diagnosis.
     */
    public function medications()
    {
        return $this->hasMany(Medication::class);
    }

    /**
     * Get follow-ups linked to this diagnosis.
     */
    public function followups()
    {
        return $this->hasMany(Followup::class);
    }

    /**
     * Scope: only active (ongoing) diagnoses.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'Active')->orWhere('status', 'Chronic');
    }
}
