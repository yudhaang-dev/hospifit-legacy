<?php

namespace App\Http\Controllers\Identity;

use App\Domain\Identity\Actions\ResolveAreaForUser;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Resend the email-verification notification to the current user.
     */
    public function store(Request $request, ResolveAreaForUser $resolveArea): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return $resolveArea->redirect($user);
        }

        $user->sendEmailVerificationNotification();

        return back()->with('success', __('Tautan verifikasi baru telah dikirim ke email Anda.'));
    }
}
