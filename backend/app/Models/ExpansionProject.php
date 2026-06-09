<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpansionProject extends Model
{
    protected $table = 'expansion_projects';

    protected $fillable = [
        'state_id',
        'district_id',
        'village_id',
        'budget',
        'start_date',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
    ];

    /**
     * Get the state associated with this expansion project.
     */
    public function state()
    {
        return $this->belongsTo(State::class);
    }

    /**
     * Get the district associated with this expansion project.
     */
    public function district()
    {
        return $this->belongsTo(District::class);
    }

    /**
     * Get the village associated with this expansion project.
     */
    public function village()
    {
        return $this->belongsTo(Village::class);
    }
}
