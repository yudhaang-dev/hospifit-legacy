<?php

namespace App\Domain\Identity\Actions;

use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class SendPasswordResetLink
{
    /**
     * Send a password-reset link to the given email, if an account exists for it.
     *
     * Always returns without revealing whether the account exists — the caller
     * should show the same generic response regardless of the outcome.
     */
    public function handle(string $email): void
    {
        Password::sendResetLink(['email' => Str::lower($email)]);
    }
}
