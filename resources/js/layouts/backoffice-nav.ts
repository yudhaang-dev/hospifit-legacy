import {
    Building2,
    ClipboardList,
    FileText,
    LayoutDashboard,
    Tags,
    UsersRound,
    Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { dashboard } from '@/routes/backoffice';
import { index as assetTypesIndex } from '@/routes/backoffice/asset-types';
import { index as assetsIndex } from '@/routes/backoffice/assets';
import { index as clientsIndex } from '@/routes/backoffice/clients';

export type BackofficeNavItem = {
    label: string;
    icon: LucideIcon;
    href: string;
    disabled?: boolean;
};

/**
 * Sidebar nav for the backoffice/* area. Kontrak/Work Order/Pengguna are
 * shown disabled ahead of their routes existing, per the PRD's
 * Admin/Manager scope (docs/PRD.md §4/§5) — they signal what's coming
 * without being clickable dead ends. Two Asset-domain entries: `Jenis Aset`
 * manages the AssetType reference list, `Aset` is the global cross-Location
 * Asset list (search/filter/full CRUD, including create via a Client/Site/
 * Location picker).
 */
export const backofficeNavItems: BackofficeNavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, href: dashboard.url() },
    { label: 'Klien', icon: Building2, href: clientsIndex.url() },
    { label: 'Jenis Aset', icon: Tags, href: assetTypesIndex.url() },
    { label: 'Aset', icon: Wrench, href: assetsIndex.url() },
    { label: 'Kontrak', icon: FileText, href: '#', disabled: true },
    { label: 'Work Order', icon: ClipboardList, href: '#', disabled: true },
    { label: 'Pengguna', icon: UsersRound, href: '#', disabled: true },
];
