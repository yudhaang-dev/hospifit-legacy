<?php

namespace App\Domain\Identity\Actions;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UpdatePassword
{
    /**
     * Update the user's password. Any of the account's other active sessions are
     * invalidated automatically by the app-wide `authenticateSessions()` middleware
     * once the stored password hash changes.
     */
    public function handle(User $user, string $password): void
    {
        $user->forceFill([
            'password' => Hash::make($password),
        ])->save();
    }
}
