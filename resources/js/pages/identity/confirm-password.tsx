import { ConfirmPasswordForm } from '@/features/identity/components/confirm-password-form';
import { AuthLayout } from '@/layouts/auth-layout';

export default function ConfirmPassword() {
    return (
        <AuthLayout title="Konfirmasi Kata Sandi">
            <ConfirmPasswordForm />
        </AuthLayout>
    );
}
