<?php

namespace App\Observers;

use App\Services\AuditLogger;
use Illuminate\Database\Eloquent\Model;

/**
 * AuditObserver
 *
 * Automatically hooks into Eloquent model lifecycle events and records
 * every create/update/delete/restore to the audit_logs table.
 *
 * Register this observer in App\Providers\AppServiceProvider for all
 * sensitive models:
 *
 *   Individual::observe(AuditObserver::class);
 *   Family::observe(AuditObserver::class);
 *   HealthRecord::observe(AuditObserver::class);
 *   Diagnosis::observe(AuditObserver::class);
 *   Medication::observe(AuditObserver::class);
 *   LabReport::observe(AuditObserver::class);
 *   Followup::observe(AuditObserver::class);
 *   Referral::observe(AuditObserver::class);
 *   RiskAlert::observe(AuditObserver::class);
 *   Visit::observe(AuditObserver::class);
 *   BeneficiarySupport::observe(AuditObserver::class);
 */
class AuditObserver
{
    /**
     * Handle the model "created" event.
     */
    public function created(Model $model): void
    {
        AuditLogger::log($model, 'created', [], $model->toArray());
    }

    /**
     * Handle the model "updated" event.
     * Captures exactly which fields changed (old vs new).
     */
    public function updated(Model $model): void
    {
        $dirty = $model->getDirty();
        $original = array_intersect_key($model->getOriginal(), $dirty);

        // Only log if meaningful fields changed (ignore updated_at-only saves)
        $ignoredFields = ['updated_at'];
        $meaningful = array_diff_key($dirty, array_flip($ignoredFields));

        if (! empty($meaningful)) {
            AuditLogger::log(
                $model,
                'updated',
                array_intersect_key($original, $meaningful),
                array_intersect_key($dirty, $meaningful)
            );
        }
    }

    /**
     * Handle the model "deleted" event (soft delete).
     */
    public function deleted(Model $model): void
    {
        AuditLogger::log($model, 'deleted', $model->toArray(), []);
    }

    /**
     * Handle the model "restored" event (soft delete reversal).
     */
    public function restored(Model $model): void
    {
        AuditLogger::log($model, 'restored', [], $model->toArray());
    }
}
