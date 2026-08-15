import { useForm } from '@inertiajs/react';
import { MailCheckIcon } from 'lucide-react';
import { destroy } from '@/actions/App/Http/Controllers/Identity/AuthenticatedSessionController';
import { store } from '@/actions/App/Http/Controllers/Identity/EmailVerificationNotificationController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function VerifyEmailNotice() {
    const { post, processing } = useForm({});

    const resend = () => {
        post(store.url());
    };

    const logout = () => {
        post(destroy().url);
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MailCheckIcon />
                </div>
                <CardTitle>Verifikasi Email Anda</CardTitle>
                <CardDescription>
                    Terima kasih telah mendaftar! Sebelum memulai, mohon
                    verifikasi alamat email Anda dengan mengklik tautan yang
                    baru saja kami kirimkan. Jika Anda tidak menerima email
                    tersebut, kami dapat mengirimkannya kembali.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <Button
                    type="button"
                    className="w-full"
                    disabled={processing}
                    onClick={resend}
                >
                    Kirim Ulang Email Verifikasi
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={processing}
                    onClick={logout}
                >
                    Keluar
                </Button>
            </CardContent>
        </Card>
    );
}
