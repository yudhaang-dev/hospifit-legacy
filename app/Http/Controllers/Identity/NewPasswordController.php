<?php

namespace App\Http\Controllers\Identity;

use App\Domain\Identity\Actions\ResetPassword;
use App\Http\Controllers\Controller;
use App\Http\Requests\Identity\ResetPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * Show the "set a new password" page for a valid reset-link token.
     */
    public function create(Request $request, string $token): Response
    {
        return Inertia::render('identity/reset-password', [
            'token' => $token,
            'email' => $request->string('email')->toString(),
        ]);
    }

    /**
     * Reset the account's password and redirect to login.
     */
    public function store(ResetPasswordRequest $request, ResetPassword $resetPassword): RedirectResponse
    {
        $resetPassword->handle(
            $request->string('token')->toString(),
            $request->string('email')->toString(),
            $request->string('password')->toString(),
        );

        return redirect()->route('login')
            ->with('success', __('Kata sandi Anda berhasil direset. Silakan masuk dengan kata sandi baru.'));
    }
}
