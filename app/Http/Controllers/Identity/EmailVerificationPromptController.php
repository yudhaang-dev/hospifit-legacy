<?php

namespace App\Http\Controllers\Identity;

use App\Domain\Identity\Actions\ResolveAreaForUser;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the "verify your email" prompt, or send an already-verified user on to their area.
     */
    public function __invoke(Request $request, ResolveAreaForUser $resolveArea): Response|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        return $user->hasVerifiedEmail()
            ? $resolveArea->redirect($user)
            : Inertia::render('identity/verify-email');
    }
}
