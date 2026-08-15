import { Head } from '@inertiajs/react';
import type { ReactElement } from 'react';
import BackofficeLayout from '@/layouts/backoffice-layout';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-2 p-6">
                <h1 className="text-xl font-semibold">Dashboard Backoffice</h1>
                <p className="text-sm text-muted-foreground">
                    Selamat datang di area backoffice.
                </p>
            </div>
        </>
    );
}

Dashboard.layout = (page: ReactElement) => (
    <BackofficeLayout breadcrumbs={[{ label: 'Dashboard' }]}>
        {page}
    </BackofficeLayout>
);
