<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EligibleCouple extends Model
{
    protected $fillable = [
        'male_individual_id', 'female_individual_id', 'live_children',
        'expected_children', 'contraceptive_method', 'notes', 'recorded_by',
    ];

    public function maleIndividual(): BelongsTo
    {
        return $this->belongsTo(Individual::class, 'male_individual_id');
    }

    public function femaleIndividual(): BelongsTo
    {
        return $this->belongsTo(Individual::class, 'female_individual_id');
    }

    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
