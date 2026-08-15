<?php

namespace App\Http\Controllers\Identity;

use App\Domain\Identity\Actions\AttemptLogin;
use App\Domain\Identity\Actions\ResolveAreaForUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\Identity\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(): Response
    {
        return Inertia::render('identity/login');
    }

    /**
     * Log the user in and redirect to their layout area.
     */
    public function store(LoginRequest $request, AttemptLogin $attemptLogin, ResolveAreaForUser $resolveArea): RedirectResponse
    {
        $user = $attemptLogin->handle($request->string('email')->toString(), $request->string('password')->toString(), $request, $request->boolean('remember'));

        return redirect()->to($resolveArea->handle($user));
    }

    /**
     * Log the user out.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
