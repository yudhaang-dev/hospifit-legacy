<?php

namespace App\Domain\Identity\Actions;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AttemptLogin
{
    /**
     * Attempt to log the user in, throttling repeated failures.
     */
    public function handle(string $email, string $password, Request $request, bool $remember = false): User
    {
        $throttleKey = Str::lower($email).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            throw ValidationException::withMessages([
                'email' => __('Terlalu banyak percobaan login. Coba lagi dalam :seconds detik.', [
                    'seconds' => $seconds,
                ]),
            ]);
        }

        if (! Auth::attempt(['email' => $email, 'password' => $password], $remember)) {
            RateLimiter::hit($throttleKey);

            throw ValidationException::withMessages([
                'email' => __('Email atau kata sandi salah.'),
            ]);
        }

        RateLimiter::clear($throttleKey);

        $request->session()->regenerate();

        /** @var User $user */
        $user = Auth::user();

        return $user;
    }
}
