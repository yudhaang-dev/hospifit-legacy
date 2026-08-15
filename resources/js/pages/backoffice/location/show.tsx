import { Head, Link } from '@inertiajs/react';
import type { ReactElement } from 'react';
import { AssetTable } from '@/features/asset/components/asset-table';
import type {
    Asset,
    AssetType,
    IndexAssetFilters,
    Paginated,
} from '@/features/asset/lib/types';
import type { Client, Location, Site } from '@/features/client/lib/types';
import BackofficeLayout from '@/layouts/backoffice-layout';
import {
    index as clientsIndex,
    show as showClient,
} from '@/routes/backoffice/clients';
import { show as showSite } from '@/routes/backoffice/sites';

type LocationShowProps = {
    location: Location;
    site: Site;
    client: Client;
    assets: Paginated<Asset>;
    assetTypes: AssetType[];
    filters: IndexAssetFilters;
};

export default function LocationShow({
    location,
    site,
    assets,
    assetTypes,
    filters,
}: LocationShowProps) {
    return (
        <>
            <Head title={location.name} />
            <div className="flex flex-col gap-4">
                <div className="border-b bg-secondary p-4">
                    <Link
                        href={showSite.url(site.id)}
                        className="text-sm text-muted-foreground hover:underline"
                    >
                        {site.name}
                    </Link>
                    <h1 className="text-xl font-semibold">{location.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        {location.type}
                    </p>
                </div>

                <AssetTable
                    locationId={location.id}
                    assets={assets}
                    assetTypes={assetTypes}
                    filters={filters}
                />
            </div>
        </>
    );
}

// Inertia calls this resolver twice: once with the raw page props (to probe
// whether it returns an element or a layout-config object) and once with the
// actual rendered element — so it must accept either shape.
LocationShow.layout = (
    page: ReactElement<LocationShowProps> | LocationShowProps,
) => {
    const props = 'props' in page ? page.props : page;

    return (
        <BackofficeLayout
            breadcrumbs={[
                { label: 'Klien', href: clientsIndex.url() },
                {
                    label: props.client.name,
                    href: showClient.url(props.client.id),
                },
                // "Site" has no dedicated index route — it only exists as
                // a section inside the Klien detail page — so this crumb
                // links back there too, same as the client-name crumb.
                { label: 'Site', href: showClient.url(props.client.id) },
                { label: props.site.name, href: showSite.url(props.site.id) },
                { label: props.location.name },
            ]}
        >
            {page as ReactElement}
        </BackofficeLayout>
    );
};
