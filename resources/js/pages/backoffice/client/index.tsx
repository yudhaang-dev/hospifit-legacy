import { Head } from '@inertiajs/react';
import type { ReactElement, ReactNode } from 'react';
import { ClientTable } from '@/features/client/components/client-table';
import type {
    Client,
    ClientIndexFilters,
    Paginated,
} from '@/features/client/lib/types';
import BackofficeLayout from '@/layouts/backoffice-layout';

export default function ClientIndex({
    clients,
    filters,
}: {
    clients: Paginated<Client>;
    filters: ClientIndexFilters;
}) {
    return (
        <>
            <Head title="Klien" />
            <ClientTable clients={clients} filters={filters} />
        </>
    );
}

ClientIndex.layout = (page: ReactElement) => (
    <BackofficeLayout children={page as ReactNode} />
);
