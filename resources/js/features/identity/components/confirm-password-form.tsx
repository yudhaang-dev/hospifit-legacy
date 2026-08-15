import { useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { store } from '@/actions/App/Http/Controllers/Identity/ConfirmablePasswordController';
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

export function ConfirmPasswordForm() {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(store.url());
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Konfirmasi Kata Sandi</CardTitle>
                <CardDescription>
                    Ini adalah area yang aman. Mohon konfirmasi kata sandi Anda
                    sebelum melanjutkan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit}>
                    <FieldGroup>
                        <Field data-invalid={!!errors.password}>
                            <FieldLabel htmlFor="password">
                                Kata Sandi
                            </FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                autoFocus
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
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            Konfirmasi
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
