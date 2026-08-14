import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
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
                    <Link
                        href={index.url()}
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
                    >
                        <ArrowLeftIcon data-icon="inline-start" />
                        Kembali ke Klien
                    </Link>
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

ClientShow.layout = (page: ReactElement) => (
    <BackofficeLayout children={page as ReactNode} />
);
