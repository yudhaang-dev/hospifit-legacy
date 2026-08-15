<?php

namespace App\Domain\Identity\Actions;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ResetPassword
{
    /**
     * Reset the password for the account matching the given token/email, invalidating
     * that account's other active sessions in the process.
     */
    public function handle(string $token, string $email, string $password): void
    {
        $status = Password::reset(
            [
                'token' => $token,
                'email' => Str::lower($email),
                'password' => $password,
            ],
            function (User $user) use ($password): void {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => __(match ($status) {
                    Password::INVALID_TOKEN => 'Tautan reset kata sandi tidak valid atau sudah kedaluwarsa.',
                    default => 'Gagal mereset kata sandi. Silakan coba lagi.',
                }),
            ]);
        }
    }
}
