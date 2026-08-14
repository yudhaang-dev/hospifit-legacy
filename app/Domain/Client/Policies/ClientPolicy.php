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
        return in_array($user->role, UserRole::backoffice(), true);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Client $client): bool
    {
        return in_array($user->role, UserRole::backoffice(), true);
    }
}
