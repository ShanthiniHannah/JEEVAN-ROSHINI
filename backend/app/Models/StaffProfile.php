<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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
        'contact_number',
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
     * The attributes that should be appended to the model's array form.
     */
    protected $appends = ['assigned_villages'];

    /**
     * Get the user (staff member) this profile belongs to.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Dynamic accessor for assigned_villages.
     * Returns an array of village_codes assigned to the user.
     */
    public function getAssignedVillagesAttribute()
    {
        return DB::table('village_assignments')
            ->join('villages', 'village_assignments.village_id', '=', 'villages.id')
            ->where('village_assignments.user_id', $this->user_id)
            ->where('village_assignments.status', 'Active')
            ->pluck('villages.village_code')
            ->toArray();
    }

    /**
     * Resolve the actual Village models from the assigned_villages array.
     */
    public function assignedVillageModels()
    {
        return Village::whereIn('village_code', $this->assigned_villages)->get();
    }
}
