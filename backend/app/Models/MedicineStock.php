<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicineStock extends Model
{
    protected $table = 'medicine_stock';

    protected $fillable = [
        'medicine_id',
        'village_id',
        'quantity',
    ];

    /**
     * Get the medicine info.
     */
    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    /**
     * Get the village where stock is stored.
     */
    public function village()
    {
        return $this->belongsTo(Village::class);
    }
}
