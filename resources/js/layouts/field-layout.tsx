import { router } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/Identity/AuthenticatedSessionController';
import { Button } from '@/components/ui/button';

/**
 * Mobile-first, minimal-tap shell for the field/* area (Field Staff).
 */
export default function FieldLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="flex items-center justify-between border-b px-4 py-3">
                <p className="text-base font-semibold">Hospifit</p>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.post(destroy().url)}
                >
                    Keluar
                </Button>
            </header>
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}
