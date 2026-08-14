<?php

namespace App\Http\Controllers\Backoffice\Concerns;

/**
 * Shared flash-message wording for any "delete unless it still has
 * dependents" Action result (see DeleteClients/DeleteSites) — used by every
 * controller whose destroy/bulkDestroy actions return a `{deleted, blocked}`
 * count pair, so the success/error wording convention only lives in one
 * place.
 */
trait HasDeleteFlash
{
    /**
     * Build the flash message key/value for a delete-with-dependents-guard
     * Action result.
     *
     * @param  array{deleted: int, blocked: int}  $result
     * @param  string  $entityLabel  singular, lowercase (e.g. "klien", "site")
     * @param  string  $blockedReason  what still depends on it (e.g. "Site/Pengguna")
     * @return array{0: string, 1: string}
     */
    private function deleteFlash(array $result, string $entityLabel, string $blockedReason): array
    {
        $messages = [];

        if ($result['deleted'] > 0) {
            $messages[] = "{$result['deleted']} {$entityLabel} dihapus.";
        }

        if ($result['blocked'] > 0) {
            $messages[] = "{$result['blocked']} {$entityLabel} dilewati karena masih memiliki {$blockedReason}.";
        }

        $key = $result['deleted'] > 0 && $result['blocked'] === 0 ? 'success' : 'error';

        return [$key, implode(' ', $messages) ?: "Tidak ada {$entityLabel} yang dihapus."];
    }
}
