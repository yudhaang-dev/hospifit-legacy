<?php

namespace App\Domain\Client\Actions;

use App\Models\Client;
use Illuminate\Support\Facades\DB;

class DeleteClients
{
    /**
     * Delete every given Client that has no Sites and no Users. Clients that
     * still have either are left untouched and counted as "blocked" — this
     * is what stops a delete from either cascading away a Client's Sites or
     * silently orphaning its Users' `client_id`.
     *
     * @param  array<int, int>  $clientIds
     * @return array{deleted: int, blocked: int}
     */
    public function handle(array $clientIds): array
    {
        return DB::transaction(function () use ($clientIds): array {
            $deleted = 0;
            $blocked = 0;

            $clients = Client::query()
                ->withCount(['sites', 'users'])
                ->whereKey($clientIds)
                ->get();

            foreach ($clients as $client) {
                if ($client->sites_count > 0 || $client->users_count > 0) {
                    $blocked++;

                    continue;
                }

                $client->delete();
                $deleted++;
            }

            return ['deleted' => $deleted, 'blocked' => $blocked];
        });
    }
}
