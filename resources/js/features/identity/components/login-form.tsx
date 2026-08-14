import { useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';
import { store } from '@/actions/App/Http/Controllers/Identity/AuthenticatedSessionController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
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
                    Masuk untuk melanjutkan ke Hospifit.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            autoFocus
                            autoComplete="username"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Kata Sandi</Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={processing}
                    >
                        Masuk
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
