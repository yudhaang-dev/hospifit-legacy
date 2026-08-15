<?php

namespace App\Http\Controllers\Identity;

use App\Domain\Identity\Actions\SendPasswordResetLink;
use App\Http\Controllers\Controller;
use App\Http\Requests\Identity\ForgotPasswordRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Show the "forgot password" request page.
     */
    public function create(): Response
    {
        return Inertia::render('identity/forgot-password');
    }

    /**
     * Send a password-reset link, if an account exists for the given email.
     *
     * Always redirects back with the same generic status, regardless of whether
     * the email matched an account, to avoid revealing account existence.
     */
    public function store(ForgotPasswordRequest $request, SendPasswordResetLink $sendResetLink): RedirectResponse
    {
        $sendResetLink->handle($request->string('email')->toString());

        return back()->with('success', __('Jika email tersebut terdaftar, tautan reset kata sandi telah dikirim.'));
    }
}
