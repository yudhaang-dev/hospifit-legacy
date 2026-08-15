<?php

namespace App\Http\Controllers\Identity;

use App\Domain\Identity\Actions\ResolveAreaForUser;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ConfirmablePasswordController extends Controller
{
    /**
     * Show the "confirm your password" page, gating access to sensitive settings
     * (e.g. changing the password, managing passkeys) behind re-entering it.
     */
    public function show(): Response
    {
        return Inertia::render('identity/confirm-password');
    }

    /**
     * Confirm the current user's password and mark the session as confirmed.
     */
    public function store(Request $request, ResolveAreaForUser $resolveArea): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! Auth::guard('web')->validate([
            'email' => $user->email,
            'password' => $request->string('password')->toString(),
        ])) {
            throw ValidationException::withMessages([
                'password' => __('Kata sandi salah.'),
            ]);
        }

        $request->session()->put('auth.password_confirmed_at', time());

        return redirect()->intended($resolveArea->handle($user));
    }
}
