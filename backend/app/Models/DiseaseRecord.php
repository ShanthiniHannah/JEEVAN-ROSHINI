<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiseaseRecord extends Model
{
    protected $fillable = [
        'individual_id',
        'disease_type_id',
        'known_case',
        'family_history',
        'duration',
        'medication',
        'diagnosed_date',
        'status',
        'remarks',
        'recorded_by',
    ];

    protected $casts = [
        'family_history' => 'boolean',
        'known_case' => 'boolean',
        'diagnosed_date' => 'date',
    ];

    public function individual(): BelongsTo
    {
        return $this->belongsTo(Individual::class);
    }

    public function diseaseType(): BelongsTo
    {
        return $this->belongsTo(DiseaseType::class, 'disease_type_id');
    }

    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
