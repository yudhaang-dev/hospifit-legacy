import { Link, router } from '@inertiajs/react';
import {
    ArrowDownIcon,
    ArrowUpDownIcon,
    ArrowUpIcon,
    PencilIcon,
    PlusIcon,
    Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
import { bulkUpdateStatus } from '@/actions/App/Http/Controllers/Backoffice/ClientController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ClientFormDialog } from '@/features/client/components/client-form-dialog';
import { ClientTableToolbar } from '@/features/client/components/client-table-toolbar';
import { DeleteClientsDialog } from '@/features/client/components/delete-clients-dialog';
import { DataPagination } from '@/features/client/components/pagination';
import type {
    Client,
    ClientIndexFilters,
    ClientSortColumn,
    Paginated,
} from '@/features/client/lib/types';
import { index, show } from '@/routes/backoffice/clients';

type ClientTableProps = {
    clients: Paginated<Client>;
    filters: ClientIndexFilters;
};

export function ClientTable({ clients, filters }: ClientTableProps) {
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const pageIds = clients.data.map((client) => client.id);
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

    const sortBy = (column: ClientSortColumn) => {
        const direction =
            filters.sort === column && filters.direction === 'asc'
                ? 'desc'
                : 'asc';

        router.get(
            index.url(),
            { ...filters, sort: column, direction, page: 1 },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const bulkSetStatus = (status: 'active' | 'inactive') => {
        router.patch(
            bulkUpdateStatus.url(),
            { ids: Array.from(selected), status },
            { preserveScroll: true, onSuccess: () => setSelected(new Set()) },
        );
    };

    return (
        <div className="flex w-full flex-col gap-4 py-4">
            <div className="flex flex-col gap-4 px-4">
                <div className="flex items-end-safe justify-between">
                    <div className="">
                        <h1 className="text-xl font-semibold">Klien</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola organisasi klien dan fasilitasnya.
                        </p>
                    </div>
                    <ClientFormDialog
                        trigger={
                            <Button>
                                <PlusIcon data-icon="inline-start" />
                                Tambah Klien
                            </Button>
                        }
                    />
                </div>
                <ClientTableToolbar filters={filters} />
            </div>

            {selected.size > 0 && (
                <div className="px-4">
                    <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-4 py-2">
                        <span className="text-sm">{selected.size} dipilih</span>
                        <div className="ml-auto flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => bulkSetStatus('active')}
                            >
                                Aktifkan
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => bulkSetStatus('inactive')}
                            >
                                Nonaktifkan
                            </Button>
                            <DeleteClientsDialog
                                clientIds={Array.from(selected)}
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
                            <TableHead>
                                <SortButton
                                    column="status"
                                    label="Status"
                                    filters={filters}
                                    onSort={sortBy}
                                />
                            </TableHead>
                            <TableHead className="w-0" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.data.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selected.has(client.id)}
                                        onCheckedChange={(checked) =>
                                            toggleOne(
                                                client.id,
                                                checked === true,
                                            )
                                        }
                                        aria-label={`Pilih ${client.name}`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Link
                                        href={show.url(client.id)}
                                        className="font-medium hover:underline"
                                    >
                                        {client.name}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            client.status === 'active'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {client.status === 'active'
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-2">
                                        <ClientFormDialog
                                            client={client}
                                            trigger={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    <PencilIcon />
                                                </Button>
                                            }
                                        />
                                        <DeleteClientsDialog
                                            clientIds={[client.id]}
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
            </div>

            <DataPagination links={clients.links} />
        </div>
    );
}

type SortButtonProps = {
    column: ClientSortColumn;
    label: string;
    filters: ClientIndexFilters;
    onSort: (column: ClientSortColumn) => void;
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
