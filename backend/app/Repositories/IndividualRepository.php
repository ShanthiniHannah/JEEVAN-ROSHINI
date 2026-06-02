<?php

namespace App\Repositories;

use App\Models\Individual;
use Illuminate\Pagination\LengthAwarePaginator;

class IndividualRepository extends BaseRepository
{
    /**
     * IndividualRepository constructor.
     *
     * @param Individual $individual
     */
    public function __construct(Individual $individual)
    {
        parent::__construct($individual);
    }

    /**
     * Search and paginate patient records.
     *
     * @param string|null $searchQuery
     * @param array $assignedVillages
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function searchAndPaginate(?string $searchQuery, array $assignedVillages = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with(['family.village', 'activeRiskAlerts']);

        if (!empty($assignedVillages)) {
            $query->whereHas('family', function ($q) use ($assignedVillages) {
                $q->whereIn('village_id', $assignedVillages);
            });
        }

        if ($searchQuery) {
            $query->where(function ($q) use ($searchQuery) {
                $q->where('name', 'like', "%{$searchQuery}%")
                  ->orWhere('id', 'like', "%{$searchQuery}%")
                  ->orWhere('mobile_number', 'like', "%{$searchQuery}%")
                  ->orWhere('blood_group', 'like', "%{$searchQuery}%")
                  ->orWhere('malnutrition_status', 'like', "%{$searchQuery}%");
            });
        }

        return $query->orderBy('name', 'asc')->paginate($perPage);
    }
}
