import { router } from '@inertiajs/react';
import {
    ArrowDownIcon,
    ArrowUpDownIcon,
    ArrowUpIcon,
    PencilIcon,
    PlusIcon,
    Trash2Icon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AssetTypeFormDialog } from '@/features/asset-type/components/asset-type-form-dialog';
import { DeleteAssetTypesDialog } from '@/features/asset-type/components/delete-asset-types-dialog';
import { DataPagination } from '@/features/asset-type/components/pagination';
import type {
    AssetType,
    AssetTypeSortColumn,
    IndexAssetTypeFilters,
    Paginated,
} from '@/features/asset-type/lib/types';
import { index } from '@/routes/backoffice/asset-types';

const PER_PAGE_OPTIONS = [10, 15, 25, 50] as const;

type AssetTypeTableProps = {
    assetTypes: Paginated<AssetType>;
    filters: IndexAssetTypeFilters;
};

export function AssetTypeTable({ assetTypes, filters }: AssetTypeTableProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const isFirstRender = useRef(true);

    const pageIds = assetTypes.data.map((assetType) => assetType.id);
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

    // Debounced live search — no query/debounce library, matching the
    // project's deliberate "no client-state/query library" stance.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                index.url(),
                { ...filters, search: search || undefined, page: 1 },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const setPerPage = (value: string) => {
        router.get(
            index.url(),
            { ...filters, per_page: Number(value), page: 1 },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const sortBy = (column: AssetTypeSortColumn) => {
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

    return (
        <div className="flex w-full flex-col gap-4 py-4">
            <div className="flex flex-col gap-4 px-4">
                <div className="flex items-end-safe justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Tipe Aset</h1>
                        <p className="text-sm text-muted-foreground">
                            Kategori aset yang dapat dipakai ulang beserta nilai
                            defaultnya.
                        </p>
                    </div>
                    <AssetTypeFormDialog
                        trigger={
                            <Button>
                                <PlusIcon data-icon="inline-start" />
                                Tambah Tipe Aset
                            </Button>
                        }
                    />
                </div>
                <div className="flex items-center justify-between gap-4">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama tipe aset..."
                        className="max-w-sm"
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Baris
                        </span>
                        <Select
                            value={String(filters.per_page)}
                            onValueChange={setPerPage}
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {PER_PAGE_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option}
                                            value={String(option)}
                                        >
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {selected.size > 0 && (
                <div className="px-4">
                    <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-4 py-2">
                        <span className="text-sm">{selected.size} dipilih</span>
                        <div className="ml-auto flex items-center gap-2">
                            <DeleteAssetTypesDialog
                                assetTypeIds={Array.from(selected)}
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

            {assetTypes.data.length === 0 ? (
                <div className="px-4">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PlusIcon />
                            </EmptyMedia>
                            <EmptyTitle>Belum ada Tipe Aset</EmptyTitle>
                            <EmptyDescription>
                                Definisikan kategori aset untuk berbagi nilai
                                default antar aset.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            ) : (
                <>
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
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="-ml-3"
                                            onClick={() => sortBy('name')}
                                        >
                                            Nama
                                            {filters.sort === 'name' ? (
                                                filters.direction === 'asc' ? (
                                                    <ArrowUpIcon data-icon="inline-end" />
                                                ) : (
                                                    <ArrowDownIcon data-icon="inline-end" />
                                                )
                                            ) : (
                                                <ArrowUpDownIcon data-icon="inline-end" />
                                            )}
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        Interval Perawatan Default
                                    </TableHead>
                                    <TableHead>Instruksi Default</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assetTypes.data.map((assetType) => (
                                    <TableRow key={assetType.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selected.has(
                                                    assetType.id,
                                                )}
                                                onCheckedChange={(checked) =>
                                                    toggleOne(
                                                        assetType.id,
                                                        checked === true,
                                                    )
                                                }
                                                aria-label={`Pilih ${assetType.name}`}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {assetType.name}
                                        </TableCell>
                                        <TableCell>
                                            {assetType.default_maintenance_interval_days
                                                ? `${assetType.default_maintenance_interval_days} hari`
                                                : '—'}
                                        </TableCell>
                                        <TableCell className="max-w-sm truncate">
                                            {assetType.default_instructions ??
                                                '—'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <AssetTypeFormDialog
                                                    assetType={assetType}
                                                    trigger={
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <PencilIcon />
                                                        </Button>
                                                    }
                                                />
                                                <DeleteAssetTypesDialog
                                                    assetTypeIds={[
                                                        assetType.id,
                                                    ]}
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

                    <DataPagination links={assetTypes.links} />
                </>
            )}
        </div>
    );
}
