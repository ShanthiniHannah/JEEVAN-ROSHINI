<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Village extends Model
{
    protected $fillable = [
        'village_code',
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

    /**
     * Get the individuals residing in this village through families.
     */
    public function individuals()
    {
        return $this->hasManyThrough(Individual::class, Family::class, 'village_id', 'family_id', 'id', 'id');
    }
}
