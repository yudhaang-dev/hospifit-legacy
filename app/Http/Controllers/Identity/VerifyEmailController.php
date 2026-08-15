<?php

namespace App\Http\Controllers\Identity;

use App\Domain\Identity\Actions\ResolveAreaForUser;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Fulfill a signed email-verification link.
     */
    public function __invoke(EmailVerificationRequest $request, ResolveAreaForUser $resolveArea): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! $user->hasVerifiedEmail() && $user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return $resolveArea->redirect($user)
            ->with('success', __('Email Anda berhasil diverifikasi.'));
    }
}
