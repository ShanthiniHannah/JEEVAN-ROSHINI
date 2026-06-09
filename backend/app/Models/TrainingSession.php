<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingSession extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'training_sessions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'training_id',
        'user_id',
        'completed_at',
        'quiz_score',
        'certificate_path',
        'attended',
        'attendance_status',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'completed_at' => 'datetime',
        'quiz_score' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the training module this session belongs to.
     */
    public function training()
    {
        return $this->belongsTo(Training::class);
    }

    /**
     * Get the VHW/user who attended this training session.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Determine whether the session was passed (score >= 70%).
     */
    public function isPassed(): bool
    {
        return $this->quiz_score !== null && $this->quiz_score >= 70;
    }
}
