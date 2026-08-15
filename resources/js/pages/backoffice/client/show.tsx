import { Head } from '@inertiajs/react';
import type { ReactElement } from 'react';
import { Badge } from '@/components/ui/badge';
import { SiteTable } from '@/features/client/components/site-table';
import type {
    Client,
    Paginated,
    Site,
    SiteIndexFilters,
} from '@/features/client/lib/types';
import BackofficeLayout from '@/layouts/backoffice-layout';
import { index } from '@/routes/backoffice/clients';

export default function ClientShow({
    client,
    sites,
    filters,
}: {
    client: Client;
    sites: Paginated<Site>;
    filters: SiteIndexFilters;
}) {
    return (
        <>
            <Head title={client.name} />
            <div className="flex flex-col gap-4">
                <div className="border-b bg-secondary p-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-semibold">{client.name}</h1>
                        <Badge
                            variant={
                                client.status === 'active'
                                    ? 'default'
                                    : 'secondary'
                            }
                        >
                            {client.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                    </div>
                </div>

                <SiteTable
                    clientId={client.id}
                    sites={sites}
                    filters={filters}
                />
            </div>
        </>
    );
}

// Inertia calls this resolver twice: once with the raw page props (to probe
// whether it returns an element or a layout-config object) and once with the
// actual rendered element — so it must accept either shape.
ClientShow.layout = (
    page: ReactElement<{ client: Client }> | { client: Client },
) => {
    const client = 'props' in page ? page.props.client : page.client;

    return (
        <BackofficeLayout
            breadcrumbs={[
                { label: 'Klien', href: index.url() },
                { label: client.name },
            ]}
        >
            {page as ReactElement}
        </BackofficeLayout>
    );
};
