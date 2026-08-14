<?php

namespace App\Domain\Client\Policies;

use App\Domain\Identity\UserRole;
use App\Models\Location;
use App\Models\User;

class LocationPolicy
{
    /**
     * Determine whether the user can view any locations.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Location $location): bool
    {
        return ! $user->role->isClientRole() || $user->client_id === $location->site->client_id;
    }

    /**
     * Determine whether the user can create locations.
     */
    public function create(User $user): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Location $location): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Location $location): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Whether the user is a role allowed to manage Locations (create,
     * update, delete).
     */
    private function isBackofficeRole(User $user): bool
    {
        return in_array($user->role, UserRole::backoffice(), true);
    }
}
