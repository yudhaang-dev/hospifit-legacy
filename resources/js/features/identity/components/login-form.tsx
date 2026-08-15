import { Link, useForm } from '@inertiajs/react';
import {
    InvalidDomainError,
    NotSupportedError,
    UserCancelledError,
} from '@laravel/passkeys';
import { usePasskeyVerify } from '@laravel/passkeys/react';
import { KeyRoundIcon } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { toast } from 'sonner';
import { store } from '@/actions/App/Http/Controllers/Identity/AuthenticatedSessionController';
import { create as forgotPassword } from '@/actions/App/Http/Controllers/Identity/PasswordResetLinkController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

function passkeyErrorMessage(error: unknown): string {
    if (error instanceof NotSupportedError) {
        return 'Perangkat atau browser Anda tidak mendukung Passkey.';
    }

    if (error instanceof UserCancelledError) {
        return 'Proses masuk dengan Passkey dibatalkan.';
    }

    if (error instanceof InvalidDomainError) {
        return 'Passkey tidak valid untuk domain ini.';
    }

    return 'Tidak ditemukan Passkey untuk akun ini. Silakan masuk dengan kata sandi.';
}

export function LoginForm() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const {
        verify,
        isLoading: passkeyLoading,
        isSupported: passkeySupported,
    } = usePasskeyVerify({
        remember: () => data.remember,
        onSuccess: (response) => {
            if (response.redirect) {
                window.location.href = response.redirect;
            }
        },
        onError: (error) => {
            toast.error(passkeyErrorMessage(error));
        },
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(store.url());
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Masuk</CardTitle>
                <CardDescription>
                    Masuk untuk mengelola pemeliharaan aset di lingkungan
                    Hospifit.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit}>
                    <FieldGroup>
                        <Field data-invalid={!!errors.email}>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                type="email"
                                autoFocus
                                autoComplete="username"
                                aria-invalid={!!errors.email}
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                            {errors.email && (
                                <FieldError>{errors.email}</FieldError>
                            )}
                        </Field>
                        <Field data-invalid={!!errors.password}>
                            <div className="flex items-center justify-between">
                                <FieldLabel htmlFor="password">
                                    Kata Sandi
                                </FieldLabel>
                                <Link
                                    href={forgotPassword.url()}
                                    className="text-sm underline underline-offset-4 hover:text-primary"
                                >
                                    Lupa kata sandi?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                aria-invalid={!!errors.password}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                            />
                            {errors.password && (
                                <FieldError>{errors.password}</FieldError>
                            )}
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox
                                id="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) =>
                                    setData('remember', checked === true)
                                }
                            />
                            <FieldLabel
                                htmlFor="remember"
                                className="font-normal"
                            >
                                Ingat saya
                            </FieldLabel>
                        </Field>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            Masuk
                        </Button>
                        <FieldSeparator>Atau</FieldSeparator>
                        <Field>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                disabled={!passkeySupported || passkeyLoading}
                                onClick={() => void verify()}
                            >
                                <KeyRoundIcon data-icon="inline-start" />
                                Masuk dengan Passkey
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
