import { Link, router, usePage } from '@inertiajs/react';
import { ChevronsUpDown, LogOut, ShieldIcon } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/Identity/AuthenticatedSessionController';
import { index as securitySettings } from '@/actions/App/Http/Controllers/Identity/SecuritySettingsController';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Auth } from '@/types/auth';

/**
 * Mobile-first, minimal-tap shell for the field/* area (Field Staff).
 */
export default function FieldLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const initials = (auth?.user?.name ?? 'H')
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="flex min-h-screen flex-col">
            <header className="flex items-center justify-between border-b px-4 py-3">
                <p className="text-base font-semibold">Hospifit</p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <Avatar className="size-6">
                                <AvatarFallback className="text-xs">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <ChevronsUpDown className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem asChild>
                            <Link href={securitySettings.url()}>
                                <ShieldIcon />
                                Pengaturan Keamanan
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.post(destroy().url)}
                        >
                            <LogOut />
                            Keluar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}
