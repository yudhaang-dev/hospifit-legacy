export type AssetType = {
    id: number;
    name: string;
    default_maintenance_interval_days: number | null;
    default_instructions: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

/**
 * Shape of a Laravel `LengthAwarePaginator` as serialized to JSON —
 * AssetType is its own bounded context so it gets its own copy of this
 * generic shape rather than reaching into another feature's types.
 */
export type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export type AssetTypeSortColumn = 'name';

export type IndexAssetTypeFilters = {
    search: string | null;
    sort: AssetTypeSortColumn;
    direction: 'asc' | 'desc';
    per_page: number;
};
