<?php

namespace App\Repositories;

use App\Models\DailySession;
use Illuminate\Pagination\LengthAwarePaginator;

class AttendanceRepository extends BaseRepository
{
    /**
     * AttendanceRepository constructor.
     */
    public function __construct(DailySession $session)
    {
        parent::__construct($session);
    }

    /**
     * Fetch logs scoped by user.
     */
    public function getLogsByScope(?int $userId, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with('vhw');

        if ($userId) {
            $query->where('vhw_id', $userId);
        }

        return $query->orderBy('session_date', 'desc')
            ->orderBy('login_time', 'desc')
            ->paginate($perPage);
    }

    /**
     * Find active check-in record for today.
     */
    public function findTodayCheckIn(int $userId): ?DailySession
    {
        return $this->model->where('vhw_id', $userId)
            ->whereDate('session_date', now()->toDateString())
            ->first();
    }
}
