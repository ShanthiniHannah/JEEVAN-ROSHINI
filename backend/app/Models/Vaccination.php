<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vaccination extends Model
{
    protected $fillable = [
        'individual_id', 'vaccine_name', 'dose1_date', 'dose2_date',
        'dose3_date', 'dose4_date', 'card_verified', 'remarks', 'recorded_by',
    ];

    protected $casts = [
        'dose1_date'    => 'date',
        'dose2_date'    => 'date',
        'dose3_date'    => 'date',
        'dose4_date'    => 'date',
        'card_verified' => 'boolean',
    ];

    public function individual(): BelongsTo
    {
        return $this->belongsTo(Individual::class);
    }

    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
