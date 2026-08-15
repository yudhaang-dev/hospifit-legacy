import { useForm } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import type { FormEventHandler, ReactNode } from 'react';
import { useState } from 'react';
import { store } from '@/actions/App/Http/Controllers/Backoffice/AssetController';
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
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
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
import type { LocationPickerValue } from '@/features/asset/components/location-picker';
import { LocationPicker } from '@/features/asset/components/location-picker';
import type { AssetType } from '@/features/asset/lib/types';

const NO_TYPE_VALUE = 'none';

const EMPTY_LOCATION: LocationPickerValue = {
    clientId: null,
    siteId: null,
    locationId: null,
};

type CreateAssetDialogProps = {
    assetTypes: AssetType[];
    trigger: ReactNode;
};

/**
 * Creates an Asset from the global list — unlike `AssetFormDialog` (which
 * only ever creates under a Location already fixed by the page it's on),
 * this dialog first resolves a `location_id` via the cascading
 * `LocationPicker`, then submits to the exact same
 * `locations/{location}/assets` endpoint ticket 04 already built. The rest
 * of the field set (name/type/serial/interval/instructions) is gated behind
 * a Location being chosen.
 */
export function CreateAssetDialog({
    assetTypes,
    trigger,
}: CreateAssetDialogProps) {
    const [open, setOpen] = useState(false);
    const [location, setLocation] =
        useState<LocationPickerValue>(EMPTY_LOCATION);
    const { data, setData, post, processing, errors, reset, transform } =
        useForm({
            name: '',
            asset_type_id: NO_TYPE_VALUE,
            serial_number: '',
            maintenance_interval_days: '',
            instructions_override: '',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (location.locationId === null) {
            return;
        }

        transform((data) => ({
            ...data,
            asset_type_id:
                data.asset_type_id === NO_TYPE_VALUE
                    ? null
                    : data.asset_type_id,
        }));

        post(store.url(location.locationId), {
            onSuccess: () => {
                setOpen(false);
                setLocation(EMPTY_LOCATION);
                reset();
            },
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);

                if (!next) {
                    setLocation(EMPTY_LOCATION);
                    reset();
                }
            }}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tambah Aset</DialogTitle>
                    <DialogDescription>
                        Pilih Klien → Site → Lokasi tempat aset ini terdaftar —
                        barcode akan dibuat otomatis.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <FieldGroup>
                        <LocationPicker
                            value={location}
                            onChange={setLocation}
                            idPrefix="create-asset-location"
                        />

                        {location.locationId !== null && (
                            <>
                                <FieldSeparator />
                                <Field data-invalid={!!errors.name}>
                                    <FieldLabel htmlFor="create-asset-name">
                                        Nama
                                    </FieldLabel>
                                    <Input
                                        id="create-asset-name"
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
                                    <FieldLabel htmlFor="create-asset-type">
                                        Tipe Aset
                                    </FieldLabel>
                                    <Select
                                        value={data.asset_type_id}
                                        onValueChange={(value) =>
                                            setData('asset_type_id', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="create-asset-type"
                                            aria-invalid={
                                                !!errors.asset_type_id
                                            }
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem
                                                    value={NO_TYPE_VALUE}
                                                >
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
                                        <FieldError>
                                            {errors.asset_type_id}
                                        </FieldError>
                                    )}
                                </Field>
                                <Field data-invalid={!!errors.serial_number}>
                                    <FieldLabel htmlFor="create-asset-serial">
                                        Nomor Seri
                                    </FieldLabel>
                                    <Input
                                        id="create-asset-serial"
                                        placeholder="Opsional, dari pabrikan"
                                        value={data.serial_number}
                                        aria-invalid={!!errors.serial_number}
                                        onChange={(e) =>
                                            setData(
                                                'serial_number',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.serial_number && (
                                        <FieldError>
                                            {errors.serial_number}
                                        </FieldError>
                                    )}
                                </Field>
                                <Field
                                    data-invalid={
                                        !!errors.maintenance_interval_days
                                    }
                                >
                                    <FieldLabel htmlFor="create-asset-interval">
                                        Interval Perawatan (hari)
                                    </FieldLabel>
                                    <Input
                                        id="create-asset-interval"
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
                                <Field
                                    data-invalid={
                                        !!errors.instructions_override
                                    }
                                >
                                    <FieldLabel htmlFor="create-asset-instructions">
                                        Instruksi
                                    </FieldLabel>
                                    <Textarea
                                        id="create-asset-instructions"
                                        placeholder="Kosongkan untuk mewarisi dari tipe aset"
                                        value={data.instructions_override}
                                        aria-invalid={
                                            !!errors.instructions_override
                                        }
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
                            </>
                        )}
                    </FieldGroup>
                    <DialogFooter className="mt-6">
                        <Button
                            type="submit"
                            disabled={
                                processing || location.locationId === null
                            }
                        >
                            <SaveIcon /> Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
