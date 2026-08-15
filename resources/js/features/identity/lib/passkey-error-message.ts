import {
    InvalidDomainError,
    NotSupportedError,
    UserCancelledError,
} from '@laravel/passkeys';

/**
 * Map a WebAuthn/passkey error to Indonesian toast copy, shared between the login
 * form's `verify()` flow and the security settings page's `register()` flow. Errors
 * specific to one flow (e.g. "no matching passkey" on login, "registration failed"
 * on register) fall through to a caller-supplied `fallback` message.
 */
export function passkeyErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof NotSupportedError) {
        return 'Perangkat atau browser Anda tidak mendukung Passkey.';
    }

    if (error instanceof UserCancelledError) {
        return 'Proses dengan Passkey dibatalkan.';
    }

    if (error instanceof InvalidDomainError) {
        return 'Passkey tidak valid untuk domain ini.';
    }

    return fallback;
}
