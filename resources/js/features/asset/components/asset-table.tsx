import { router } from '@inertiajs/react';
import {
    ArrowDownIcon,
    ArrowUpDownIcon,
    ArrowUpIcon,
    PencilIcon,
    PlusIcon,
    Trash2Icon,
    WrenchIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { AssetFormDialog } from '@/features/asset/components/asset-form-dialog';
import { DeleteAssetDialog } from '@/features/asset/components/delete-asset-dialog';
import { DataPagination } from '@/features/asset/components/pagination';
import type {
    Asset,
    AssetSortColumn,
    AssetType,
    IndexAssetFilters,
    Paginated,
} from '@/features/asset/lib/types';
import { show as showLocation } from '@/routes/backoffice/locations';

const PER_PAGE_OPTIONS = [10, 15, 25, 50] as const;

type AssetTableProps = {
    locationId: number;
    assets: Paginated<Asset>;
    assetTypes: AssetType[];
    filters: IndexAssetFilters;
};

export function AssetTable({
    locationId,
    assets,
    assetTypes,
    filters,
}: AssetTableProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const isFirstRender = useRef(true);

    // Debounced live search — no query/debounce library, matching the
    // project's deliberate "no client-state/query library" stance.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                showLocation.url(locationId),
                { ...filters, search: search || undefined, page: 1 },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }, 300);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const setPerPage = (value: string) => {
        router.get(
            showLocation.url(locationId),
            { ...filters, per_page: Number(value), page: 1 },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const sortBy = (column: AssetSortColumn) => {
        const direction =
            filters.sort === column && filters.direction === 'asc'
                ? 'desc'
                : 'asc';

        router.get(
            showLocation.url(locationId),
            { ...filters, sort: column, direction, page: 1 },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <div className="flex w-full flex-col gap-4 py-4">
            <div className="flex flex-col gap-4 px-4">
                <div className="flex items-end-safe justify-between">
                    <div>
                        <h2 className="text-lg font-medium">Aset</h2>
                        <p className="text-sm text-muted-foreground">
                            Peralatan fisik yang terdaftar langsung di lokasi
                            ini.
                        </p>
                    </div>
                    <AssetFormDialog
                        locationId={locationId}
                        assetTypes={assetTypes}
                        trigger={
                            <Button>
                                <PlusIcon data-icon="inline-start" />
                                Tambah Aset
                            </Button>
                        }
                    />
                </div>
                <div className="flex items-center justify-between gap-4">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama, barcode, atau nomor seri..."
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

            {assets.data.length === 0 ? (
                <div className="px-4">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <WrenchIcon />
                            </EmptyMedia>
                            <EmptyTitle>Belum ada Aset</EmptyTitle>
                            <EmptyDescription>
                                Daftarkan peralatan fisik yang ada di lokasi
                                ini.
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
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="-ml-3"
                                            onClick={() => sortBy('barcode')}
                                        >
                                            Barcode
                                            {filters.sort === 'barcode' ? (
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
                                    <TableHead>Nomor Seri</TableHead>
                                    <TableHead className="w-0" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assets.data.map((asset) => {
                                    const assetType = assetTypes.find(
                                        (type) =>
                                            type.id === asset.asset_type_id,
                                    );

                                    return (
                                        <TableRow key={asset.id}>
                                            <TableCell className="font-medium">
                                                {asset.name}
                                            </TableCell>
                                            <TableCell>
                                                {assetType ? (
                                                    <Badge variant="secondary">
                                                        {assetType.name}
                                                    </Badge>
                                                ) : (
                                                    '—'
                                                )}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {asset.barcode}
                                            </TableCell>
                                            <TableCell>
                                                {asset.serial_number ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <AssetFormDialog
                                                        locationId={locationId}
                                                        assetTypes={assetTypes}
                                                        asset={asset}
                                                        trigger={
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <PencilIcon />
                                                            </Button>
                                                        }
                                                    />
                                                    <DeleteAssetDialog
                                                        assetId={asset.id}
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
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <DataPagination links={assets.links} />
                </>
            )}
        </div>
    );
}
