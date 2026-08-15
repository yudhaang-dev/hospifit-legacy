import { useForm } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import type { FormEventHandler, ReactNode } from 'react';
import { useState } from 'react';
import {
    store,
    update,
} from '@/actions/App/Http/Controllers/Backoffice/AssetController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Asset, AssetType } from '@/features/asset/lib/types';

const NO_TYPE_VALUE = 'none';

type AssetFormDialogProps = {
    locationId: number;
    assetTypes: AssetType[];
    asset?: Asset;
    trigger: ReactNode;
};

export function AssetFormDialog({
    locationId,
    assetTypes,
    asset,
    trigger,
}: AssetFormDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, put, processing, errors, reset, transform } =
        useForm({
            name: asset?.name ?? '',
            asset_type_id: asset?.asset_type_id?.toString() ?? NO_TYPE_VALUE,
            serial_number: asset?.serial_number ?? '',
            maintenance_interval_days:
                asset?.maintenance_interval_days?.toString() ?? '',
            instructions_override: asset?.instructions_override ?? '',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            asset_type_id:
                data.asset_type_id === NO_TYPE_VALUE
                    ? null
                    : data.asset_type_id,
        }));

        const options = {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        };

        if (asset) {
            put(update.url(asset.id), options);
        } else {
            post(store.url(locationId), options);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {asset ? 'Ubah Aset' : 'Tambah Aset'}
                    </DialogTitle>
                    <DialogDescription>
                        {asset
                            ? 'Perbarui detail aset ini.'
                            : 'Daftarkan aset baru di lokasi ini — barcode akan dibuat otomatis.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <FieldGroup>
                        {asset && (
                            <Field>
                                <FieldLabel htmlFor="asset-barcode">
                                    Barcode
                                </FieldLabel>
                                <Input
                                    id="asset-barcode"
                                    value={asset.barcode}
                                    readOnly
                                    disabled
                                />
                                <FieldDescription>
                                    Dibuat otomatis oleh sistem, tidak dapat
                                    diubah.
                                </FieldDescription>
                            </Field>
                        )}
                        <Field data-invalid={!!errors.name}>
                            <FieldLabel htmlFor="asset-name">Nama</FieldLabel>
                            <Input
                                id="asset-name"
                                value={data.name}
                                aria-invalid={!!errors.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            {errors.name && (
                                <FieldError>{errors.name}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!errors.asset_type_id}>
                            <FieldLabel htmlFor="asset-type">
                                Tipe Aset
                            </FieldLabel>
                            <Select
                                value={data.asset_type_id}
                                onValueChange={(value) =>
                                    setData('asset_type_id', value)
                                }
                            >
                                <SelectTrigger
                                    id="asset-type"
                                    aria-invalid={!!errors.asset_type_id}
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value={NO_TYPE_VALUE}>
                                            Tidak ada
                                        </SelectItem>
                                        {assetTypes.map((assetType) => (
                                            <SelectItem
                                                key={assetType.id}
                                                value={assetType.id.toString()}
                                            >
                                                {assetType.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.asset_type_id && (
                                <FieldError>{errors.asset_type_id}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!errors.serial_number}>
                            <FieldLabel htmlFor="asset-serial">
                                Nomor Seri
                            </FieldLabel>
                            <Input
                                id="asset-serial"
                                placeholder="Opsional, dari pabrikan"
                                value={data.serial_number}
                                aria-invalid={!!errors.serial_number}
                                onChange={(e) =>
                                    setData('serial_number', e.target.value)
                                }
                            />
                            {errors.serial_number && (
                                <FieldError>{errors.serial_number}</FieldError>
                            )}
                        </Field>
                        <Field
                            data-invalid={!!errors.maintenance_interval_days}
                        >
                            <FieldLabel htmlFor="asset-interval">
                                Interval Perawatan (hari)
                            </FieldLabel>
                            <Input
                                id="asset-interval"
                                inputMode="numeric"
                                placeholder="Kosongkan untuk mewarisi dari tipe/lokasi"
                                value={data.maintenance_interval_days}
                                aria-invalid={
                                    !!errors.maintenance_interval_days
                                }
                                onChange={(e) =>
                                    setData(
                                        'maintenance_interval_days',
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.maintenance_interval_days && (
                                <FieldError>
                                    {errors.maintenance_interval_days}
                                </FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!errors.instructions_override}>
                            <FieldLabel htmlFor="asset-instructions">
                                Instruksi
                            </FieldLabel>
                            <Textarea
                                id="asset-instructions"
                                placeholder="Kosongkan untuk mewarisi dari tipe aset"
                                value={data.instructions_override}
                                aria-invalid={!!errors.instructions_override}
                                onChange={(e) =>
                                    setData(
                                        'instructions_override',
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.instructions_override && (
                                <FieldError>
                                    {errors.instructions_override}
                                </FieldError>
                            )}
                        </Field>
                    </FieldGroup>
                    <DialogFooter className="mt-6">
                        <Button type="submit" disabled={processing}>
                            <SaveIcon /> Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
