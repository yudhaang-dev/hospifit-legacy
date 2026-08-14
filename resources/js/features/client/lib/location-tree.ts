import type { LocationNode } from '@/features/client/lib/types';

/**
 * Given a depth-first ordered, indented flat list of Locations (see
 * `BuildLocationTree` on the backend), find every descendant of the given
 * node — its children appear immediately after it at a greater depth, until
 * a node at the same or shallower depth is reached.
 */
export function getDescendantIds(
    locations: LocationNode[],
    nodeId: number,
): Set<number> {
    const index = locations.findIndex((location) => location.id === nodeId);

    if (index === -1) {
        return new Set();
    }

    const nodeDepth = locations[index].depth;
    const descendants = new Set<number>();

    for (let i = index + 1; i < locations.length; i++) {
        if (locations[i].depth <= nodeDepth) {
            break;
        }

        descendants.add(locations[i].id);
    }

    return descendants;
}

/**
 * Matches the backend's Location::MAX_ANCESTOR_DEPTH — bails out of the
 * ancestor walk below instead of looping forever if a parent cycle were
 * ever present (see the backend constant for why this can't be assumed
 * impossible).
 */
const MAX_ANCESTOR_DEPTH = 100;

/**
 * Mirrors `Location::resolveMaintenanceIntervalDays()` on the backend, for
 * display purposes only — walks up via `parent_location_id` until a node
 * sets its own interval, or returns null if none of its ancestors do.
 */
export function resolveMaintenanceIntervalDays(
    locations: LocationNode[],
    node: LocationNode,
): number | null {
    const byId = new Map(locations.map((location) => [location.id, location]));
    let current: LocationNode | undefined = node;
    let depth = 0;

    while (current && depth < MAX_ANCESTOR_DEPTH) {
        if (current.maintenance_interval_days !== null) {
            return current.maintenance_interval_days;
        }

        current = current.parent_location_id
            ? byId.get(current.parent_location_id)
            : undefined;
        depth++;
    }

    return null;
}
