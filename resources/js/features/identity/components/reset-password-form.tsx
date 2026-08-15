import { useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { store } from '@/actions/App/Http/Controllers/Identity/NewPasswordController';
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
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

type ResetPasswordFormProps = {
    token: string;
    email: string;
};

export function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(store.url());
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Atur Kata Sandi Baru</CardTitle>
                <CardDescription>
                    Masukkan kata sandi baru untuk akun Anda.
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
                            <FieldLabel htmlFor="password">
                                Kata Sandi Baru
                            </FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                autoFocus
                                autoComplete="new-password"
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
                        <Field data-invalid={!!errors.password_confirmation}>
                            <FieldLabel htmlFor="password_confirmation">
                                Konfirmasi Kata Sandi
                            </FieldLabel>
                            <Input
                                id="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                aria-invalid={!!errors.password_confirmation}
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.password_confirmation && (
                                <FieldError>
                                    {errors.password_confirmation}
                                </FieldError>
                            )}
                        </Field>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            Reset Kata Sandi
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
