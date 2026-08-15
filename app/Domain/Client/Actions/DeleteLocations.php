<?php

namespace App\Domain\Client\Actions;

use App\Models\Location;
use Illuminate\Support\Facades\DB;

class DeleteLocations
{
    /**
     * Delete every given Location that has no child Locations and no
     * Assets. Locations that still have either are left untouched and
     * counted as "blocked" — this is what stops a delete from silently
     * cascading away a whole sub-tree or orphaning registered equipment.
     *
     * @param  array<int, int>  $locationIds
     * @return array{deleted: int, blocked: int}
     */
    public function handle(array $locationIds): array
    {
        return DB::transaction(function () use ($locationIds): array {
            $deleted = 0;
            $blocked = 0;

            $locations = Location::query()
                ->withCount(['children', 'assets'])
                ->whereKey($locationIds)
                ->get();

            foreach ($locations as $location) {
                if ($location->children_count > 0 || $location->assets_count > 0) {
                    $blocked++;

                    continue;
                }

                $location->delete();
                $deleted++;
            }

            return ['deleted' => $deleted, 'blocked' => $blocked];
        });
    }
}
