import { Head } from '@inertiajs/react';
import { Building2Icon } from 'lucide-react';
import type { PropsWithChildren } from 'react';

type AuthLayoutProps = PropsWithChildren<{
    title: string;
}>;

/**
 * Shared shell for the guest-facing identity pages (login, forgot password, reset
 * password, verify email) — centers the Hospifit logo lockup and card above a muted
 * background so all four pages stay visually consistent.
 */
export function AuthLayout({ title, children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/30 p-4">
            <Head title={title} />
            <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Building2Icon />
                </div>
                <span className="text-lg font-semibold">Hospifit</span>
            </div>
            {children}
        </div>
    );
}
