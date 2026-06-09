<?php

namespace App\Services;

use App\Models\Family;
use App\Repositories\FamilyRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class FamilyService
{
    /**
     * The family repository.
     */
    protected FamilyRepository $familyRepo;
    protected FamilyCodeService $codeService;

    /**
     * FamilyService constructor.
     */
    public function __construct(FamilyRepository $familyRepo, FamilyCodeService $codeService)
    {
        $this->familyRepo = $familyRepo;
        $this->codeService = $codeService;
    }

    /**
     * Get list of families with search and boundary conditions.
     */
    public function listFamilies(?string $search, ?string $villageId, array $assignedVillages = []): LengthAwarePaginator
    {
        return $this->familyRepo->searchAndPaginate($search, $villageId, $assignedVillages);
    }

    /**
     * Create a new household.
     */
    public function registerFamily(array $data): Family
    {
        if (empty($data['family_code']) && !empty($data['village_id'])) {
            $data['family_code'] = $this->codeService->generateFamilyCode($data['village_id']);
        }

        // Enforce ID generation for family ID if not supplied (for offline sync)
        if (empty($data['id'])) {
            $data['id'] = $data['family_code'] ?? 'FAM-'.mt_rand(1000, 9999).'-'.mt_rand(100, 999);
        }

        $family = $this->familyRepo->create($data);

        // Record audit log
        AuditLogger::log($family, 'created', [], $family->toArray());

        return $family;
    }

    /**
     * Find a specific family registry.
     */
    public function getFamily(string $id): Family
    {
        return $this->familyRepo->findOrFail($id, ['*'], ['members', 'village']);
    }

    /**
     * Update household parameters.
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
