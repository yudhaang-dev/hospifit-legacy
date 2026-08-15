import { Link, router } from '@inertiajs/react';
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
import { CreateAssetDialog } from '@/features/asset/components/create-asset-dialog';
import { DeleteAssetDialog } from '@/features/asset/components/delete-asset-dialog';
import type { LocationPickerValue } from '@/features/asset/components/location-picker';
import { LocationPicker } from '@/features/asset/components/location-picker';
import { DataPagination } from '@/features/asset/components/pagination';
import type {
    AssetSortColumn,
    AssetType,
    AssetWithLocationPath,
    GlobalIndexAssetFilters,
    Paginated,
} from '@/features/asset/lib/types';
import { index } from '@/routes/backoffice/assets';
import { show as showClient } from '@/routes/backoffice/clients';
import { show as showLocation } from '@/routes/backoffice/locations';
import { show as showSite } from '@/routes/backoffice/sites';

const PER_PAGE_OPTIONS = [10, 15, 25, 50] as const;

type AssetIndexTableProps = {
    assets: Paginated<AssetWithLocationPath>;
    assetTypes: AssetType[];
    filters: GlobalIndexAssetFilters;
};

export function AssetIndexTable({
    assets,
    assetTypes,
    filters,
}: AssetIndexTableProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const isFirstRender = useRef(true);

    const location: LocationPickerValue = {
        clientId: filters.client_id,
        siteId: filters.site_id,
        locationId: filters.location_id,
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

    const setLocationFilter = (next: LocationPickerValue) => {
        router.get(
            index.url(),
            {
                ...filters,
                client_id: next.clientId ?? undefined,
                site_id: next.siteId ?? undefined,
                location_id: next.locationId ?? undefined,
                page: 1,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const sortBy = (column: AssetSortColumn) => {
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
                        <h1 className="text-xl font-semibold">Aset</h1>
                        <p className="text-sm text-muted-foreground">
                            Seluruh peralatan fisik yang terdaftar, di semua
                            Klien/Site/Lokasi.
                        </p>
                    </div>
                    <CreateAssetDialog
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
                <LocationPicker
                    value={location}
                    onChange={setLocationFilter}
                    idPrefix="asset-filter-location"
                />
            </div>

            {assets.data.length === 0 ? (
                <div className="px-4">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <WrenchIcon />
                            </EmptyMedia>
                            <EmptyTitle>Tidak ada Aset ditemukan</EmptyTitle>
                            <EmptyDescription>
                                Coba ubah pencarian atau filter Klien/Site/
                                Lokasi.
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
                                    <TableHead>Lokasi</TableHead>
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
                                            <TableCell className="text-sm text-muted-foreground">
                                                <Link
                                                    href={showClient.url(
                                                        asset.location.site
                                                            .client.id,
                                                    )}
                                                    className="hover:underline"
                                                >
                                                    {
                                                        asset.location.site
                                                            .client.name
                                                    }
                                                </Link>
                                                {' / '}
                                                <Link
                                                    href={showSite.url(
                                                        asset.location.site.id,
                                                    )}
                                                    className="hover:underline"
                                                >
                                                    {asset.location.site.name}
                                                </Link>
                                                {' / '}
                                                <Link
                                                    href={showLocation.url(
                                                        asset.location.id,
                                                    )}
                                                    className="font-medium text-foreground hover:underline"
                                                >
                                                    {asset.location.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <AssetFormDialog
                                                        locationId={
                                                            asset.location_id
                                                        }
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
