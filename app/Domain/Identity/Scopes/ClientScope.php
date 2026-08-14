<?php

namespace App\Domain\Identity\Scopes;

use App\Domain\Identity\Concerns\BelongsToClient;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

/**
 * Restricts any model using the BelongsToClient trait to rows belonging to
 * the current user's own Client. Internal (non-client) roles see everything.
 *
 * @see BelongsToClient
 *
 * @implements Scope<Model>
 */
class ClientScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        /** @var User|null $user */
        $user = Auth::user();

        if (! $user) {
            return;
        }

        if (! $user->role->isClientRole()) {
            return;
        }

        $builder->where($model->getTable().'.client_id', $user->client_id);
    }
}
