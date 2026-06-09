<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrainingVenue extends Model
{
    protected $fillable = [
        'name', 'address', 'village_id', 'district_id',
        'maps_link', 'capacity', 'contact_person', 'contact_number', 'status',
    ];

    public function village(): BelongsTo
    {
        return $this->belongsTo(Village::class);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }

    public function trainings(): HasMany
    {
        return $this->hasMany(Training::class, 'venue_id');
    }
}
