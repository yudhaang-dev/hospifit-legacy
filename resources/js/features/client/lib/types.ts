export type ClientStatus = 'active' | 'inactive';

export type Client = {
    id: number;
    name: string;
    status: ClientStatus;
};

export type Site = {
    id: number;
    client_id: number;
    name: string;
    address: string | null;
    latitude: string;
    longitude: string;
    geofence_radius_m: number;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

/**
 * Shape of a Laravel `LengthAwarePaginator` as serialized to JSON — reusable
 * for any paginated list this project renders through Inertia.
 */
export type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export type ClientSortColumn = 'name' | 'status';

export type ClientIndexFilters = {
    search: string | null;
    sort: ClientSortColumn;
    direction: 'asc' | 'desc';
    per_page: number;
};

export type SiteSortColumn = 'name' | 'geofence_radius_m';

export type SiteIndexFilters = {
    search: string | null;
    sort: SiteSortColumn;
    direction: 'asc' | 'desc';
    per_page: number;
};

export type Location = {
    id: number;
    site_id: number;
    parent_location_id: number | null;
    type: string;
    name: string;
    maintenance_interval_days: number | null;
    latitude: string | null;
    longitude: string | null;
    geofence_radius_m: number | null;
};

/**
 * A Location as returned by the tree-flattening backend Action — the same
 * Location fields plus its depth in the tree, ready to render as an
 * indented flat list.
 */
export type LocationNode = Location & {
    depth: number;
};
