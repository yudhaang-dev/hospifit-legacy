<?php

namespace App\Domain\Client\Actions;

use App\Models\Location;
use Illuminate\Support\Collection;

class BuildLocationTree
{
    /**
     * Flatten a Site's Locations into a depth-first ordered list, each
     * annotated with its `depth` in the tree (0 = directly under the Site)
     * — the exact shape the "flat list with indentation" UI renders.
     *
     * @param  Collection<int, Location>  $locations
     * @return array<int, array<string, mixed>>
     */
    public function handle(Collection $locations): array
    {
        /** @var array<int, list<Location>> $byParent */
        $byParent = [];

        foreach ($locations as $location) {
            $byParent[$location->parent_location_id ?? 0][] = $location;
        }

        $flatten = function (int $parentKey, int $depth) use (&$flatten, $byParent): array {
            $nodes = [];

            foreach ($byParent[$parentKey] ?? [] as $location) {
                $nodes[] = [...$location->toArray(), 'depth' => $depth];
                $nodes = [...$nodes, ...$flatten($location->id, $depth + 1)];
            }

            return $nodes;
        };

        return $flatten(0, 0);
    }
}
