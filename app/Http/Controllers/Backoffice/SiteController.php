<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Client\Actions\BuildLocationTree;
use App\Domain\Client\Actions\DeleteSites;
use App\Http\Controllers\Backoffice\Concerns\HasDeleteFlash;
use App\Http\Controllers\Controller;
use App\Http\Requests\Site\BulkDeleteSitesRequest;
use App\Http\Requests\Site\SearchSiteRequest;
use App\Http\Requests\Site\StoreSiteRequest;
use App\Http\Requests\Site\UpdateSiteRequest;
use App\Models\Client;
use App\Models\Site;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SiteController extends Controller
{
    use HasDeleteFlash;

    /**
     * Typeahead search for Sites scoped to a Client, e.g. for the global
     * Asset list's cascading Client/Site/Location picker. JSON, not
     * Inertia — capped at 20 results.
     */
    public function search(SearchSiteRequest $request): JsonResponse
    {
        /** @var int $clientId */
        $clientId = $request->validated('client_id');
        /** @var int|null $id */
        $id = $request->validated('id');
        /** @var string|null $q */
        $q = $request->validated('q');

        // Resolving a single, already-known id (e.g. re-hydrating a picker's
        // selected label from a URL filter) short-circuits the name search —
        // the record might otherwise fall outside the first 20 name-sorted
        // results.
        $sites = $id !== null
            ? Site::query()->where('client_id', $clientId)->whereKey($id)->get(['id', 'name'])
            : Site::query()
                ->where('client_id', $clientId)
                ->when($q, fn ($query, $q) => $query->where('name', 'like', "%{$q}%"))
                ->orderBy('name')
                ->limit(20)
                ->get(['id', 'name']);

        return response()->json($sites);
    }

    /**
     * Store a newly created Site under the given Client.
     */
    public function store(StoreSiteRequest $request, Client $client): RedirectResponse
    {
        $client->sites()->create($request->validated());

        return back();
    }

    /**
     * Show a Site's detail, including its Location tree.
     */
    public function show(Site $site): Response
    {
        $site->load(['client:id,name']);

        $locations = $site->locations()->orderBy('name')->get();

        return Inertia::render('backoffice/site/show', [
            'site' => $site,
            'locations' => (new BuildLocationTree)->handle($locations),
        ]);
    }

    /**
     * Update the given Site.
     */
    public function update(UpdateSiteRequest $request, Site $site): RedirectResponse
    {
        $site->update($request->validated());

        return back();
    }

    /**
     * Delete the given Site, if it has no Locations.
     */
    public function destroy(Site $site): RedirectResponse
    {
        Gate::authorize('delete', $site);

        $result = (new DeleteSites)->handle([$site->id]);

        return back()->with(...$this->deleteFlash($result, 'site', 'Lokasi'));
    }

    /**
     * Delete every given Site that has no Locations.
     */
    public function bulkDestroy(BulkDeleteSitesRequest $request): RedirectResponse
    {
        /** @var array<int, int> $ids */
        $ids = $request->validated('ids');

        $result = (new DeleteSites)->handle($ids);

        return back()->with(...$this->deleteFlash($result, 'site', 'Lokasi'));
    }
}
