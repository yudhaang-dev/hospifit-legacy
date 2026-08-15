import { Head } from '@inertiajs/react';
import type { ReactElement } from 'react';
import { AssetTypeTable } from '@/features/asset-type/components/asset-type-table';
import type {
    AssetType,
    IndexAssetTypeFilters,
    Paginated,
} from '@/features/asset-type/lib/types';
import BackofficeLayout from '@/layouts/backoffice-layout';

export default function AssetTypeIndex({
    assetTypes,
    filters,
}: {
    assetTypes: Paginated<AssetType>;
    filters: IndexAssetTypeFilters;
}) {
    return (
        <>
            <Head title="Tipe Aset" />
            <AssetTypeTable assetTypes={assetTypes} filters={filters} />
        </>
    );
}

AssetTypeIndex.layout = (page: ReactElement) => (
    <BackofficeLayout breadcrumbs={[{ label: 'Jenis Aset' }]}>
        {page}
    </BackofficeLayout>
);
