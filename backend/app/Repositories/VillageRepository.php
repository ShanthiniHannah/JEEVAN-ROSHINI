<?php

namespace App\Repositories;

use App\Models\Village;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class VillageRepository extends BaseRepository
{
    /**
     * VillageRepository constructor.
     *
     * @param Village $village
     */
    public function __construct(Village $village)
    {
        parent::__construct($village);
    }

    /**
     * Get all villages, cached in Redis indefinitely or for 30 days.
     *
     * @param array $assignedVillages
     * @return Collection
     */
    public function allCached(array $assignedVillages = []): Collection
    {
        $cacheKey = 'geography:all';

        $villages = Cache::remember($cacheKey, now()->addDays(30), function () {
            return $this->model->with('block.district.organization')->orderBy('name', 'asc')->get();
        });

        if (!empty($assignedVillages)) {
            return $villages->whereIn('id', $assignedVillages)->values();
        }

        return $villages;
    }

    /**
     * Clear geography Cache upon additions or updates.
     */
    public function clearCache(): void
    {
        Cache::forget('geography:all');
    }
}
