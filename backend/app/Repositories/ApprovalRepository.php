<?php

namespace App\Repositories;

use App\Models\Approval;
use App\Models\LeaveRequest;
use Illuminate\Pagination\LengthAwarePaginator;

class ApprovalRepository extends BaseRepository
{
    /**
     * ApprovalRepository constructor.
     *
     * @param Approval $approval
     */
    public function __construct(Approval $approval)
    {
        parent::__construct($approval);
    }

    /**
     * Fetch pending leave requests with user relationships.
     *
     * @param int $perPage
     * @return LengthAwarePaginator
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
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getAllLeaves(int $perPage = 15): LengthAwarePaginator
    {
        return LeaveRequest::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Find a specific leave request.
     *
     * @param int $id
     * @return LeaveRequest
     */
    public function findLeaveOrFail(int $id): LeaveRequest
    {
        return LeaveRequest::findOrFail($id);
    }
}
