import { Head } from '@inertiajs/react';
import type { ReactElement, ReactNode } from 'react';
import FieldLayout from '@/layouts/field-layout';

export default function Today() {
    return (
        <>
            <Head title="Hari Ini" />
            <h1 className="text-lg font-semibold">Hari Ini</h1>
            <p className="text-sm text-muted-foreground">
                Selamat datang di area lapangan.
            </p>
        </>
    );
}

Today.layout = (page: ReactElement) => (
    <FieldLayout children={page as ReactNode} />
);
