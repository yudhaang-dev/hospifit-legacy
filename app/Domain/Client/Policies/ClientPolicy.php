<?php

namespace App\Domain\Client\Policies;

use App\Domain\Identity\UserRole;
use App\Models\Client;
use App\Models\User;

class ClientPolicy
{
    /**
     * Determine whether the user can view any clients.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Client $client): bool
    {
        return ! $user->role->isClientRole() || $user->client_id === $client->id;
    }

    /**
     * Determine whether the user can create clients.
     */
    public function create(User $user): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Client $client): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Determine whether the user can bulk-update clients (no single model
     * instance to authorize against).
     */
    public function updateAny(User $user): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Client $client): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Determine whether the user can bulk-delete clients (no single model
     * instance to authorize against).
     */
    public function deleteAny(User $user): bool
    {
        return $this->isBackofficeRole($user);
    }

    /**
     * Whether the user is a role allowed to manage Clients (create, update,
     * delete — single or bulk).
     */
    private function isBackofficeRole(User $user): bool
    {
        return in_array($user->role, UserRole::backoffice(), true);
    }
}
