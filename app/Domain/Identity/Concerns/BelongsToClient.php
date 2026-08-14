<?php

namespace App\Domain\Identity\Concerns;

use App\Domain\Identity\Scopes\ClientScope;
use App\Models\Client;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Reusable client-scoping mechanism: any model that belongs to a Client
 * (Site, Contract, WorkOrder, etc. in later tickets) uses this trait to
 * automatically restrict queries to the current user's own Client.
 */
trait BelongsToClient
{
    protected static function bootBelongsToClient(): void
    {
        static::addGlobalScope(new ClientScope);
    }

    /**
     * @return BelongsTo<Client, $this>
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
