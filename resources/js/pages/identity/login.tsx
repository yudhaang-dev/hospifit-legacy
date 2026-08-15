import { LoginForm } from '@/features/identity/components/login-form';
import { AuthLayout } from '@/layouts/auth-layout';

export default function Login() {
    return (
        <AuthLayout title="Masuk">
            <LoginForm />
        </AuthLayout>
    );
}
