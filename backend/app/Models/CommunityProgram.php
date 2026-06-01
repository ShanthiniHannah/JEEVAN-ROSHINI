<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CommunityProgram extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'community_programs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'village_id',
        'topic',
        'program_date',
        'participants_count',
        'outcome_summary',
        'photo_path',
        'feedback_text',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'program_date'      => 'date',
        'participants_count' => 'integer',
        'created_at'        => 'datetime',
        'updated_at'        => 'datetime',
    ];

    /**
     * Get the village where this community awareness program was held.
     * Uses string foreign key matching the villages.id primary key.
     */
    public function village()
    {
        return $this->belongsTo(Village::class, 'village_id', 'id');
    }
}
