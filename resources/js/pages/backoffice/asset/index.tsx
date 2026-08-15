import { Head } from '@inertiajs/react';
import type { ReactElement } from 'react';
import { AssetIndexTable } from '@/features/asset/components/asset-index-table';
import type {
    AssetType,
    AssetWithLocationPath,
    GlobalIndexAssetFilters,
    Paginated,
} from '@/features/asset/lib/types';
import BackofficeLayout from '@/layouts/backoffice-layout';

export default function AssetIndex({
    assets,
    assetTypes,
    filters,
}: {
    assets: Paginated<AssetWithLocationPath>;
    assetTypes: AssetType[];
    filters: GlobalIndexAssetFilters;
}) {
    return (
        <>
            <Head title="Aset" />
            <AssetIndexTable
                assets={assets}
                assetTypes={assetTypes}
                filters={filters}
            />
        </>
    );
}

AssetIndex.layout = (page: ReactElement) => (
    <BackofficeLayout breadcrumbs={[{ label: 'Aset' }]}>
        {page}
    </BackofficeLayout>
);
