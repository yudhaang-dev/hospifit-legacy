import { Link, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { store } from '@/actions/App/Http/Controllers/Identity/PasswordResetLinkController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { login } from '@/routes';

export function ForgotPasswordForm() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(store.url());
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Lupa Kata Sandi</CardTitle>
                <CardDescription>
                    Masukkan email Anda dan kami akan mengirimkan tautan untuk
                    mereset kata sandi.
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
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            Kirim Tautan Reset
                        </Button>
                        <Field>
                            <FieldDescription className="text-center">
                                <Link href={login.url()}>
                                    Kembali ke halaman masuk
                                </Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
