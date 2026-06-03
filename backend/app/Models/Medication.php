<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Medication extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'individual_id',
        'diagnosis_id',
        'drug_name',
        'dosage',
        'frequency',
        'route',
        'prescribed_on',
        'end_date',
        'status',
        'notes',
        'prescribed_by',
    ];

    protected $casts = [
        'prescribed_on' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the individual this prescription belongs to.
     */
    public function individual()
    {
        return $this->belongsTo(Individual::class, 'individual_id', 'id');
    }

    /**
     * Get the diagnosis this medication is linked to.
     */
    public function diagnosis()
    {
        return $this->belongsTo(Diagnosis::class);
    }

    /**
     * Get the prescribing user.
     */
    public function prescribedBy()
    {
        return $this->belongsTo(User::class, 'prescribed_by');
    }

    /**
     * Scope: only active (currently ongoing) medications.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }
}
