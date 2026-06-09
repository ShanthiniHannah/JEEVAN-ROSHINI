<?php

namespace App\Services;

use App\Models\LeaveRequest;
use App\Repositories\ApprovalRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Pagination\LengthAwarePaginator;

class ApprovalService
{
    /**
     * The approval repository.
     */
    protected ApprovalRepository $approvalRepo;

    /**
     * ApprovalService constructor.
     */
    public function __construct(ApprovalRepository $approvalRepo)
    {
        $this->approvalRepo = $approvalRepo;
    }

    /**
     * Get pending leaves.
     */
    public function listPendingLeaves(): LengthAwarePaginator
    {
        return $this->approvalRepo->getPendingLeaves();
    }

    /**
     * Get all leaves.
     */
    public function listAllLeaves(): LengthAwarePaginator
    {
        return $this->approvalRepo->getAllLeaves();
    }

    /**
     * Apply for leave request.
     */
    public function applyForLeave(int $userId, array $data): LeaveRequest
    {
        $startDate = $data['start_date'];
        $daysCount = $data['days_count'] ?? 1;
        $endDate = $data['end_date'] ?? Carbon::parse($startDate)->addDays($daysCount - 1)->toDateString();

        $leave = LeaveRequest::create([
            'user_id' => $userId,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'days_count' => $daysCount,
            'leave_type' => $data['leave_type'] ?? 'Sick',
            'reason' => $data['reason'],
            'status' => 'Pending',
        ]);

        // Audit log
        AuditLogger::log($leave, 'created', [], $leave->toArray());

        // Fire workflow trigger
        event(new \App\Events\LeaveRequested($leave));

        return $leave;
    }

    /**
     * Action on leave request (Approve/Reject).
     *
     * @param  string  $status  Approved | Rejected
     *
     * @throws Exception
     */
    public function processLeave(int $reviewerId, int $leaveId, string $status, ?string $notes = null): LeaveRequest
    {
        $leave = $this->approvalRepo->findLeaveOrFail($leaveId);

        if ($leave->status !== 'Pending') {
            throw new Exception('This leave request has already been processed.');
        }

        $oldValues = $leave->toArray();

        $leave->update([
            'status' => $status,
            'reviewed_by' => $reviewerId,
            'reviewed_at' => now(),
            'reviewer_notes' => $notes,
        ]);

        // Audit log
        AuditLogger::log($leave, 'updated', $oldValues, $leave->toArray());

        return $leave;
    }
}
