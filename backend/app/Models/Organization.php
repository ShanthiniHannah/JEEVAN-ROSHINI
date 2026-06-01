<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Organization extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'contact_email',
        'address',
        'status',
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
     * Get all districts under this organization.
     */
    public function districts()
    {
        return $this->hasMany(District::class);
    }

    /**
     * Get all blocks under this organization (via districts).
     */
    public function blocks()
    {
        return $this->hasManyThrough(Block::class, District::class);
    }
}
