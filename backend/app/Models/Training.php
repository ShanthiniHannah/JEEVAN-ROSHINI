<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Training extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'instructor',
        'scheduled_date',
        'video_url',
        'quiz_questions',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'scheduled_date' => 'date',
        'quiz_questions' => 'array',   // JSON: [{question, options[], answer}, ...]
        'created_at'     => 'datetime',
        'updated_at'     => 'datetime',
    ];

    /**
     * Get all VHW training session records for this training module.
     */
    public function sessions()
    {
        return $this->hasMany(TrainingSession::class);
    }

    /**
     * Get all users who have completed this training module.
     */
    public function completedByUsers()
    {
        return $this->belongsToMany(User::class, 'training_sessions')
                    ->withPivot(['completed_at', 'quiz_score', 'certificate_path'])
                    ->withTimestamps();
    }
}
