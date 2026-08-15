import { useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { update } from '@/actions/App/Http/Controllers/Identity/PasswordController';
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

export function UpdatePasswordForm() {
    const { data, setData, put, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(update.url(), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ubah Kata Sandi</CardTitle>
                <CardDescription>
                    Gunakan kata sandi yang kuat dan belum pernah dipakai di
                    tempat lain.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit}>
                    <FieldGroup>
                        <Field data-invalid={!!errors.password}>
                            <FieldLabel htmlFor="password">
                                Kata Sandi Baru
                            </FieldLabel>
                            <Input
                                id="password"
                                type="password"
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
                            className="w-fit"
                            disabled={processing}
                        >
                            Simpan Kata Sandi
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
