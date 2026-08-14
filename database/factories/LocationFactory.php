<?php

namespace Database\Factories;

use App\Models\Location;
use App\Models\Site;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Location>
 */
class LocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'site_id' => Site::factory(),
            'parent_location_id' => null,
            'type' => fake()->randomElement(['building', 'area', 'room']),
            'name' => fake()->word(),
            'maintenance_interval_days' => null,
            'latitude' => null,
            'longitude' => null,
            'geofence_radius_m' => null,
        ];
    }

    /**
     * Place this Location under the given parent (inheriting its Site).
     */
    public function childOf(Location $parent): static
    {
        return $this->state(fn (array $attributes) => [
            'site_id' => $parent->site_id,
            'parent_location_id' => $parent->id,
        ]);
    }
}
