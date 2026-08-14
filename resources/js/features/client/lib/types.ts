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
