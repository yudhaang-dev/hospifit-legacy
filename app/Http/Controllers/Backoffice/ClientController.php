<?php

namespace App\Http\Controllers\Backoffice;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Requests\Client\UpdateClientRequest;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * List every Client.
     */
    public function index(): Response
    {
        return Inertia::render('backoffice/client/index', [
            'clients' => Client::query()->orderBy('name')->get(),
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
}
