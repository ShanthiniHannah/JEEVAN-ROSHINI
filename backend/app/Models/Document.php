<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use SoftDeletes;

    // ─── Category constants ───────────────────────────────────────────────────
    const CATEGORY_PRESCRIPTIONS = 'prescriptions';

    const CATEGORY_LAB_REPORTS = 'lab_reports';

    const CATEGORY_PHOTOS = 'photos';

    const CATEGORY_GOVERNMENT_DOCS = 'government_docs';

    const CATEGORY_TRAINING_DOCS = 'training_docs';

    const CATEGORY_DISCHARGE = 'discharge_summaries';

    protected $fillable = [
        'documentable_type',
        'documentable_id',
        'category',
        'title',
        'file_path',
        'file_name',
        'mime_type',
        'file_size_kb',
        'description',
        'uploaded_by',
    ];

    /**
     * Get the owning documentable model (Individual, Referral, TrainingSession, etc.)
     */
    public function documentable()
    {
        return $this->morphTo();
    }

    /**
     * Get the user who uploaded this document.
     */
    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Scope: filter by category.
     */
    public function scopeOfCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
