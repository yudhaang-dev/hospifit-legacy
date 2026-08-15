<?php

namespace App\Domain\Asset\Policies;

use App\Domain\Identity\UserRole;
use App\Models\Asset;
use App\Models\User;

class AssetPolicy
{
    /**
     * Determine whether the user can view any assets.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Asset $asset): bool
    {
        return ! $user->role->isClientRole() || $user->client_id === $asset->location->site->client_id;
    }

    /**
     * Determine whether the user can create assets.
     */
    public function create(User $user): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Asset $asset): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Asset $asset): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Whether the user is a role allowed to manage Assets (create, update,
     * delete).
     */
    private function isBackofficeRole(User $user): bool
    {
        return in_array($user->role, UserRole::backoffice(), true);
    }
}
