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

    /**
     * IndividualService constructor.
     */
    public function __construct(IndividualRepository $individualRepo)
    {
        $this->individualRepo = $individualRepo;
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
        if (empty($data['id'])) {
            $data['id'] = 'JR-'.mt_rand(1000, 9999).'-'.mt_rand(100, 999);
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
