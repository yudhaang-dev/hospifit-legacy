<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Client\Actions\BuildLocationTree;
use App\Domain\Client\Actions\DeleteLocations;
use App\Http\Controllers\Backoffice\Concerns\HasDeleteFlash;
use App\Http\Controllers\Controller;
use App\Http\Requests\Location\SearchLocationRequest;
use App\Http\Requests\Location\ShowLocationRequest;
use App\Http\Requests\Location\StoreLocationRequest;
use App\Http\Requests\Location\UpdateLocationRequest;
use App\Models\AssetType;
use App\Models\Location;
use App\Models\Site;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    use HasDeleteFlash;

    /**
     * Typeahead search for Locations scoped to a Site, e.g. for the global
     * Asset list's cascading Client/Site/Location picker. JSON, not
     * Inertia — capped at 20 results.
     *
     * Depth must be computed from the Site's *whole* Location tree (via
     * `BuildLocationTree`, same as `SiteController::show` already uses) and
     * only filtered by `q` afterwards — filtering the Locations first would
     * lose the ancestor context needed to compute each node's depth
     * correctly.
     */
    public function search(SearchLocationRequest $request): JsonResponse
    {
        /** @var int $siteId */
        $siteId = $request->validated('site_id');
        /** @var int|null $id */
        $id = $request->validated('id');
        /** @var string|null $q */
        $q = $request->validated('q');

        // Resolving a single, already-known id (e.g. re-hydrating a picker's
        // selected label from a URL filter) short-circuits the name search —
        // depth doesn't matter for a resolved single result, only its name.
        if ($id !== null) {
            $location = Location::query()->where('site_id', $siteId)->whereKey($id)->first();

            return response()->json($location !== null ? [[
                'id' => $location->id,
                'name' => $location->name,
                'depth' => 0,
            ]] : []);
        }

        $locations = Location::query()->where('site_id', $siteId)->orderBy('name')->get();

        $flattened = (new BuildLocationTree)->handle($locations);

        $results = collect($flattened)
            ->when($q, fn ($nodes, $q) => $nodes->filter(
                fn (array $node) => Str::contains($node['name'], $q, ignoreCase: true)
            ))
            ->take(20)
            ->map(fn (array $node) => [
                'id' => $node['id'],
                'name' => $node['name'],
                'depth' => $node['depth'],
            ])
            ->values();

        return response()->json($results);
    }

    /**
     * Show a Location's detail, including the Assets registered directly
     * under it — searchable, sortable, paginated the same way the Client
     * index is — plus the full AssetType list for the Asset form's picker.
     */
    public function show(ShowLocationRequest $request, Location $location): Response
    {
        /** @var string|null $search */
        $search = $request->validated('search');
        /** @var string $sort */
        $sort = $request->validated('sort') ?? 'name';
        /** @var 'asc'|'desc' $direction */
        $direction = $request->validated('direction') ?? 'asc';
        /** @var int $perPage */
        $perPage = $request->validated('per_page') ?? 15;

        $assets = $location->assets()
            ->when($search, fn ($query, $search) => $query->where(fn ($query) => $query
                ->where('name', 'like', "%{$search}%")
                ->orWhere('barcode', 'like', "%{$search}%")
                ->orWhere('serial_number', 'like', "%{$search}%")))
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        $location->load(['site.client']);

        return Inertia::render('backoffice/location/show', [
            'location' => $location,
            'site' => $location->site,
            'client' => $location->site->client,
            'assets' => $assets,
            'assetTypes' => AssetType::query()->orderBy('name')->get(),
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => (int) $perPage,
            ],
        ]);
    }

    /**
     * Store a newly created Location under the given Site (optionally
     * nested under another Location via `parent_location_id`).
     */
    public function store(StoreLocationRequest $request, Site $site): RedirectResponse
    {
        $site->locations()->create($request->validated());

        return back();
    }

    /**
     * Update the given Location.
     */
    public function update(UpdateLocationRequest $request, Location $location): RedirectResponse
    {
        $location->update($request->validated());

        return back();
    }

    /**
     * Delete the given Location, if it has no child Locations.
     */
    public function destroy(Location $location): RedirectResponse
    {
        Gate::authorize('delete', $location);

        $result = (new DeleteLocations)->handle([$location->id]);

        return back()->with(...$this->deleteFlash($result, 'lokasi', 'sub-lokasi'));
    }
}
