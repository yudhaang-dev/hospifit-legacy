<?php

namespace App\Http\Middleware;

use App\Domain\Identity\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        abort_unless($user !== null, 401);

        $allowed = collect($roles)->contains(
            fn (string $role) => $user->role === UserRole::from($role)
        );

        abort_unless($allowed, 403);

        return $next($request);
    }
}
