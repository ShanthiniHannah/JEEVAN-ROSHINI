<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiseaseType extends Model
{
    protected $fillable = [
        'disease_name',
        'category',
    ];

    /**
     * Get the disease records under this type.
     */
    public function diseaseRecords()
    {
        return $this->hasMany(DiseaseRecord::class, 'disease_type_id');
    }
}
