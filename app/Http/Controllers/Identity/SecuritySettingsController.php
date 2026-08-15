<?php

namespace App\Http\Controllers\Identity;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class SecuritySettingsController extends Controller
{
    /**
     * Show the account security settings page: change password + manage passkeys.
     */
    public function index(): Response
    {
        /** @var User $user */
        $user = auth()->user();

        return Inertia::render('identity/settings/security', [
            'passkeys' => $user->passkeys()
                ->orderByDesc('created_at')
                ->get(['id', 'name', 'last_used_at', 'created_at']),
        ]);
    }
}
