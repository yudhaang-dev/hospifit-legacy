<?php

namespace App\Domain\Client\Actions;

use App\Models\Site;
use Illuminate\Support\Facades\DB;

class DeleteSites
{
    /**
     * Delete every given Site that has no Locations. Sites that still have
     * Locations are left untouched and counted as "blocked" — this is what
     * stops a delete from silently cascading away a Site's Location tree.
     *
     * @param  array<int, int>  $siteIds
     * @return array{deleted: int, blocked: int}
     */
    public function handle(array $siteIds): array
    {
        return DB::transaction(function () use ($siteIds): array {
            $deleted = 0;
            $blocked = 0;

            $sites = Site::query()
                ->withCount('locations')
                ->whereKey($siteIds)
                ->get();

            foreach ($sites as $site) {
                if ($site->locations_count > 0) {
                    $blocked++;

                    continue;
                }

                $site->delete();
                $deleted++;
            }

            return ['deleted' => $deleted, 'blocked' => $blocked];
        });
    }
}
