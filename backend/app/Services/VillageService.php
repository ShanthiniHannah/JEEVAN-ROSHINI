<?php

namespace App\Services;

use App\Repositories\VillageRepository;
use App\Models\Village;
use Illuminate\Database\Eloquent\Collection;

class VillageService
{
    /**
     * The village repository.
     *
     * @var VillageRepository
     */
    protected VillageRepository $villageRepo;

    /**
     * VillageService constructor.
     *
     * @param VillageRepository $villageRepo
     */
    public function __construct(VillageRepository $villageRepo)
    {
        $this->villageRepo = $villageRepo;
    }

    /**
     * Fetch list of villages with active caching.
     *
     * @param array $assignedVillages
     * @return Collection
     */
    public function listVillages(array $assignedVillages = []): Collection
    {
        return $this->villageRepo->allCached($assignedVillages);
    }

    /**
     * Retrieve single village details.
     *
     * @param string $id
     * @return Village
     */
    public function getVillage(string $id): Village
    {
        return $this->villageRepo->findOrFail($id, ['*'], ['block.district.organization']);
    }
}
