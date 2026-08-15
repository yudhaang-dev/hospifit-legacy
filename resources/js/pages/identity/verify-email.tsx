import { VerifyEmailNotice } from '@/features/identity/components/verify-email-notice';
import { AuthLayout } from '@/layouts/auth-layout';

export default function VerifyEmail() {
    return (
        <AuthLayout title="Verifikasi Email">
            <VerifyEmailNotice />
        </AuthLayout>
    );
}
