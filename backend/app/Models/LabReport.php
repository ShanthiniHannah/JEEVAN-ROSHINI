<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LabReport extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'individual_id',
        'visit_id',
        'test_name',
        'category',
        'result_value',
        'unit',
        'normal_range',
        'is_abnormal',
        'test_date',
        'report_date',
        'lab_name',
        'file_path',
        'notes',
        'recorded_by',
    ];

    protected $casts = [
        'is_abnormal' => 'boolean',
        'test_date'   => 'date',
        'report_date' => 'date',
    ];

    /**
     * Get the individual this lab report belongs to.
     */
    public function individual()
    {
        return $this->belongsTo(Individual::class, 'individual_id', 'id');
    }

    /**
     * Get the visit this lab report was taken during.
     */
    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }

    /**
     * Get the user who recorded this result.
     */
    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    /**
     * Scope: abnormal results only — for dashboard/alert flagging.
     */
    public function scopeAbnormal($query)
    {
        return $query->where('is_abnormal', true);
    }

    /**
     * Scope: filter by test category.
     */
    public function scopeOfCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
