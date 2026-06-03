<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RiskAlert extends Model
{
    use SoftDeletes;

    // ─── Rule-based alert type constants ─────────────────────────────────────
    const TYPE_HYPERTENSION = 'Hypertension';

    const TYPE_DIABETES = 'Diabetes';

    const TYPE_MALNUTRITION = 'Malnutrition';

    const TYPE_HIGH_RISK_PREGNANCY = 'High-Risk-Pregnancy';

    const TYPE_MISSED_FOLLOWUP = 'Missed-Followup';

    const TYPE_ABNORMAL_LAB = 'Abnormal-Lab-Result';

    const TYPE_LOW_SPO2 = 'Low-SpO2';

    const TYPE_HIGH_FEVER = 'High-Fever';

    // ─── Severity constants ───────────────────────────────────────────────────
    const SEVERITY_LOW = 'low';

    const SEVERITY_MEDIUM = 'medium';

    const SEVERITY_HIGH = 'high';

    const SEVERITY_CRITICAL = 'critical';

    protected $fillable = [
        'individual_id',
        'type',
        'severity',
        'reason',
        'trigger_data',
        'status',
        'acknowledged_by',
        'acknowledged_at',
        'resolved_at',
        'resolved_by',
    ];

    protected $casts = [
        'trigger_data' => 'array',
        'acknowledged_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    /**
     * Get the individual associated with the risk alert.
     */
    public function individual()
    {
        return $this->belongsTo(Individual::class, 'individual_id', 'id');
    }

    /**
     * Get the user who acknowledged the alert.
     */
    public function acknowledgedBy()
    {
        return $this->belongsTo(User::class, 'acknowledged_by');
    }

    /**
     * Get the user who resolved the alert.
     */
    public function resolvedBy()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    /**
     * Scope: only active (unresolved) alerts.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }

    /**
     * Scope: filter by severity level.
     */
    public function scopeOfSeverity($query, string $severity)
    {
        return $query->where('severity', $severity);
    }

    /**
     * Scope: critical or high alerts only.
     */
    public function scopeUrgent($query)
    {
        return $query->whereIn('severity', [self::SEVERITY_HIGH, self::SEVERITY_CRITICAL]);
    }
}
