<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Asset\Actions\DeleteAssetTypes;
use App\Http\Controllers\Backoffice\Concerns\HasDeleteFlash;
use App\Http\Controllers\Controller;
use App\Http\Requests\AssetType\BulkDeleteAssetTypesRequest;
use App\Http\Requests\AssetType\IndexAssetTypeRequest;
use App\Http\Requests\AssetType\StoreAssetTypeRequest;
use App\Http\Requests\AssetType\UpdateAssetTypeRequest;
use App\Models\AssetType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AssetTypeController extends Controller
{
    use HasDeleteFlash;

    /**
     * List AssetTypes — searchable, sortable, paginated.
     */
    public function index(IndexAssetTypeRequest $request): Response
    {
        /** @var string|null $search */
        $search = $request->validated('search');
        /** @var string $sort */
        $sort = $request->validated('sort') ?? 'name';
        /** @var 'asc'|'desc' $direction */
        $direction = $request->validated('direction') ?? 'asc';
        /** @var int $perPage */
        $perPage = $request->validated('per_page') ?? 15;

        $assetTypes = AssetType::query()
            ->when($search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('backoffice/asset-type/index', [
            'assetTypes' => $assetTypes,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => (int) $perPage,
            ],
        ]);
    }

    /**
     * Store a newly created AssetType.
     */
    public function store(StoreAssetTypeRequest $request): RedirectResponse
    {
        AssetType::create($request->validated());

        return back();
    }

    /**
     * Update the given AssetType.
     */
    public function update(UpdateAssetTypeRequest $request, AssetType $assetType): RedirectResponse
    {
        $assetType->update($request->validated());

        return back();
    }

    /**
     * Delete the given AssetType, if no Asset still references it.
     */
    public function destroy(AssetType $assetType): RedirectResponse
    {
        Gate::authorize('delete', $assetType);

        $result = (new DeleteAssetTypes)->handle([$assetType->id]);

        return back()->with(...$this->deleteFlash($result, 'tipe aset', 'Aset'));
    }

    /**
     * Delete every given AssetType that no Asset still references.
     */
    public function bulkDestroy(BulkDeleteAssetTypesRequest $request): RedirectResponse
    {
        /** @var array<int, int> $ids */
        $ids = $request->validated('ids');

        $result = (new DeleteAssetTypes)->handle($ids);

        return back()->with(...$this->deleteFlash($result, 'tipe aset', 'Aset'));
    }
}
