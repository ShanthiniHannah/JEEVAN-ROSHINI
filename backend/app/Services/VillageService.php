<?php

namespace App\Services;

use App\Models\Village;
use App\Repositories\VillageRepository;
use Illuminate\Database\Eloquent\Collection;

class VillageService
{
    /**
     * The village repository.
     */
    protected VillageRepository $villageRepo;

    /**
     * VillageService constructor.
     */
    public function __construct(VillageRepository $villageRepo)
    {
        $this->villageRepo = $villageRepo;
    }

    /**
     * Fetch list of villages with active caching.
     */
    public function listVillages(array $assignedVillages = []): Collection
    {
        return $this->villageRepo->allCached($assignedVillages);
    }

    /**
     * Retrieve single village details.
     */
    public function getVillage(string $id): Village
    {
        return $this->villageRepo->findOrFail($id, ['*'], ['block.district.organization']);
    }
}
