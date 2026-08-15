import { router } from '@inertiajs/react';
import type { MouseEvent, ReactNode } from 'react';
import { useState } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/Backoffice/AssetController';
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

type DeleteAssetDialogProps = {
    assetId: number;
    trigger: ReactNode;
};

export function DeleteAssetDialog({
    assetId,
    trigger,
}: DeleteAssetDialogProps) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const confirmDelete = (event: MouseEvent<HTMLButtonElement>) => {
        // AlertDialogAction closes the dialog by default on click — prevent
        // that so it stays open (with the button disabled) until the
        // request finishes.
        event.preventDefault();
        setProcessing(true);

        router.delete(destroy.url(assetId), {
            preserveScroll: true,
            onFinish: () => {
                setProcessing(false);
                setOpen(false);
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus aset ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan.
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
