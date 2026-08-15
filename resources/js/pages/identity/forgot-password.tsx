import { ForgotPasswordForm } from '@/features/identity/components/forgot-password-form';
import { AuthLayout } from '@/layouts/auth-layout';

export default function ForgotPassword() {
    return (
        <AuthLayout title="Lupa Kata Sandi">
            <ForgotPasswordForm />
        </AuthLayout>
    );
}
