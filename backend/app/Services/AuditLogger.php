<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

/**
 * AuditLogger Service
 *
 * Provides a clean API to record who did what, to which record, and when.
 * This is mandatory for healthcare data compliance.
 *
 * Usage (in Controllers or Observers):
 *   AuditLogger::log($model, 'updated', $oldValues, $newValues);
 *   AuditLogger::logAction('export', 'Monthly report downloaded');
 *   AuditLogger::logLogin();
 *
 * Best practice: use AuditObserver to auto-log model events.
 * Manual logging is available for non-model events (exports, logins, etc.)
 */
class AuditLogger
{
    /**
     * Log a model-level event (created, updated, deleted, restored).
     *
     * @param Model  $model     The Eloquent model being acted on
     * @param string $event     created | updated | deleted | restored
     * @param array  $oldValues State before the change (empty for 'created')
     * @param array  $newValues State after the change (empty for 'deleted')
     */
    public static function log(Model $model, string $event, array $oldValues = [], array $newValues = []): void
    {
        AuditLog::create([
            'user_id'     => Auth::id(),
            'action'      => strtoupper($event) . '_' . strtoupper(class_basename($model)),
            'description' => $event . ' ' . class_basename($model) . ' #' . $model->getKey(),
            'event'       => $event,
            'model_type'  => get_class($model),
            'model_id'    => (string) $model->getKey(),
            'old_values'  => !empty($oldValues) ? json_encode($oldValues) : null,
            'new_values'  => !empty($newValues) ? json_encode($newValues) : null,
            'ip_address'  => Request::ip(),
            'user_agent'  => Request::userAgent(),
        ]);
    }

    /**
     * Log a non-model action (e.g. login, export, bulk operation).
     *
     * @param string $action      Short action code e.g. 'LOGIN', 'EXPORT_REPORT'
     * @param string $description Human-readable description
     */
    public static function logAction(string $action, string $description = ''): void
    {
        AuditLog::create([
            'user_id'    => Auth::id(),
            'action'     => strtoupper($action),
            'event'      => 'action',
            'description' => $description,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    /**
     * Log a user login event.
     */
    public static function logLogin(): void
    {
        self::logAction('LOGIN', 'User authenticated successfully.');
    }

    /**
     * Log a user logout event.
     */
    public static function logLogout(): void
    {
        self::logAction('LOGOUT', 'User session ended.');
    }
}
