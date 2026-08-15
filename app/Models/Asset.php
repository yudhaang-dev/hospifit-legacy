<?php

namespace App\Models;

use Database\Factories\AssetFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * One physical item of equipment (AC unit, genset, medical device) registered
 * under a Location, optionally tagged with an AssetType, always carrying a
 * unique system-generated barcode.
 *
 * @property int $id
 * @property int $location_id
 * @property int|null $asset_type_id
 * @property string $name
 * @property string $barcode
 * @property string|null $serial_number
 * @property int|null $maintenance_interval_days
 * @property string|null $instructions_override
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AssetType|null $assetType
 */
#[Fillable([
    'location_id',
    'asset_type_id',
    'name',
    'barcode',
    'serial_number',
    'maintenance_interval_days',
    'instructions_override',
])]
class Asset extends Model
{
    /** @use HasFactory<AssetFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Location, $this>
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * @return BelongsTo<AssetType, $this>
     */
    public function assetType(): BelongsTo
    {
        return $this->belongsTo(AssetType::class);
    }

    /**
     * The maintenance interval that applies to this Asset: its own override,
     * then its AssetType's default, then the Location's resolved default
     * (which itself walks up the Location tree). Guards on `asset_type_id`
     * before touching the `assetType` relation — PHPStan/Larastan can't see
     * that a BelongsTo's magic-accessed model is nullable, so touching it
     * unconditionally would risk a "property access on null" warning at
     * runtime for Assets with no AssetType.
     */
    public function resolveMaintenanceIntervalDays(): ?int
    {
        if ($this->maintenance_interval_days !== null) {
            return $this->maintenance_interval_days;
        }

        if ($this->asset_type_id !== null && $this->assetType->default_maintenance_interval_days !== null) {
            return $this->assetType->default_maintenance_interval_days;
        }

        return $this->location->resolveMaintenanceIntervalDays();
    }

    /**
     * The instructions that apply to this Asset: its own override, then its
     * AssetType's default. See resolveMaintenanceIntervalDays() for why the
     * `assetType` relation is guarded by `asset_type_id` first.
     */
    public function resolveInstructions(): ?string
    {
        if ($this->instructions_override !== null) {
            return $this->instructions_override;
        }

        return $this->asset_type_id !== null
            ? $this->assetType->default_instructions
            : null;
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
        ];
    }
}
