<?php

namespace App\Services;

use App\Repositories\AuditRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class AuditService
{
    /**
     * The audit repository.
     */
    protected AuditRepository $auditRepo;

    /**
     * AuditService constructor.
     */
    public function __construct(AuditRepository $auditRepo)
    {
        $this->auditRepo = $auditRepo;
    }

    /**
     * Fetch paginated audit trail logs.
     */
    public function listLogs(?string $event, ?int $userId): LengthAwarePaginator
    {
        return $this->auditRepo->getLogs($event, $userId);
    }
}
