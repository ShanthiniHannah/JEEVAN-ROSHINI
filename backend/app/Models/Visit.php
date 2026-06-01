<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    protected $fillable = [
        'user_id',
        'family_id',
        'visit_date',
        'temperature_f',
        'bp_systolic',
        'bp_diastolic',
        'notes',
        'gps_location',
        'visit_photo_path',
        'follow_up_date',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'follow_up_date' => 'date',
    ];

    /**
     * Get the VHW staff member who logged the visit.
     */
    public function VhwWorker()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the family visited.
     */
    public function family()
    {
        return $this->belongsTo(Family::class, 'family_id');
    }
}
