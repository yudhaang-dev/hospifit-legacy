<?php

namespace App\Domain\Identity\Actions;

use App\Models\User;

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
}
