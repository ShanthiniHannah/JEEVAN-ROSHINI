<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainingReport extends Model
{
    protected $fillable = [
        'training_id', 'topics_covered', 'participants_count',
        'photos_count', 'videos_count', 'outcome', 'remarks',
        'generated_pdf_path', 'submitted_by', 'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    public function training(): BelongsTo
    {
        return $this->belongsTo(Training::class);
    }

    public function submittedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }
}
