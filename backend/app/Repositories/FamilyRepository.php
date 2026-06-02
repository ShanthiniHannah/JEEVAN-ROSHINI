<?php

namespace App\Repositories;

use App\Models\Family;
use Illuminate\Pagination\LengthAwarePaginator;

class FamilyRepository extends BaseRepository
{
    /**
     * FamilyRepository constructor.
     *
     * @param Family $family
     */
    public function __construct(Family $family)
    {
        parent::__construct($family);
    }

    /**
     * Search and paginate family registry with optional village filtering.
     *
     * @param string|null $searchQuery
     * @param string|null $villageId
     * @param array $assignedVillages
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function searchAndPaginate(?string $searchQuery, ?string $villageId, array $assignedVillages = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with(['members', 'village']);

        // Limit results to assigned villages if not global role
        if (!empty($assignedVillages)) {
            $query->whereIn('village_id', $assignedVillages);
        }

        if ($villageId) {
            $query->where('village_id', $villageId);
        }

        if ($searchQuery) {
            $query->where(function ($q) use ($searchQuery) {
                $q->where('id', 'like', "%{$searchQuery}%")
                  ->orWhere('house_no', 'like', "%{$searchQuery}%")
                  ->orWhere('address', 'like', "%{$searchQuery}%")
                  ->orWhere('occupation', 'like', "%{$searchQuery}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }
}
