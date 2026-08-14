import { useForm } from '@inertiajs/react';
import type { FormEventHandler, ReactNode } from 'react';
import { useState } from 'react';
import {
    store,
    update,
} from '@/actions/App/Http/Controllers/Backoffice/SiteController';
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
import type { Site } from '@/features/client/lib/types';

type SiteFormDialogProps = {
    clientId: number;
    site?: Site;
    trigger: ReactNode;
};

export function SiteFormDialog({
    clientId,
    site,
    trigger,
}: SiteFormDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: site?.name ?? '',
        address: site?.address ?? '',
        latitude: site?.latitude ?? '',
        longitude: site?.longitude ?? '',
        geofence_radius_m: site?.geofence_radius_m?.toString() ?? '100',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        };

        if (site) {
            put(update.url(site.id), options);
        } else {
            post(store.url(clientId), options);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {site ? 'Ubah Site' : 'Tambah Site'}
                    </DialogTitle>
                    <DialogDescription>
                        {site
                            ? 'Perbarui detail fasilitas klien.'
                            : 'Daftarkan fasilitas baru untuk klien ini.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <FieldGroup>
                        <Field data-invalid={!!errors.name}>
                            <FieldLabel htmlFor="site-name">Nama</FieldLabel>
                            <Input
                                id="site-name"
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
                        <Field data-invalid={!!errors.address}>
                            <FieldLabel htmlFor="site-address">
                                Alamat
                            </FieldLabel>
                            <Input
                                id="site-address"
                                value={data.address}
                                aria-invalid={!!errors.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                            />
                            {errors.address && (
                                <FieldError>{errors.address}</FieldError>
                            )}
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field data-invalid={!!errors.latitude}>
                                <FieldLabel htmlFor="site-latitude">
                                    Latitude
                                </FieldLabel>
                                <Input
                                    id="site-latitude"
                                    inputMode="decimal"
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
                                <FieldLabel htmlFor="site-longitude">
                                    Longitude
                                </FieldLabel>
                                <Input
                                    id="site-longitude"
                                    inputMode="decimal"
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
                            <FieldLabel htmlFor="site-radius">
                                Radius Geofence (meter)
                            </FieldLabel>
                            <Input
                                id="site-radius"
                                inputMode="numeric"
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
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
