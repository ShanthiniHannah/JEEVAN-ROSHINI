<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BmiRecord extends Model
{
    protected $fillable = [
        'individual_id', 'height_cm', 'weight_kg',
        'bmi', 'category', 'remarks', 'recorded_date', 'recorded_by',
    ];

    protected $casts = [
        'recorded_date' => 'date',
        'bmi'           => 'decimal:2',
    ];

    /**
     * Classify BMI into standard WHO categories.
     */
    public static function classifyBmi(float $bmi): string
    {
        return match (true) {
            $bmi < 18.5 => 'Underweight',
            $bmi < 25.0 => 'Normal',
            $bmi < 30.0 => 'Overweight',
            default     => 'Obese',
        };
    }

    public function individual(): BelongsTo
    {
        return $this->belongsTo(Individual::class);
    }

    public function recordedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}
