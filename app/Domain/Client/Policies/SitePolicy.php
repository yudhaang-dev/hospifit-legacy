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
        return $this->isBackofficeRole($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Site $site): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Site $site): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Determine whether the user can bulk-delete sites (no single model
     * instance to authorize against).
     */
    public function deleteAny(User $user): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Whether the user is a role allowed to manage Sites (create, update,
     * delete — single or bulk).
     */
    private function isBackofficeRole(User $user): bool
    {
        return in_array($user->role, UserRole::backoffice(), true);
    }
}
