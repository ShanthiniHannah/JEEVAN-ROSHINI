<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Family extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'village_id',
        'house_no',
        'address',
        'economic_status',
        'occupation',
        'drinking_water_source',
        'toilet_availability',
        'insurance_details',
        'status',
        'family_code',
        'state_id',
        'district_id',
        'block_id',
        'water_source',
        'rooms',
        'electricity',
        'cooking_source',
        'registration_date',
        'vhw_id',
        'family_photo_path',
    ];

    /**
     * Get the village this family resides in.
     */
    public function village()
    {
        return $this->belongsTo(Village::class);
    }

    /**
     * Get the individual members belonging to this family.
     */
    public function members()
    {
        return $this->hasMany(Individual::class, 'family_id');
    }

    /**
     * Get the field household visits logged for this family.
     */
    public function visits()
    {
        return $this->hasMany(Visit::class, 'family_id');
    }

    /**
     * Scope: active families only (not migrated or inactive).
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }
}
