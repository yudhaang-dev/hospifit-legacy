<?php

namespace App\Domain\Asset\Actions;

use App\Models\AssetType;
use Illuminate\Support\Facades\DB;

class DeleteAssetTypes
{
    /**
     * Delete every given AssetType that no Asset still references. AssetTypes
     * still referenced by an Asset are left untouched and counted as
     * "blocked" — this is what stops a delete from silently orphaning
     * registered equipment.
     *
     * @param  array<int, int>  $assetTypeIds
     * @return array{deleted: int, blocked: int}
     */
    public function handle(array $assetTypeIds): array
    {
        return DB::transaction(function () use ($assetTypeIds): array {
            $deleted = 0;
            $blocked = 0;

            $assetTypes = AssetType::query()
                ->withCount('assets')
                ->whereKey($assetTypeIds)
                ->get();

            foreach ($assetTypes as $assetType) {
                if ($assetType->assets_count > 0) {
                    $blocked++;

                    continue;
                }

                $assetType->delete();
                $deleted++;
            }

            return ['deleted' => $deleted, 'blocked' => $blocked];
        });
    }
}
