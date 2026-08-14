import { Head } from '@inertiajs/react';
import type { ReactElement, ReactNode } from 'react';
import BackofficeLayout from '@/layouts/backoffice-layout';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <h1 className="text-xl font-semibold">Dashboard Backoffice</h1>
            <p className="text-sm text-muted-foreground">
                Selamat datang di area backoffice.
            </p>
        </>
    );
}

Dashboard.layout = (page: ReactElement) => (
    <BackofficeLayout children={page as ReactNode} />
);
