<?php

namespace App\Domain\Client\Actions;

use App\Models\Location;
use Illuminate\Support\Facades\DB;

class DeleteLocations
{
    /**
     * Delete every given Location that has no child Locations. Locations
     * that still have children are left untouched and counted as "blocked"
     * — this is what stops a delete from silently cascading away a whole
     * sub-tree. (Assets aren't built yet — once they are, this is where an
     * Asset-dependent check lands too.)
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
                ->withCount('children')
                ->whereKey($locationIds)
                ->get();

            foreach ($locations as $location) {
                if ($location->children_count > 0) {
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
