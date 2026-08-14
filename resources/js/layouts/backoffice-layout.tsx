import { Link, router } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/Identity/AuthenticatedSessionController';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { index as clientsIndex } from '@/routes/backoffice/clients';

/**
 * Desktop-dashboard shell for the backoffice/* area (Admin/Manager, Office Staff).
 */
export default function BackofficeLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen">
            <aside className="hidden w-56 shrink-0 border-r bg-card p-4 md:block">
                <p className="text-sm font-semibold">Hospifit</p>
                <p className="text-xs text-muted-foreground">Backoffice</p>
                <nav className="mt-6 flex flex-col gap-1">
                    <Link
                        href={clientsIndex.url()}
                        className={cn(
                            'rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground',
                        )}
                    >
                        Klien
                    </Link>
                </nav>
            </aside>
            <div className="flex flex-1 flex-col">
                <header className="flex items-center justify-between border-b px-6 py-3">
                    <p className="text-sm font-medium">Backoffice</p>
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
        </div>
    );
}
