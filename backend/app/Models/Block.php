<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Block extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'district_id',
        'name',
        'code',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the district this block/taluk belongs to.
     */
    public function district()
    {
        return $this->belongsTo(District::class);
    }

    /**
     * Get all villages within this block.
     */
    public function villages()
    {
        return $this->hasMany(Village::class);
    }

    /**
     * Get the organization this block ultimately belongs to (through its district).
     */
    public function organization()
    {
        return $this->hasOneThrough(Organization::class, District::class, 'id', 'id', 'district_id', 'organization_id');
    }
}
