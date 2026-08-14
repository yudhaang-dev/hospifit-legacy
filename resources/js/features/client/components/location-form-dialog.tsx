import { useForm } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import type { FormEventHandler, ReactNode } from 'react';
import { useState } from 'react';
import {
    store,
    update,
} from '@/actions/App/Http/Controllers/Backoffice/LocationController';
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
import { getDescendantIds } from '@/features/client/lib/location-tree';
import type { LocationNode } from '@/features/client/lib/types';

const NO_PARENT_VALUE = 'none';

type LocationFormDialogProps = {
    siteId: number;
    locations: LocationNode[];
    location?: LocationNode;
    trigger: ReactNode;
};

export function LocationFormDialog({
    siteId,
    locations,
    location,
    trigger,
}: LocationFormDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, put, processing, errors, reset, transform } =
        useForm({
            type: location?.type ?? '',
            name: location?.name ?? '',
            parent_location_id:
                location?.parent_location_id?.toString() ?? NO_PARENT_VALUE,
            maintenance_interval_days:
                location?.maintenance_interval_days?.toString() ?? '',
            latitude: location?.latitude ?? '',
            longitude: location?.longitude ?? '',
            geofence_radius_m: location?.geofence_radius_m?.toString() ?? '',
        });

    // A node can't become its own parent, nor a descendant's — same rule
    // UpdateLocationRequest enforces server-side; excluding them here just
    // avoids the round-trip for the obviously-invalid picks.
    const excludedIds = location
        ? new Set([location.id, ...getDescendantIds(locations, location.id)])
        : new Set<number>();
    const parentOptions = locations.filter((node) => !excludedIds.has(node.id));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            parent_location_id:
                data.parent_location_id === NO_PARENT_VALUE
                    ? null
                    : data.parent_location_id,
        }));

        const options = {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        };

        if (location) {
            put(update.url(location.id), options);
        } else {
            post(store.url(siteId), options);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {location ? 'Ubah Lokasi' : 'Tambah Lokasi'}
                    </DialogTitle>
                    <DialogDescription>
                        {location
                            ? 'Perbarui detail node lokasi ini.'
                            : 'Tambahkan node lokasi baru langsung di bawah Site atau di bawah lokasi lain.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field data-invalid={!!errors.type}>
                                <FieldLabel htmlFor="location-type">
                                    Tipe
                                </FieldLabel>
                                <Input
                                    id="location-type"
                                    placeholder="building, area, room, ..."
                                    value={data.type}
                                    aria-invalid={!!errors.type}
                                    onChange={(e) =>
                                        setData('type', e.target.value)
                                    }
                                />
                                {errors.type && (
                                    <FieldError>{errors.type}</FieldError>
                                )}
                            </Field>
                            <Field data-invalid={!!errors.name}>
                                <FieldLabel htmlFor="location-name">
                                    Nama
                                </FieldLabel>
                                <Input
                                    id="location-name"
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
                        </div>
                        <Field data-invalid={!!errors.parent_location_id}>
                            <FieldLabel htmlFor="location-parent">
                                Induk
                            </FieldLabel>
                            <Select
                                value={data.parent_location_id}
                                onValueChange={(value) =>
                                    setData('parent_location_id', value)
                                }
                            >
                                <SelectTrigger
                                    id="location-parent"
                                    aria-invalid={!!errors.parent_location_id}
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value={NO_PARENT_VALUE}>
                                            Tidak ada (langsung di bawah Site)
                                        </SelectItem>
                                        {parentOptions.map((node) => (
                                            <SelectItem
                                                key={node.id}
                                                value={node.id.toString()}
                                            >
                                                {'—'.repeat(node.depth)}{' '}
                                                {node.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.parent_location_id && (
                                <FieldError>
                                    {errors.parent_location_id}
                                </FieldError>
                            )}
                        </Field>
                        <Field
                            data-invalid={!!errors.maintenance_interval_days}
                        >
                            <FieldLabel htmlFor="location-interval">
                                Interval Perawatan (hari)
                            </FieldLabel>
                            <Input
                                id="location-interval"
                                inputMode="numeric"
                                placeholder="Kosongkan untuk mewarisi dari induk"
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
                        <div className="grid grid-cols-2 gap-4">
                            <Field data-invalid={!!errors.latitude}>
                                <FieldLabel htmlFor="location-latitude">
                                    Latitude
                                </FieldLabel>
                                <Input
                                    id="location-latitude"
                                    inputMode="decimal"
                                    placeholder="Opsional, override Site"
                                    value={data.latitude}
                                    aria-invalid={!!errors.latitude}
                                    onChange={(e) =>
                                        setData('latitude', e.target.value)
                                    }
                                />
                                {errors.latitude && (
                                    <FieldError>{errors.latitude}</FieldError>
                                )}
                            </Field>
                            <Field data-invalid={!!errors.longitude}>
                                <FieldLabel htmlFor="location-longitude">
                                    Longitude
                                </FieldLabel>
                                <Input
                                    id="location-longitude"
                                    inputMode="decimal"
                                    placeholder="Opsional, override Site"
                                    value={data.longitude}
                                    aria-invalid={!!errors.longitude}
                                    onChange={(e) =>
                                        setData('longitude', e.target.value)
                                    }
                                />
                                {errors.longitude && (
                                    <FieldError>{errors.longitude}</FieldError>
                                )}
                            </Field>
                        </div>
                        <Field data-invalid={!!errors.geofence_radius_m}>
                            <FieldLabel htmlFor="location-radius">
                                Radius Geofence (meter)
                            </FieldLabel>
                            <Input
                                id="location-radius"
                                inputMode="numeric"
                                placeholder="Opsional, override Site"
                                value={data.geofence_radius_m}
                                aria-invalid={!!errors.geofence_radius_m}
                                onChange={(e) =>
                                    setData('geofence_radius_m', e.target.value)
                                }
                            />
                            {errors.geofence_radius_m && (
                                <FieldError>
                                    {errors.geofence_radius_m}
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
