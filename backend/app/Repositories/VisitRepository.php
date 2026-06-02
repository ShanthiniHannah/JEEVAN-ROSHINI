<?php

namespace App\Repositories;

use App\Models\Visit;
use Illuminate\Pagination\LengthAwarePaginator;

class VisitRepository extends BaseRepository
{
    /**
     * VisitRepository constructor.
     *
     * @param Visit $visit
     */
    public function __construct(Visit $visit)
    {
        parent::__construct($visit);
    }

    /**
     * Retrieve visits mapped to health workers or assigned villages.
     *
     * @param int|null $userId
     * @param array $assignedVillages
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getVisitsByScope(?int $userId, array $assignedVillages = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with(['user', 'family.village']);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        if (!empty($assignedVillages)) {
            $query->whereHas('family', function ($q) use ($assignedVillages) {
                $q->whereIn('village_id', $assignedVillages);
            });
        }

        return $query->orderBy('visit_date', 'desc')->paginate($perPage);
    }
}
