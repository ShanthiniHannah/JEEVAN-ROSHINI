<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medicine extends Model
{
    protected $fillable = [
        'medicine_name',
        'batch_no',
        'expiry_date',
        'unit',
    ];

    protected $casts = [
        'expiry_date' => 'date',
    ];

    /**
     * Get the stock records for this medicine.
     */
    public function stocks()
    {
        return $this->hasMany(MedicineStock::class);
    }

    /**
     * Get the requests made for this medicine.
     */
    public function requests()
    {
        return $this->hasMany(MedicineRequest::class);
    }
}
