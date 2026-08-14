import { Link, router } from '@inertiajs/react';
import {
    ArrowDownIcon,
    ArrowUpDownIcon,
    ArrowUpIcon,
    MapPinIcon,
    PencilIcon,
    PlusIcon,
    Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DeleteSitesDialog } from '@/features/client/components/delete-sites-dialog';
import { DataPagination } from '@/features/client/components/pagination';
import { SiteFormDialog } from '@/features/client/components/site-form-dialog';
import { SiteTableToolbar } from '@/features/client/components/site-table-toolbar';
import type {
    Paginated,
    Site,
    SiteIndexFilters,
    SiteSortColumn,
} from '@/features/client/lib/types';
import { show } from '@/routes/backoffice/clients';
import { show as showSite } from '@/routes/backoffice/sites';

type SiteTableProps = {
    clientId: number;
    sites: Paginated<Site>;
    filters: SiteIndexFilters;
};

export function SiteTable({ clientId, sites, filters }: SiteTableProps) {
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const pageIds = sites.data.map((site) => site.id);
    const allSelected =
        pageIds.length > 0 && pageIds.every((id) => selected.has(id));

    const toggleAll = (checked: boolean) => {
        setSelected(checked ? new Set(pageIds) : new Set());
    };

    const toggleOne = (id: number, checked: boolean) => {
        setSelected((current) => {
            const next = new Set(current);

            if (checked) {
                next.add(id);
            } else {
                next.delete(id);
            }

            return next;
        });
    };

    const sortBy = (column: SiteSortColumn) => {
        const direction =
            filters.sort === column && filters.direction === 'asc'
                ? 'desc'
                : 'asc';

        router.get(
            show.url(clientId),
            { ...filters, sort: column, direction, page: 1 },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-4 px-4">
                <div className="flex items-end-safe justify-between">
                    <div className="">
                        <h2 className="text-lg font-medium">Site</h2>
                        <p className="text-sm text-muted-foreground">
                            Fasilitas yang dimiliki klien ini.
                        </p>
                    </div>
                    <SiteFormDialog
                        clientId={clientId}
                        trigger={
                            <Button>
                                <PlusIcon data-icon="inline-start" />
                                Tambah Site
                            </Button>
                        }
                    />
                </div>
                <SiteTableToolbar clientId={clientId} filters={filters} />
            </div>

            {selected.size > 0 && (
                <div className="px-4">
                    <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-4 py-2">
                        <span className="text-sm">{selected.size} dipilih</span>
                        <div className="ml-auto flex items-center gap-2">
                            <DeleteSitesDialog
                                siteIds={Array.from(selected)}
                                trigger={
                                    <Button variant="destructive" size="sm">
                                        Hapus
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            {sites.data.length === 0 ? (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <MapPinIcon />
                        </EmptyMedia>
                        <EmptyTitle>Belum ada Site</EmptyTitle>
                        <EmptyDescription>
                            Tambahkan fasilitas pertama untuk klien ini.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : (
                <div className="w-full overflow-x-auto">
                    <Table className="border-y">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-7">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={(checked) =>
                                            toggleAll(checked === true)
                                        }
                                        aria-label="Pilih semua"
                                    />
                                </TableHead>
                                <TableHead>
                                    <SortButton
                                        column="name"
                                        label="Nama"
                                        filters={filters}
                                        onSort={sortBy}
                                    />
                                </TableHead>
                                <TableHead>Alamat</TableHead>
                                <TableHead>
                                    <SortButton
                                        column="geofence_radius_m"
                                        label="Radius Geofence"
                                        filters={filters}
                                        onSort={sortBy}
                                    />
                                </TableHead>
                                <TableHead className="w-0" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sites.data.map((site) => (
                                <TableRow key={site.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selected.has(site.id)}
                                            onCheckedChange={(checked) =>
                                                toggleOne(
                                                    site.id,
                                                    checked === true,
                                                )
                                            }
                                            aria-label={`Pilih ${site.name}`}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <Link
                                            href={showSite.url(site.id)}
                                            className="hover:underline"
                                        >
                                            {site.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{site.address ?? '—'}</TableCell>
                                    <TableCell>
                                        {site.geofence_radius_m} m
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <SiteFormDialog
                                                clientId={clientId}
                                                site={site}
                                                trigger={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <PencilIcon />
                                                    </Button>
                                                }
                                            />
                                            <DeleteSitesDialog
                                                siteIds={[site.id]}
                                                trigger={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Trash2Icon />
                                                    </Button>
                                                }
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <DataPagination links={sites.links} />
                </div>
            )}
        </div>
    );
}

type SortButtonProps = {
    column: SiteSortColumn;
    label: string;
    filters: SiteIndexFilters;
    onSort: (column: SiteSortColumn) => void;
};

function SortButton({ column, label, filters, onSort }: SortButtonProps) {
    const isActive = filters.sort === column;
    const Icon = !isActive
        ? ArrowUpDownIcon
        : filters.direction === 'asc'
          ? ArrowUpIcon
          : ArrowDownIcon;

    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-3"
            onClick={() => onSort(column)}
        >
            {label}
            <Icon data-icon="inline-end" />
        </Button>
    );
}
