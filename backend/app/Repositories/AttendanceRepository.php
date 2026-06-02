<?php

namespace App\Repositories;

use App\Models\Attendance;
use Illuminate\Pagination\LengthAwarePaginator;

class AttendanceRepository extends BaseRepository
{
    /**
     * AttendanceRepository constructor.
     *
     * @param Attendance $attendance
     */
    public function __construct(Attendance $attendance)
    {
        parent::__construct($attendance);
    }

    /**
     * Fetch logs scoped by user.
     *
     * @param int|null $userId
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getLogsByScope(?int $userId, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with('user');

        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->orderBy('date', 'desc')
                     ->orderBy('check_in_time', 'desc')
                     ->paginate($perPage);
    }

    /**
     * Find active check-in record for today.
     *
     * @param int $userId
     * @return Attendance|null
     */
    public function findTodayCheckIn(int $userId): ?Attendance
    {
        return $this->model->where('user_id', $userId)
                           ->whereDate('date', now()->toDateString())
                           ->first();
    }
}
