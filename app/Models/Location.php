<?php

namespace App\Models;

use Database\Factories\LocationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * A self-referencing node representing a level of physical space within a
 * Site — Building, Area, Room, or whatever depth a given client needs.
 * `parent_location_id` is null for a node directly under its Site.
 *
 * @property int $id
 * @property int $site_id
 * @property int|null $parent_location_id
 * @property string $type
 * @property string $name
 * @property int|null $maintenance_interval_days
 * @property float|null $latitude
 * @property float|null $longitude
 * @property int|null $geofence_radius_m
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read int|null $children_count
 */
#[Fillable([
    'site_id',
    'parent_location_id',
    'type',
    'name',
    'maintenance_interval_days',
    'latitude',
    'longitude',
    'geofence_radius_m',
])]
class Location extends Model
{
    /** @use HasFactory<LocationFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Site, $this>
     */
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    /**
     * @return BelongsTo<Location, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Location::class, 'parent_location_id');
    }

    /**
     * @return HasMany<Location, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(Location::class, 'parent_location_id');
    }

    /**
     * A sane upper bound on how deep a Location tree can realistically go —
     * used to bail out of ancestor walks instead of looping forever if a
     * parent cycle ever slips past validation (e.g. two concurrent
     * reparents each passing the cycle check before the other commits).
     * Also used by UpdateLocationRequest's own ancestor walk.
     */
    public const int MAX_ANCESTOR_DEPTH = 100;

    /**
     * The maintenance interval that applies to this node: its own, or the
     * nearest ancestor's if this node doesn't set one.
     */
    public function resolveMaintenanceIntervalDays(): ?int
    {
        $node = $this;
        $depth = 0;

        while ($node !== null && $depth < self::MAX_ANCESTOR_DEPTH) {
            if ($node->maintenance_interval_days !== null) {
                return $node->maintenance_interval_days;
            }

            $node = $node->parent;
            $depth++;
        }

        return null;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'maintenance_interval_days' => 'integer',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'geofence_radius_m' => 'integer',
        ];
    }
}
