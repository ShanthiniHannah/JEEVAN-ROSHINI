<?php

namespace App\Repositories;

use App\Models\Approval;
use App\Models\LeaveRequest;
use Illuminate\Pagination\LengthAwarePaginator;

class ApprovalRepository extends BaseRepository
{
    /**
     * ApprovalRepository constructor.
     */
    public function __construct(Approval $approval)
    {
        parent::__construct($approval);
    }

    /**
     * Fetch pending leave requests with user relationships.
     */
    public function getPendingLeaves(int $perPage = 15): LengthAwarePaginator
    {
        return LeaveRequest::with('user')
            ->where('status', 'Pending')
            ->orderBy('created_at', 'asc')
            ->paginate($perPage);
    }

    /**
     * Fetch all leave requests.
     */
    public function getAllLeaves(int $perPage = 15): LengthAwarePaginator
    {
        return LeaveRequest::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Find a specific leave request.
     */
    public function findLeaveOrFail(int $id): LeaveRequest
    {
        return LeaveRequest::findOrFail($id);
    }
}
