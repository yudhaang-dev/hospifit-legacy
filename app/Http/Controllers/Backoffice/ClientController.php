<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Client\Actions\BulkUpdateClientStatus;
use App\Domain\Client\Actions\DeleteClients;
use App\Domain\Client\ClientStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Client\BulkDeleteClientsRequest;
use App\Http\Requests\Client\BulkUpdateClientStatusRequest;
use App\Http\Requests\Client\IndexClientRequest;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Requests\Client\UpdateClientRequest;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * List Clients — searchable, sortable, paginated.
     */
    public function index(IndexClientRequest $request): Response
    {
        /** @var string|null $search */
        $search = $request->validated('search');
        /** @var string $sort */
        $sort = $request->validated('sort') ?? 'name';
        /** @var 'asc'|'desc' $direction */
        $direction = $request->validated('direction') ?? 'asc';
        /** @var int $perPage */
        $perPage = $request->validated('per_page') ?? 15;

        $clients = Client::query()
            ->when($search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('backoffice/client/index', [
            'clients' => $clients,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => (int) $perPage,
            ],
        ]);
    }

    /**
     * Show a Client's detail, including its Sites.
     */
    public function show(Client $client): Response
    {
        return Inertia::render('backoffice/client/show', [
            'client' => $client,
            'sites' => $client->sites()->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created Client.
     */
    public function store(StoreClientRequest $request): RedirectResponse
    {
        Client::create($request->validated());

        return back();
    }

    /**
     * Update the given Client.
     */
    public function update(UpdateClientRequest $request, Client $client): RedirectResponse
    {
        $client->update($request->validated());

        return back();
    }

    /**
     * Delete the given Client, if it has no Sites and no Users.
     */
    public function destroy(Client $client): RedirectResponse
    {
        Gate::authorize('delete', $client);

        $result = (new DeleteClients)->handle([$client->id]);

        return back()->with(...$this->deleteFlash($result));
    }

    /**
     * Update the status of every given Client.
     */
    public function bulkUpdateStatus(BulkUpdateClientStatusRequest $request): RedirectResponse
    {
        /** @var array<int, int> $ids */
        $ids = $request->validated('ids');
        /** @var string $status */
        $status = $request->validated('status');

        $count = (new BulkUpdateClientStatus)->handle($ids, ClientStatus::from($status));

        return back()->with('success', "{$count} klien diperbarui.");
    }

    /**
     * Delete every given Client that has no Sites and no Users.
     */
    public function bulkDestroy(BulkDeleteClientsRequest $request): RedirectResponse
    {
        /** @var array<int, int> $ids */
        $ids = $request->validated('ids');

        $result = (new DeleteClients)->handle($ids);

        return back()->with(...$this->deleteFlash($result));
    }

    /**
     * Build the flash message key/value for a DeleteClients result.
     *
     * @param  array{deleted: int, blocked: int}  $result
     * @return array{0: string, 1: string}
     */
    private function deleteFlash(array $result): array
    {
        $messages = [];

        if ($result['deleted'] > 0) {
            $messages[] = "{$result['deleted']} klien dihapus.";
        }

        if ($result['blocked'] > 0) {
            $messages[] = "{$result['blocked']} klien dilewati karena masih memiliki Site/Pengguna.";
        }

        $key = $result['deleted'] > 0 && $result['blocked'] === 0 ? 'success' : 'error';

        return [$key, implode(' ', $messages) ?: 'Tidak ada klien yang dihapus.'];
    }
}
