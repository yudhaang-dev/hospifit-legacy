import { Head } from '@inertiajs/react';
import { LoginForm } from '@/features/identity/components/login-form';

export default function Login() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Head title="Masuk" />
            <LoginForm />
        </div>
    );
}
