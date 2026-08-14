import { Head } from '@inertiajs/react';
import type { ReactElement, ReactNode } from 'react';
import PortalLayout from '@/layouts/portal-layout';

type Client = {
    id: number;
    name: string;
};

export default function Dashboard({ clients }: { clients: Client[] }) {
    return (
        <>
            <Head title="Dashboard" />
            <h1 className="text-xl font-semibold">Dashboard Klien</h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Organisasi Anda:
            </p>
            <ul className="mt-1 list-inside list-disc text-sm">
                {clients.map((client) => (
                    <li key={client.id}>{client.name}</li>
                ))}
            </ul>
        </>
    );
}

Dashboard.layout = (page: ReactElement) => (
    <PortalLayout children={page as ReactNode} />
);
