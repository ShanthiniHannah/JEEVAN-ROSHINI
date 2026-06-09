<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pregnancy extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'individual_id', 'lmp', 'edd', 'doctor_visits', 'usg_count',
        'hb_level', 'vaccinations', 'previous_deliveries', 'outcome',
        'delivery_date', 'notes', 'recorded_by',
    ];

    protected $casts = [
        'lmp'           => 'date',
        'edd'           => 'date',
        'delivery_date' => 'date',
        'vaccinations'  => 'array',
        'hb_level'      => 'decimal:1',
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
