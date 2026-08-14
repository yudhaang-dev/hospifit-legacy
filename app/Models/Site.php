<?php

namespace App\Models;

use App\Domain\Identity\Concerns\BelongsToClient;
use Database\Factories\SiteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A physical facility belonging to a Client (e.g. a specific hospital or
 * clinic). The root of that facility's Location tree. Holds the geofence
 * default (lat/lng/radius) inherited by its Locations unless overridden.
 *
 * @property int $id
 * @property int $client_id
 * @property string $name
 * @property string|null $address
 * @property float $latitude
 * @property float $longitude
 * @property int $geofence_radius_m
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['client_id', 'name', 'address', 'latitude', 'longitude', 'geofence_radius_m'])]
class Site extends Model
{
    /** @use HasFactory<SiteFactory> */
    use BelongsToClient, HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'geofence_radius_m' => 'integer',
        ];
    }
}
