<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * Overriding to avoid collision with Laravel's built-in notifications table
     * that is used by the Notifiable trait (which uses a different schema).
     * This table stores outbound multi-channel notification dispatch logs.
     *
     * @var string
     */
    protected $table = 'notifications';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'recipient_address',
        'title',
        'message_body',
        'status',
        'sent_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'sent_at'    => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user this notification was dispatched to (nullable).
     * Uses withDefault so unauthenticated or system-generated notifications
     * do not return null.
     */
    public function user()
    {
        return $this->belongsTo(User::class)->withDefault([
            'name'  => 'Guest / Bulk Recipient',
            'email' => null,
        ]);
    }

    /**
     * Scope: only notifications that were successfully sent.
     */
    public function scopeSent($query)
    {
        return $query->where('status', 'Sent');
    }

    /**
     * Scope: only notifications pending dispatch.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'Pending');
    }
}
