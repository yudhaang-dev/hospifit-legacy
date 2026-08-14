import { router } from '@inertiajs/react';
import type { MouseEvent, ReactNode } from 'react';
import { useState } from 'react';
import {
    bulkDestroy,
    destroy,
} from '@/actions/App/Http/Controllers/Backoffice/ClientController';
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

type DeleteClientsDialogProps = {
    clientIds: number[];
    trigger: ReactNode;
};

export function DeleteClientsDialog({
    clientIds,
    trigger,
}: DeleteClientsDialogProps) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const confirmDelete = (event: MouseEvent<HTMLButtonElement>) => {
        // AlertDialogAction closes the dialog by default on click — prevent
        // that so it stays open (with the button disabled) until the
        // request finishes.
        event.preventDefault();
        setProcessing(true);

        const options = {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setOpen(false);
            },
        };

        if (clientIds.length === 1) {
            router.delete(destroy.url(clientIds[0]), options);
        } else {
            router.delete(bulkDestroy.url(), {
                ...options,
                data: { ids: clientIds },
            });
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {clientIds.length === 1
                            ? 'Hapus klien ini?'
                            : `Hapus ${clientIds.length} klien terpilih?`}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Klien yang masih memiliki Site atau Pengguna tidak akan
                        dihapus. Tindakan ini tidak dapat dibatalkan.
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
