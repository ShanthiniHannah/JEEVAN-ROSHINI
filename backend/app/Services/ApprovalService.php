<?php

namespace App\Services;

use App\Repositories\ApprovalRepository;
use App\Models\LeaveRequest;
use Illuminate\Pagination\LengthAwarePaginator;
use Exception;

class ApprovalService
{
    /**
     * The approval repository.
     *
     * @var ApprovalRepository
     */
    protected ApprovalRepository $approvalRepo;

    /**
     * ApprovalService constructor.
     *
     * @param ApprovalRepository $approvalRepo
     */
    public function __construct(ApprovalRepository $approvalRepo)
    {
        $this->approvalRepo = $approvalRepo;
    }

    /**
     * Get pending leaves.
     *
     * @return LengthAwarePaginator
     */
    public function listPendingLeaves(): LengthAwarePaginator
    {
        return $this->approvalRepo->getPendingLeaves();
    }

    /**
     * Get all leaves.
     *
     * @return LengthAwarePaginator
     */
    public function listAllLeaves(): LengthAwarePaginator
    {
        return $this->approvalRepo->getAllLeaves();
    }

    /**
     * Apply for leave request.
     *
     * @param int $userId
     * @param array $data
     * @return LeaveRequest
     */
    public function applyForLeave(int $userId, array $data): LeaveRequest
    {
        $startDate = $data['start_date'];
        $daysCount = $data['days_count'] ?? 1;
        $endDate = $data['end_date'] ?? \Carbon\Carbon::parse($startDate)->addDays($daysCount - 1)->toDateString();

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

        return $leave;
    }

    /**
     * Action on leave request (Approve/Reject).
     *
     * @param int $reviewerId
     * @param int $leaveId
     * @param string $status Approved | Rejected
     * @param string|null $notes
     * @return LeaveRequest
     * @throws Exception
     */
    public function processLeave(int $reviewerId, int $leaveId, string $status, ?string $notes = null): LeaveRequest
    {
        $leave = $this->approvalRepo->findLeaveOrFail($leaveId);

        if ($leave->status !== 'Pending') {
            throw new Exception("This leave request has already been processed.");
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
