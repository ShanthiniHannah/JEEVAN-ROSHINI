<?php

namespace App\Services;

use App\Repositories\AuditRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class AuditService
{
    /**
     * The audit repository.
     *
     * @var AuditRepository
     */
    protected AuditRepository $auditRepo;

    /**
     * AuditService constructor.
     *
     * @param AuditRepository $auditRepo
     */
    public function __construct(AuditRepository $auditRepo)
    {
        $this->auditRepo = $auditRepo;
    }

    /**
     * Fetch paginated audit trail logs.
     *
     * @param string|null $event
     * @param int|null $userId
     * @return LengthAwarePaginator
     */
    public function listLogs(?string $event, ?int $userId): LengthAwarePaginator
    {
        return $this->auditRepo->getLogs($event, $userId);
    }
}
