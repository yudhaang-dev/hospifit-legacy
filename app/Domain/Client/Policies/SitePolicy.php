<?php

namespace App\Domain\Client\Policies;

use App\Domain\Identity\UserRole;
use App\Models\Site;
use App\Models\User;

class SitePolicy
{
    /**
     * Determine whether the user can view any sites.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Site $site): bool
    {
        return ! $user->role->isClientRole() || $user->client_id === $site->client_id;
    }

    /**
     * Determine whether the user can create sites.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, UserRole::backoffice(), true);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Site $site): bool
    {
        return in_array($user->role, UserRole::backoffice(), true);
    }
}
