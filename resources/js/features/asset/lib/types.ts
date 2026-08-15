export type AssetType = {
    id: number;
    name: string;
    default_maintenance_interval_days: number | null;
    default_instructions: string | null;
};

export type Asset = {
    id: number;
    location_id: number;
    asset_type_id: number | null;
    name: string;
    barcode: string;
    serial_number: string | null;
    maintenance_interval_days: number | null;
    instructions_override: string | null;
};

/**
 * An Asset as returned by the global index — eager-loaded with its full
 * Client/Site/Location path for the breadcrumb column, mirroring the
 * narrow-nested-pick convention `SiteShow`'s `SiteWithClient` type already
 * uses (each level exposes only `id`/`name`, all it's needed for).
 */
export type AssetWithLocationPath = Asset & {
    location: {
        id: number;
        name: string;
        site: {
            id: number;
            name: string;
            client: {
                id: number;
                name: string;
            };
        };
    };
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

/**
 * Shape of a Laravel `LengthAwarePaginator` as serialized to JSON — reusable
 * for any paginated list this project renders through Inertia. Asset is a
 * new bounded context so it gets its own copy of this generic shape rather
 * than reaching into `features/client/lib/types`.
 */
export type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export type AssetSortColumn = 'name' | 'barcode';

export type IndexAssetFilters = {
    search: string | null;
    sort: AssetSortColumn;
    direction: 'asc' | 'desc';
    per_page: number;
};

/**
 * Filters for the global Asset list — extends the Location-scoped
 * `IndexAssetFilters` with the Client/Site/Location narrowing filters that
 * only make sense once the list spans every Location.
 */
export type GlobalIndexAssetFilters = IndexAssetFilters & {
    client_id: number | null;
    site_id: number | null;
    location_id: number | null;
};
