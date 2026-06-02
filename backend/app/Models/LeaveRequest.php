<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    protected $fillable = [
        'user_id',
        'start_date',
        'end_date',
        'days_count',
        'leave_type',
        'reason',
        'status',
        'reviewed_by',
        'reviewer_notes',
        'reviewed_at',
    ];

    protected $casts = [
        'start_date' => 'date',
    ];

    /**
     * Get the applicant user who requested the leave.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the director user who reviewed this leave request.
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
