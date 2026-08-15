<?php

namespace Database\Factories;

use App\Models\Asset;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Asset>
 */
class AssetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'location_id' => Location::factory(),
            'asset_type_id' => null,
            'name' => fake()->words(2, true),
            'barcode' => 'AST-'.Str::upper(Str::random(7)),
            'serial_number' => fake()->optional()->bothify('SN-########'),
            'maintenance_interval_days' => null,
            'instructions_override' => null,
        ];
    }

    /**
     * Register this Asset under the given Location.
     */
    public function forLocation(Location $location): static
    {
        return $this->state(fn (array $attributes) => [
            'location_id' => $location->id,
        ]);
    }
}
