import { ResetPasswordForm } from '@/features/identity/components/reset-password-form';
import { AuthLayout } from '@/layouts/auth-layout';

type ResetPasswordProps = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    return (
        <AuthLayout title="Reset Kata Sandi">
            <ResetPasswordForm token={token} email={email} />
        </AuthLayout>
    );
}
