<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SponsorContribution extends Model
{
    protected $table = 'sponsor_contributions';

    protected $fillable = [
        'sponsor_id',
        'amount',
        'purpose',
        'contribution_date',
    ];

    protected $casts = [
        'contribution_date' => 'date',
    ];

    /**
     * Get the sponsor associated with this contribution.
     */
    public function sponsor()
    {
        return $this->belongsTo(Sponsor::class);
    }
}
