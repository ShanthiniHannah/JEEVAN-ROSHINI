<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\LeaveRequest;

class LeaveRequested
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $leave;

    /**
     * Create a new event instance.
     */
    public function __construct(LeaveRequest $leave)
    {
        $this->leave = $leave;
    }
}
