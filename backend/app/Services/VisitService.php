<?php

namespace App\Services;

use App\Models\Visit;
use App\Repositories\VisitRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class VisitService
{
    /**
     * The visit repository.
     */
    protected VisitRepository $visitRepo;

    /**
     * VisitService constructor.
     */
    public function __construct(VisitRepository $visitRepo)
    {
        $this->visitRepo = $visitRepo;
    }

    /**
     * Get paginated visits based on boundaries.
     */
    public function listVisits(?int $userId, array $assignedVillages = []): LengthAwarePaginator
    {
        return $this->visitRepo->getVisitsByScope($userId, $assignedVillages);
    }

    /**
     * Log a new visit.
     */
    public function logVisit(array $data): Visit
    {
        $visit = $this->visitRepo->create($data);

        // Record audit log
        AuditLogger::log($visit, 'created', [], $visit->toArray());

        return $visit;
    }
}
