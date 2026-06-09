<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicineRequest extends Model
{
    protected $fillable = [
        'requested_by',
        'medicine_id',
        'quantity',
        'status',
        'approved_by',
        'approved_at',
        'remarks',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    /**
     * Get the VHW who requested the medicine.
     */
    public function requester()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    /**
     * Get the medicine requested.
     */
    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }

    /**
     * Get the Project Director who approved/reviewed the request.
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
