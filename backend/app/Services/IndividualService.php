<?php

namespace App\Services;

use App\Models\Individual;
use App\Repositories\IndividualRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class IndividualService
{
    /**
     * The individual repository.
     */
    protected IndividualRepository $individualRepo;
    protected FamilyCodeService $codeService;

    /**
     * IndividualService constructor.
     */
    public function __construct(IndividualRepository $individualRepo, FamilyCodeService $codeService)
    {
        $this->individualRepo = $individualRepo;
        $this->codeService = $codeService;
    }

    /**
     * Search and paginate patient lists.
     */
    public function listIndividuals(?string $search, array $assignedVillages = []): LengthAwarePaginator
    {
        return $this->individualRepo->searchAndPaginate($search, $assignedVillages);
    }

    /**
     * Register a new patient and automatically execute clinical risk alerts service check.
     */
    public function registerIndividual(array $data): Individual
    {
        if (!empty($data['family_id']) && !is_numeric($data['family_id'])) {
            $family = \App\Models\Family::where('family_code', $data['family_id'])->first();
            if ($family) {
                $data['family_id'] = $family->id;
            }
        }

        if (empty($data['individual_code']) && !empty($data['family_id'])) {
            $family = \App\Models\Family::find($data['family_id']);
            if ($family && $family->family_code) {
                $data['individual_code'] = $this->codeService->generateIndividualCode($family->family_code);
            }
        }

        if (empty($data['id'])) {
            $data['id'] = $data['individual_code'] ?? 'JR-'.mt_rand(1000, 9999).'-'.mt_rand(100, 999);
        }

        $individual = $this->individualRepo->create($data);

        // Run automated health risk evaluations on the newly registered patient
        app(RiskAlertService::class)->evaluateIndividual($individual);

        // Record audit log
        AuditLogger::log($individual, 'created', [], $individual->toArray());

        return $individual;
    }

    /**
     * Find a patient's card.
     */
    public function getIndividual(string $id): Individual
    {
        return $this->individualRepo->findOrFail($id, ['*'], ['family.village', 'activeRiskAlerts', 'healthRecords']);
    }

    /**
     * Update patient data.
     */
    public function updateIndividual(string $id, array $data): Individual
    {
        $individual = $this->getIndividual($id);
        $oldValues = $individual->toArray();

        $updatedIndividual = $this->individualRepo->update($id, $data);

        // Re-evaluate risk alerts
        app(RiskAlertService::class)->evaluateIndividual($updatedIndividual);

        // Record audit log
        AuditLogger::log($updatedIndividual, 'updated', $oldValues, $updatedIndividual->toArray());

        return $updatedIndividual;
    }

    /**
     * Trigger a PII Reveal audit log event.
     *
     * @param  string  $fieldType  e.g. 'Aadhaar', 'Mobile'
     */
    public function auditPiiReveal(string $id, string $fieldType): Individual
    {
        $individual = $this->getIndividual($id);

        // Custom reveal logs
        AuditLogger::logAction(
            'PII_REVEAL',
            "User revealed masked PII field [{$fieldType}] for patient ID: {$id} ({$individual->name})"
        );

        return $individual;
    }
}
