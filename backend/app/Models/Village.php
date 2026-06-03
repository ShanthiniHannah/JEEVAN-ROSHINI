<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Village extends Model
{
    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'id',
        'block_id',
        'name',
        'population',
        'water_status',
        'sanitation_status',
        'risk_status',
        'geo_lat',
        'geo_lng',
    ];

    /**
     * Get the Block/Taluk that this village belongs to.
     */
    public function block()
    {
        return $this->belongsTo(Block::class);
    }

    /**
     * Get the families registered in this village.
     */
    public function families()
    {
        return $this->hasMany(Family::class);
    }

    /**
     * Get the community programs conducted in this village.
     */
    public function communityPrograms()
    {
        return $this->hasMany(CommunityProgram::class);
    }
}
