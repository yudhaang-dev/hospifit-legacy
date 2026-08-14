<?php

namespace App\Http\Controllers\Backoffice;

use App\Http\Controllers\Controller;
use App\Http\Requests\Site\StoreSiteRequest;
use App\Http\Requests\Site\UpdateSiteRequest;
use App\Models\Client;
use App\Models\Site;
use Illuminate\Http\RedirectResponse;

class SiteController extends Controller
{
    /**
     * Store a newly created Site under the given Client.
     */
    public function store(StoreSiteRequest $request, Client $client): RedirectResponse
    {
        $client->sites()->create($request->validated());

        return back();
    }

    /**
     * Update the given Site.
     */
    public function update(UpdateSiteRequest $request, Site $site): RedirectResponse
    {
        $site->update($request->validated());

        return back();
    }
}
