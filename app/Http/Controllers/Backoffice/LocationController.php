<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Client\Actions\DeleteLocations;
use App\Http\Controllers\Backoffice\Concerns\HasDeleteFlash;
use App\Http\Controllers\Controller;
use App\Http\Requests\Location\StoreLocationRequest;
use App\Http\Requests\Location\UpdateLocationRequest;
use App\Models\Location;
use App\Models\Site;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class LocationController extends Controller
{
    use HasDeleteFlash;

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
