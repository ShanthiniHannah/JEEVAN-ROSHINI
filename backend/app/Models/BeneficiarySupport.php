<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BeneficiarySupport extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'beneficiary_supports';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'individual_id',
        'support_type',
        'description',
        'financial_amount',
        'status',
        'distribution_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'distribution_date' => 'date',
        'financial_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the individual this support record belongs to.
     * Uses explicit foreign/owner keys because individuals.id is a string primary key.
     */
    public function individual()
    {
        return $this->belongsTo(Individual::class, 'individual_id', 'id');
    }
}
