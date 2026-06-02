<?php

namespace App\Repositories;

use App\Models\AuditLog;
use Illuminate\Pagination\LengthAwarePaginator;

class AuditRepository extends BaseRepository
{
    /**
     * AuditRepository constructor.
     *
     * @param AuditLog $auditLog
     */
    public function __construct(AuditLog $auditLog)
    {
        parent::__construct($auditLog);
    }

    /**
     * Fetch paginated audit trail logs.
     *
     * @param string|null $event
     * @param int|null $userId
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getLogs(?string $event, ?int $userId, int $perPage = 25): LengthAwarePaginator
    {
        $query = $this->model->with('user');

        if ($event) {
            $query->where('event', $event);
        }

        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }
}
