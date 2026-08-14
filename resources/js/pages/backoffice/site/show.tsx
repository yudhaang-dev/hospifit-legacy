import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { LocationTable } from '@/features/client/components/location-table';
import type { LocationNode, Site } from '@/features/client/lib/types';
import BackofficeLayout from '@/layouts/backoffice-layout';
import { show } from '@/routes/backoffice/clients';

export default function SiteShow({
    site,
    locations,
}: {
    site: Site;
    locations: LocationNode[];
}) {
    return (
        <>
            <Head title={site.name} />
            <div className="flex flex-col gap-4">
                <div className="border-b bg-secondary p-4">
                    <Link
                        href={show.url(site.client_id)}
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
                    >
                        <ArrowLeftIcon data-icon="inline-start" />
                        Kembali ke Klien
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

SiteShow.layout = (page: ReactElement) => (
    <BackofficeLayout children={page as ReactNode} />
);
