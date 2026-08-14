import { router, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/Identity/AuthenticatedSessionController';
import { Button } from '@/components/ui/button';

/**
 * Client-scoped shell for the client portal area (Client Admin/PIC, Client Staff).
 */
export default function PortalLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<{ auth: { user: { name: string } } }>().props;

    return (
        <div className="flex min-h-screen flex-col">
            <header className="flex items-center justify-between border-b px-6 py-3">
                <div>
                    <p className="text-sm font-medium">Portal Klien</p>
                    <p className="text-xs text-muted-foreground">
                        {auth?.user?.name}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.post(destroy().url)}
                >
                    Keluar
                </Button>
            </header>
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
