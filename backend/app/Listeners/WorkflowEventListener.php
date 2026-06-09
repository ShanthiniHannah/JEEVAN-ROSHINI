<?php

namespace App\Listeners;

use App\Events\LeaveRequested;
use App\Models\Approval;
use App\Models\Notification;
use App\Models\User;
use App\Models\LeaveRequest;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Services\AuditLogger;

class WorkflowEventListener
{
    /**
     * Handle the event.
     */
    public function handle(LeaveRequested $event): void
    {
        $leave = $event->leave;
        $user = $leave->user;

        // 1. Create an Approval record pointing to the LeaveRequest model
        $approval = Approval::create([
            'approvable_type' => LeaveRequest::class,
            'approvable_id' => $leave->id,
            'requested_by' => $leave->user_id,
            'status' => 'Pending',
            'submitted_at' => now(),
            'reviewer_notes' => "Leave Request: {$leave->days_count} day(s) starting {$leave->start_date} for {$leave->reason}"
        ]);

        AuditLogger::logAction('WORKFLOW_APPROVAL_CREATED', "Leave approval created for {$user->name} (VHW)");

        // 2. Find the supervisor (Project Director)
        $director = User::where('role', 'project-director')->where('status', 'Active')->first();

        // 3. Dispatch a Notification to the Director
        if ($director) {
            Notification::create([
                'user_id' => $director->id,
                'type' => 'System Push',
                'recipient_address' => $director->email ?? 'director@example.com',
                'title' => 'New Leave Request (Workflow Engine)',
                'message_body' => "VHW {$user->name} has requested {$leave->days_count} day(s) of leave starting on {$leave->start_date}. Reason: {$leave->reason}.",
                'status' => 'Pending',
                'sent_at' => now()
            ]);
            
            AuditLogger::logAction('WORKFLOW_NOTIFICATION_DISPATCHED', "Alert sent to Director {$director->name}");
        }
    }
}
