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
        'mobile',
        'employee_id',
        'must_change_password',
        'district_id',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'must_change_password' => 'boolean',
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
     * Get the district this user belongs to.
     */
    public function district()
    {
        return $this->belongsTo(District::class);
    }

    /**
     * Get the villages assigned to this user.
     */
    public function assignedVillages()
    {
        return $this->belongsToMany(Village::class, 'village_assignments', 'user_id', 'village_id')
                    ->withPivot('status', 'assigned_date')
                    ->withTimestamps();
    }

    /**
     * Get the daily session records for this user.
     */
    public function dailySessions()
    {
        return $this->hasMany(DailySession::class, 'vhw_id');
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
