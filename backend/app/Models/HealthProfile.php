<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HealthProfile extends Model
{
    protected $fillable = [
        'individual_id',
        'allergy_history',
        'disability_status',
        'vaccination_status',
        'pregnancy_status',
        'risk_category',
        'remarks',
    ];

    /**
     * Get the individual this health profile belongs to.
     */
    public function individual()
    {
        return $this->belongsTo(Individual::class);
    }
}
