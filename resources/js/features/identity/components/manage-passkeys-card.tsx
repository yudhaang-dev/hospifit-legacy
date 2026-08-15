import { router } from '@inertiajs/react';
import { usePasskeyRegister } from '@laravel/passkeys/react';
import { KeyRoundIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import type { FormEventHandler, MouseEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { destroy } from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyRegistrationController';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { passkeyErrorMessage } from '@/features/identity/lib/passkey-error-message';
import type { Passkey } from '@/features/identity/lib/types';

type ManagePasskeysCardProps = {
    passkeys: Passkey[];
};

function formatDate(value: string | null): string {
    if (!value) {
        return 'Belum pernah digunakan';
    }

    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function RegisterPasskeyDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const { register, isLoading, isSupported } = usePasskeyRegister({
        onSuccess: () => {
            setOpen(false);
            setName('');
            router.reload({ only: ['passkeys'] });
        },
        onError: (error) => {
            toast.error(
                passkeyErrorMessage(
                    error,
                    'Gagal mendaftarkan Passkey. Silakan coba lagi.',
                ),
            );
        },
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        void register(name);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" disabled={!isSupported}>
                    <PlusIcon data-icon="inline-start" />
                    Tambah Passkey
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Passkey</DialogTitle>
                    <DialogDescription>
                        Beri nama perangkat ini agar mudah dikenali, lalu ikuti
                        instruksi browser/perangkat Anda untuk mendaftarkan
                        Passkey (mis. sidik jari, Windows Hello, atau Face ID).
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="passkey-name">
                                Nama Perangkat
                            </FieldLabel>
                            <Input
                                id="passkey-name"
                                autoFocus
                                placeholder="Laptop Kantor"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter className="mt-6">
                        <Button
                            type="submit"
                            disabled={isLoading || name.trim() === ''}
                        >
                            {isLoading ? 'Mendaftarkan...' : 'Daftarkan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeletePasskeyDialog({ passkey }: { passkey: Passkey }) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const confirmDelete = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setProcessing(true);

        router.delete(destroy.url(passkey.id), {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setOpen(false);
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button type="button" variant="ghost" size="icon">
                    <Trash2Icon />
                    <span className="sr-only">Hapus {passkey.name}</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Hapus Passkey &ldquo;{passkey.name}&rdquo;?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Perangkat ini tidak akan bisa lagi dipakai untuk masuk
                        tanpa kata sandi. Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={processing}
                        onClick={confirmDelete}
                    >
                        {processing ? 'Menghapus...' : 'Hapus'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function ManagePasskeysCard({ passkeys }: ManagePasskeysCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Kelola Passkey</CardTitle>
                <CardDescription>
                    Passkey memungkinkan Anda masuk tanpa mengetik kata sandi,
                    menggunakan sidik jari, wajah, atau PIN perangkat.
                </CardDescription>
                <CardAction>
                    <RegisterPasskeyDialog />
                </CardAction>
            </CardHeader>
            <CardContent>
                {passkeys.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <KeyRoundIcon />
                            </EmptyMedia>
                            <EmptyTitle>Belum ada Passkey</EmptyTitle>
                            <EmptyDescription>
                                Tambahkan Passkey untuk masuk lebih cepat pada
                                perangkat ini.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama</TableHead>
                                <TableHead>Terakhir Digunakan</TableHead>
                                <TableHead>Didaftarkan</TableHead>
                                <TableHead className="w-0" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {passkeys.map((passkey) => (
                                <TableRow key={passkey.id}>
                                    <TableCell className="font-medium">
                                        {passkey.name}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(passkey.last_used_at)}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(passkey.created_at)}
                                    </TableCell>
                                    <TableCell>
                                        <DeletePasskeyDialog
                                            passkey={passkey}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
