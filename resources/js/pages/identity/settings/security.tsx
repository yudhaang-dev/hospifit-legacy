import { Head, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { ManagePasskeysCard } from '@/features/identity/components/manage-passkeys-card';
import { UpdatePasswordForm } from '@/features/identity/components/update-password-form';
import type { Passkey } from '@/features/identity/lib/types';
import BackofficeLayout from '@/layouts/backoffice-layout';
import FieldLayout from '@/layouts/field-layout';
import PortalLayout from '@/layouts/portal-layout';
import type { Auth } from '@/types/auth';

type SecuritySettingsProps = {
    passkeys: Passkey[];
};

/**
 * Wraps the settings content in whichever of the three area layouts matches the
 * current user's role — this page is reachable by every role (it's an identity
 * concern, not area-specific, see routes/web.php), so unlike domain pages it
 * can't pick its layout statically via `Component.layout`.
 */
function areaLayout(role: Auth['user']['role'], content: ReactNode) {
    switch (role) {
        case 'admin':
        case 'office_staff':
            return (
                <BackofficeLayout breadcrumbs={[{ label: 'Keamanan' }]}>
                    {content}
                </BackofficeLayout>
            );
        case 'field_staff':
            return <FieldLayout>{content}</FieldLayout>;
        default:
            return <PortalLayout>{content}</PortalLayout>;
    }
}

export default function SecuritySettings({ passkeys }: SecuritySettingsProps) {
    const { auth } = usePage<{ auth: Auth }>().props;

    const content = (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <h1 className="text-xl font-semibold">Keamanan</h1>
                <p className="text-sm text-muted-foreground">
                    Kelola kata sandi dan Passkey akun Anda.
                </p>
            </div>
            <UpdatePasswordForm />
            <ManagePasskeysCard passkeys={passkeys} />
        </div>
    );

    return (
        <>
            <Head title="Keamanan" />
            {areaLayout(auth.user.role, content)}
        </>
    );
}
