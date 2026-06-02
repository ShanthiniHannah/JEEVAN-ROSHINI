<?php

namespace App\Services;

use App\Repositories\FamilyRepository;
use App\Models\Family;
use Illuminate\Pagination\LengthAwarePaginator;

class FamilyService
{
    /**
     * The family repository.
     *
     * @var FamilyRepository
     */
    protected FamilyRepository $familyRepo;

    /**
     * FamilyService constructor.
     *
     * @param FamilyRepository $familyRepo
     */
    public function __construct(FamilyRepository $familyRepo)
    {
        $this->familyRepo = $familyRepo;
    }

    /**
     * Get list of families with search and boundary conditions.
     *
     * @param string|null $search
     * @param string|null $villageId
     * @param array $assignedVillages
     * @return LengthAwarePaginator
     */
    public function listFamilies(?string $search, ?string $villageId, array $assignedVillages = []): LengthAwarePaginator
    {
        return $this->familyRepo->searchAndPaginate($search, $villageId, $assignedVillages);
    }

    /**
     * Create a new household.
     *
     * @param array $data
     * @return Family
     */
    public function registerFamily(array $data): Family
    {
        // Enforce UUID generation for family ID if not supplied (for offline sync)
        if (empty($data['id'])) {
            $data['id'] = 'FAM-' . mt_rand(1000, 9999) . '-' . mt_rand(100, 999);
        }

        $family = $this->familyRepo->create($data);

        // Record audit log
        AuditLogger::log($family, 'created', [], $family->toArray());

        return $family;
    }

    /**
     * Find a specific family registry.
     *
     * @param string $id
     * @return Family
     */
    public function getFamily(string $id): Family
    {
        return $this->familyRepo->findOrFail($id, ['*'], ['members', 'village']);
    }

    /**
     * Update household parameters.
     *
     * @param string $id
     * @param array $data
     * @return Family
     */
    public function updateFamily(string $id, array $data): Family
    {
        $family = $this->getFamily($id);
        $oldValues = $family->toArray();

        $updatedFamily = $this->familyRepo->update($id, $data);

        // Record audit log
        AuditLogger::log($updatedFamily, 'updated', $oldValues, $updatedFamily->toArray());

        return $updatedFamily;
    }

    /**
     * Soft delete family registry.
     *
     * @param string $id
     * @return bool
     */
    public function removeFamily(string $id): bool
    {
        $family = $this->getFamily($id);
        $oldValues = $family->toArray();

        $result = $this->familyRepo->delete($id);

        if ($result) {
            AuditLogger::log($family, 'deleted', $oldValues, []);
        }

        return $result;
    }
}
