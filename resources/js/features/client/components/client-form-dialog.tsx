import { useForm } from '@inertiajs/react';
import type { FormEventHandler, ReactNode } from 'react';
import { useState } from 'react';
import {
    store,
    update,
} from '@/actions/App/Http/Controllers/Backoffice/ClientController';
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
import type { Client } from '@/features/client/lib/types';

type ClientFormDialogProps = {
    client?: Client;
    trigger: ReactNode;
};

export function ClientFormDialog({ client, trigger }: ClientFormDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: client?.name ?? '',
        status: client?.status ?? 'active',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        };

        if (client) {
            put(update.url(client.id), options);
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
                        {client ? 'Ubah Klien' : 'Tambah Klien'}
                    </DialogTitle>
                    <DialogDescription>
                        {client
                            ? 'Perbarui detail organisasi klien.'
                            : 'Daftarkan organisasi klien baru.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <FieldGroup>
                        <Field data-invalid={!!errors.name}>
                            <FieldLabel htmlFor="name">Nama</FieldLabel>
                            <Input
                                id="name"
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
                        <Field data-invalid={!!errors.status}>
                            <FieldLabel htmlFor="status">Status</FieldLabel>
                            <Select
                                value={data.status}
                                onValueChange={(value) =>
                                    setData('status', value as Client['status'])
                                }
                            >
                                <SelectTrigger
                                    id="status"
                                    aria-invalid={!!errors.status}
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="active">
                                            Aktif
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            Nonaktif
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <FieldError>{errors.status}</FieldError>
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
