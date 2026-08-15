import { Head, Link } from '@inertiajs/react';
import type { ReactElement } from 'react';
import { LocationTable } from '@/features/client/components/location-table';
import type { Client, LocationNode, Site } from '@/features/client/lib/types';
import BackofficeLayout from '@/layouts/backoffice-layout';
import { index, show } from '@/routes/backoffice/clients';

type SiteWithClient = Site & { client: Pick<Client, 'id' | 'name'> };

export default function SiteShow({
    site,
    locations,
}: {
    site: SiteWithClient;
    locations: LocationNode[];
}) {
    return (
        <>
            <Head title={site.name} />
            <div className="flex flex-col gap-4">
                <div className="border-b bg-secondary p-4">
                    <Link
                        href={show.url(site.client.id)}
                        className="text-sm text-muted-foreground hover:underline"
                    >
                        {site.client.name}
                    </Link>
                    <h1 className="text-xl font-semibold">{site.name}</h1>
                    {site.address && (
                        <p className="text-sm text-muted-foreground">
                            {site.address}
                        </p>
                    )}
                </div>

                <LocationTable siteId={site.id} locations={locations} />
            </div>
        </>
    );
}

// Inertia calls this resolver twice: once with the raw page props (to probe
// whether it returns an element or a layout-config object) and once with the
// actual rendered element — so it must accept either shape.
SiteShow.layout = (
    page: ReactElement<{ site: SiteWithClient }> | { site: SiteWithClient },
) => {
    const site = 'props' in page ? page.props.site : page.site;

    return (
        <BackofficeLayout
            breadcrumbs={[
                { label: 'Klien', href: index.url() },
                { label: site.client.name, href: show.url(site.client.id) },
                // "Site" has no dedicated index route — it only exists as
                // a section inside the Klien detail page — so this crumb
                // links back there too, same as the client-name crumb.
                { label: 'Site', href: show.url(site.client.id) },
                { label: site.name },
            ]}
        >
            {page as ReactElement}
        </BackofficeLayout>
    );
};
