<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Asset\Actions\GenerateAssetBarcode;
use App\Http\Controllers\Controller;
use App\Http\Requests\Asset\IndexAssetRequest;
use App\Http\Requests\Asset\StoreAssetRequest;
use App\Http\Requests\Asset\UpdateAssetRequest;
use App\Models\Asset;
use App\Models\AssetType;
use App\Models\Location;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    /**
     * List every Asset across every Client/Site/Location — searchable,
     * sortable, paginated the same way the Location-scoped Asset list is,
     * plus optional Client/Site/Location filters.
     */
    public function index(IndexAssetRequest $request): Response
    {
        /** @var string|null $search */
        $search = $request->validated('search');
        /** @var string $sort */
        $sort = $request->validated('sort') ?? 'name';
        /** @var 'asc'|'desc' $direction */
        $direction = $request->validated('direction') ?? 'asc';
        /** @var int $perPage */
        $perPage = $request->validated('per_page') ?? 15;
        /** @var int|null $clientId */
        $clientId = $request->validated('client_id');
        /** @var int|null $siteId */
        $siteId = $request->validated('site_id');
        /** @var int|null $locationId */
        $locationId = $request->validated('location_id');

        $assets = Asset::query()
            ->with(['assetType', 'location.site.client'])
            ->when($search, fn ($query, $search) => $query->where(fn ($query) => $query
                ->where('name', 'like', "%{$search}%")
                ->orWhere('barcode', 'like', "%{$search}%")
                ->orWhere('serial_number', 'like', "%{$search}%")))
            ->when($locationId, fn ($query, $locationId) => $query->where('location_id', $locationId))
            ->when($siteId, fn ($query, $siteId) => $query->whereHas(
                'location', fn ($query) => $query->where('site_id', $siteId)
            ))
            ->when($clientId, fn ($query, $clientId) => $query->whereHas(
                'location.site', fn ($query) => $query->where('client_id', $clientId)
            ))
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('backoffice/asset/index', [
            'assets' => $assets,
            'assetTypes' => AssetType::query()->orderBy('name')->get(),
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => (int) $perPage,
                'client_id' => $clientId,
                'site_id' => $siteId,
                'location_id' => $locationId,
            ],
        ]);
    }

    /**
     * Store a newly created Asset under the given Location, generating its
     * unique barcode.
     */
    public function store(StoreAssetRequest $request, Location $location): RedirectResponse
    {
        $barcode = (new GenerateAssetBarcode)->handle();

        $location->assets()->create([
            ...$request->validated(),
            'barcode' => $barcode,
        ]);

        return back();
    }

    /**
     * Update the given Asset.
     */
    public function update(UpdateAssetRequest $request, Asset $asset): RedirectResponse
    {
        $asset->update($request->validated());

        return back();
    }

    /**
     * Delete the given Asset. No dependents exist yet at this stage
     * (ContractItem/WorkOrder tables land in later tickets), so no blocking
     * guard is needed here.
     */
    public function destroy(Asset $asset): RedirectResponse
    {
        Gate::authorize('delete', $asset);

        $asset->delete();

        return back()->with('success', 'Aset dihapus.');
    }
}
