<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class State extends Model
{
    protected $fillable = ['name', 'code', 'region', 'type', 'status'];

    public function districts(): HasMany
    {
        return $this->hasMany(District::class);
    }

    public function families(): HasMany
    {
        return $this->hasMany(Family::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
