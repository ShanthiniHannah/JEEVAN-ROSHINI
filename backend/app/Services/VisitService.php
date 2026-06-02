<?php

namespace App\Services;

use App\Repositories\VisitRepository;
use App\Models\Visit;
use Illuminate\Pagination\LengthAwarePaginator;

class VisitService
{
    /**
     * The visit repository.
     *
     * @var VisitRepository
     */
    protected VisitRepository $visitRepo;

    /**
     * VisitService constructor.
     *
     * @param VisitRepository $visitRepo
     */
    public function __construct(VisitRepository $visitRepo)
    {
        $this->visitRepo = $visitRepo;
    }

    /**
     * Get paginated visits based on boundaries.
     *
     * @param int|null $userId
     * @param array $assignedVillages
     * @return LengthAwarePaginator
     */
    public function listVisits(?int $userId, array $assignedVillages = []): LengthAwarePaginator
    {
        return $this->visitRepo->getVisitsByScope($userId, $assignedVillages);
    }

    /**
     * Log a new visit.
     *
     * @param array $data
     * @return Visit
     */
    public function logVisit(array $data): Visit
    {
        $visit = $this->visitRepo->create($data);

        // Record audit log
        AuditLogger::log($visit, 'created', [], $visit->toArray());

        return $visit;
    }
}
