<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailySession extends Model
{
    protected $table = 'daily_sessions';

    protected $fillable = [
        'vhw_id',
        'session_date',
        'login_time',
        'logout_time',
        'attendance_status',
    ];

    protected $casts = [
        'session_date' => 'date',
    ];

    /**
     * Get the VHW/staff member associated with this session.
     */
    public function vhw()
    {
        return $this->belongsTo(User::class, 'vhw_id');
    }
}
