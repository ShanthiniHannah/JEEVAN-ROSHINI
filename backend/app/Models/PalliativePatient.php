<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PalliativePatient extends Model
{
    protected $fillable = [
        'individual_id', 'condition', 'current_status', 'registered_date',
        'last_reviewed', 'notes', 'recorded_by',
    ];

    protected $casts = [
        'registered_date' => 'date',
        'last_reviewed'   => 'date',
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
