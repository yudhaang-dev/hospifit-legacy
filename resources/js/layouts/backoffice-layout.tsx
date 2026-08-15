import { Link, router, usePage } from '@inertiajs/react';
import { Bell, ChevronsUpDown, LogOut, ShieldIcon } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/Identity/AuthenticatedSessionController';
import { index as securitySettings } from '@/actions/App/Http/Controllers/Identity/SecuritySettingsController';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import BackofficeBreadcrumb from '@/layouts/backoffice-breadcrumb';
import type { BackofficeBreadcrumbItem } from '@/layouts/backoffice-breadcrumb';
import { backofficeNavItems } from '@/layouts/backoffice-nav';
import type { Auth } from '@/types/auth';

/**
 * Desktop-dashboard shell for the backoffice/* area (Admin/Manager, Office
 * Staff). Collapsible sidebar (icon-only on desktop toggle, offcanvas sheet
 * on mobile) with grouped nav, user menu + logout in the footer, and a
 * header carrying a collapsible breadcrumb + notifications.
 */
export default function BackofficeLayout({
    breadcrumbs,
    children,
}: PropsWithChildren<{ breadcrumbs: BackofficeBreadcrumbItem[] }>) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const initials = (auth?.user?.name ?? 'H')
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                className="cursor-default hover:bg-transparent active:bg-transparent"
                            >
                                <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
                                    H
                                </div>
                                <div className="grid flex-1 text-left leading-tight">
                                    <span className="truncate text-sm font-semibold">
                                        Hospifit
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Backoffice
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Menu</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {backofficeNavItems.map((item) =>
                                    item.disabled ? (
                                        <SidebarMenuItem key={item.label}>
                                            <SidebarMenuButton
                                                tooltip={`${item.label} (segera hadir)`}
                                                disabled
                                            >
                                                <item.icon />
                                                <span>{item.label}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ) : (
                                        <SidebarMenuItem key={item.label}>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.label}
                                            >
                                                <Link href={item.href}>
                                                    <item.icon />
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ),
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton size="lg">
                                <Avatar className="size-6 rounded-md">
                                    <AvatarFallback className="rounded-md text-xs">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="truncate">
                                    {auth?.user?.name}
                                </span>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" className="w-56">
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
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="flex items-center justify-between gap-2 border-b px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2 overflow-hidden">
                        <SidebarTrigger className="shrink-0" />
                        <BackofficeBreadcrumb items={breadcrumbs} />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="shrink-0"
                            >
                                <Bell />
                                <span className="sr-only">Notifikasi</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Empty className="border-none p-4">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <Bell />
                                    </EmptyMedia>
                                    <EmptyTitle>
                                        Belum ada notifikasi
                                    </EmptyTitle>
                                    <EmptyDescription>
                                        Notifikasi akan muncul di sini.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                {/* No padding here on purpose — pages manage their own
                (see ClientTable/SiteTable's own py-4/px-4), so a full-bleed
                content-header banner (border-b bg-secondary) can still run
                edge-to-edge. */}
                <main className="flex-1">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
