<?php

namespace App\Models;

use Database\Factories\AssetTypeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * A global, reusable category of Asset (e.g. "AC Split", "Genset") carrying
 * default maintenance interval/instructions shared across every Asset
 * tagged with it. Not scoped to any Client/Site/Location.
 *
 * @property int $id
 * @property string $name
 * @property int|null $default_maintenance_interval_days
 * @property string|null $default_instructions
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read int|null $assets_count
 */
#[Fillable(['name', 'default_maintenance_interval_days', 'default_instructions'])]
class AssetType extends Model
{
    /** @use HasFactory<AssetTypeFactory> */
    use HasFactory;

    /**
     * @return HasMany<Asset, $this>
     */
    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'default_maintenance_interval_days' => 'integer',
        ];
    }
}
