import { Head } from '@inertiajs/react';
import type { ReactElement, ReactNode } from 'react';
import { ClientTable } from '@/features/client/components/client-table';
import type { Client } from '@/features/client/lib/types';
import BackofficeLayout from '@/layouts/backoffice-layout';

export default function ClientIndex({ clients }: { clients: Client[] }) {
    return (
        <>
            <Head title="Klien" />
            <h1 className="text-xl font-semibold">Klien</h1>
            <p className="text-sm text-muted-foreground">
                Kelola organisasi klien dan fasilitasnya.
            </p>
            <div className="mt-6">
                <ClientTable clients={clients} />
            </div>
        </>
    );
}

ClientIndex.layout = (page: ReactElement) => (
    <BackofficeLayout children={page as ReactNode} />
);
