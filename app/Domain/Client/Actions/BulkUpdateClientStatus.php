<?php

namespace App\Domain\Client\Actions;

use App\Domain\Client\ClientStatus;
use App\Models\Client;

class BulkUpdateClientStatus
{
    /**
     * Set the given status on every given Client.
     *
     * @param  array<int, int>  $clientIds
     * @return int the number of Clients updated
     */
    public function handle(array $clientIds, ClientStatus $status): int
    {
        return Client::query()
            ->whereKey($clientIds)
            ->update(['status' => $status]);
    }
}
