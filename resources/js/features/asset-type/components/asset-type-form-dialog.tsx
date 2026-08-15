import { useForm } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import type { FormEventHandler, ReactNode } from 'react';
import { useState } from 'react';
import {
    store,
    update,
} from '@/actions/App/Http/Controllers/Backoffice/AssetTypeController';
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
import { Textarea } from '@/components/ui/textarea';
import type { AssetType } from '@/features/asset-type/lib/types';

type AssetTypeFormDialogProps = {
    assetType?: AssetType;
    trigger: ReactNode;
};

export function AssetTypeFormDialog({
    assetType,
    trigger,
}: AssetTypeFormDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: assetType?.name ?? '',
        default_maintenance_interval_days:
            assetType?.default_maintenance_interval_days?.toString() ?? '',
        default_instructions: assetType?.default_instructions ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        };

        if (assetType) {
            put(update.url(assetType.id), options);
        } else {
            post(store.url(), options);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {assetType ? 'Ubah Tipe Aset' : 'Tambah Tipe Aset'}
                    </DialogTitle>
                    <DialogDescription>
                        {assetType
                            ? 'Perbarui detail kategori aset ini.'
                            : 'Definisikan kategori aset baru beserta nilai defaultnya.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <FieldGroup>
                        <Field data-invalid={!!errors.name}>
                            <FieldLabel htmlFor="asset-type-name">
                                Nama
                            </FieldLabel>
                            <Input
                                id="asset-type-name"
                                placeholder="AC Split, Genset, ..."
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
                        <Field
                            data-invalid={
                                !!errors.default_maintenance_interval_days
                            }
                        >
                            <FieldLabel htmlFor="asset-type-interval">
                                Interval Perawatan Default (hari)
                            </FieldLabel>
                            <Input
                                id="asset-type-interval"
                                inputMode="numeric"
                                placeholder="Opsional"
                                value={data.default_maintenance_interval_days}
                                aria-invalid={
                                    !!errors.default_maintenance_interval_days
                                }
                                onChange={(e) =>
                                    setData(
                                        'default_maintenance_interval_days',
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.default_maintenance_interval_days && (
                                <FieldError>
                                    {errors.default_maintenance_interval_days}
                                </FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!errors.default_instructions}>
                            <FieldLabel htmlFor="asset-type-instructions">
                                Instruksi Default
                            </FieldLabel>
                            <Textarea
                                id="asset-type-instructions"
                                placeholder="Opsional"
                                value={data.default_instructions}
                                aria-invalid={!!errors.default_instructions}
                                onChange={(e) =>
                                    setData(
                                        'default_instructions',
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.default_instructions && (
                                <FieldError>
                                    {errors.default_instructions}
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
