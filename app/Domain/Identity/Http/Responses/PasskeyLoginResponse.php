<?php

namespace App\Domain\Identity\Http\Responses;

use App\Domain\Identity\Actions\AttemptLogin;
use App\Domain\Identity\Actions\ResolveAreaForUser;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Passkeys\Contracts\PasskeyLoginResponse as PasskeyLoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

/**
 * Redirects a successful passkey login to the same layout-area landing page password
 * login uses, instead of the package's fixed `config('passkeys.redirect')` path — so
 * both authentication methods land users in an identical place (see {@see AttemptLogin}).
 */
class PasskeyLoginResponse implements PasskeyLoginResponseContract
{
    public function __construct(private readonly ResolveAreaForUser $resolveArea) {}

    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     */
    public function toResponse($request): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $target = $this->resolveArea->handle($user);

        if ($request->wantsJson()) {
            return new JsonResponse(['redirect' => $target], 200);
        }

        return redirect()->to($target);
    }
}
