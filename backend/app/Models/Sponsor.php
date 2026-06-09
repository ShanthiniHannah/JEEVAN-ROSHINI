<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sponsor extends Model
{
    protected $fillable = [
        'sponsor_name',
        'contact_person',
        'email',
        'mobile',
    ];

    /**
     * Get the contributions made by this sponsor.
     */
    public function contributions()
    {
        return $this->hasMany(SponsorContribution::class);
    }
}
