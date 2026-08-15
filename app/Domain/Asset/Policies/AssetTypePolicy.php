<?php

namespace App\Domain\Asset\Policies;

use App\Domain\Identity\UserRole;
use App\Models\AssetType;
use App\Models\User;

class AssetTypePolicy
{
    /**
     * Determine whether the user can view any asset types.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model. AssetType is a global
     * reference list, not scoped to any Client/Site/Location, so there's no
     * per-Client visibility to restrict here (unlike AssetPolicy::view).
     */
    public function view(User $user, AssetType $assetType): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create asset types.
     */
    public function create(User $user): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, AssetType $assetType): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AssetType $assetType): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Determine whether the user can bulk-delete asset types (no single
     * model instance to authorize against).
     */
    public function deleteAny(User $user): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Whether the user is a role allowed to manage AssetTypes (create,
     * update, delete).
     */
    private function isBackofficeRole(User $user): bool
    {
        return in_array($user->role, UserRole::backoffice(), true);
    }
}
