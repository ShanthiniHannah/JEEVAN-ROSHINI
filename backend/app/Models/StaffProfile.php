<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'designation',
        'assigned_villages',
        'contact_number',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'assigned_villages' => 'array',   // JSON column storing array of village IDs
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user (staff member) this profile belongs to.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Resolve the actual Village models from the assigned_villages ID array.
     */
    public function assignedVillageModels()
    {
        return Village::whereIn('id', $this->assigned_villages ?? [])->get();
    }
}
