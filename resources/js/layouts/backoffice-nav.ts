import {
    Building2,
    ClipboardList,
    FileText,
    LayoutDashboard,
    UsersRound,
    Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { dashboard } from '@/routes/backoffice';
import { index as clientsIndex } from '@/routes/backoffice/clients';

export type BackofficeNavItem = {
    label: string;
    icon: LucideIcon;
    href: string;
    disabled?: boolean;
};

/**
 * Sidebar nav for the backoffice/* area. Aset/Kontrak/Work Order/Pengguna
 * are shown disabled ahead of their routes existing, per the PRD's
 * Admin/Manager scope (docs/PRD.md §4/§5) — they signal what's coming
 * without being clickable dead ends.
 */
export const backofficeNavItems: BackofficeNavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, href: dashboard.url() },
    { label: 'Klien', icon: Building2, href: clientsIndex.url() },
    { label: 'Aset', icon: Wrench, href: '#', disabled: true },
    { label: 'Kontrak', icon: FileText, href: '#', disabled: true },
    { label: 'Work Order', icon: ClipboardList, href: '#', disabled: true },
    { label: 'Pengguna', icon: UsersRound, href: '#', disabled: true },
];
