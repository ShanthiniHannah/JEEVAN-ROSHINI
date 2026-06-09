<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitPhoto extends Model
{
    protected $table = 'visit_photos';

    protected $fillable = [
        'visit_id',
        'photo_path',
        'captured_at',
    ];

    protected $casts = [
        'captured_at' => 'datetime',
    ];

    /**
     * Get the visit log associated with this photo.
     */
    public function visit()
    {
        return $this->belongsTo(Visit::class, 'visit_id');
    }
}
