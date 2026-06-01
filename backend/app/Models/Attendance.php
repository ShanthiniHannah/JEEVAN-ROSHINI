<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'attendances';

    protected $fillable = [
        'user_id',
        'date',
        'check_in_time',
        'check_out_time',
        'gps_coords',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    /**
     * Get the user/staff associated with this attendance log.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
