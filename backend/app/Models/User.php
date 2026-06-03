<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the staff profile associated with the user.
     */
    public function staffProfile()
    {
        return $this->hasOne(StaffProfile::class);
    }

    /**
     * Get the attendance logs for the staff member.
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Get the leave requests submitted by the staff member.
     */
    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    /**
     * Get the household visits logged by this VHW.
     */
    public function visits()
    {
        return $this->hasMany(Visit::class);
    }

    /**
     * Get the audit logs of user actions.
     */
    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }
}
