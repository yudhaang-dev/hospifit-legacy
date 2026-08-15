<?php

namespace App\Domain\Identity\Actions;

use App\Models\User;
use Illuminate\Http\RedirectResponse;

class ResolveAreaForUser
{
    /**
     * Resolve the URL of the layout-area landing page this user belongs in.
     */
    public function handle(User $user): string
    {
        return route(match ($user->role->areaPrefix()) {
            'backoffice' => 'backoffice.dashboard',
            'field' => 'field.today',
            default => 'portal.dashboard',
        });
    }

    /**
     * Redirect straight to this user's layout-area landing page.
     */
    public function redirect(User $user): RedirectResponse
    {
        return redirect()->to($this->handle($user));
    }
}
