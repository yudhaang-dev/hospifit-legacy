<?php

use App\Models\Asset;
use App\Models\Client;
use App\Models\Location;
use App\Models\Site;
use App\Models\User;

test('admin can view the global asset list', function () {
    $admin = User::factory()->admin()->create();
    $asset = Asset::factory()->create();

    $response = $this->actingAs($admin)->get(route('backoffice.assets.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('backoffice/asset/index')
        ->has('assets.data', 1)
        ->where('assets.data.0.id', $asset->id)
    );
});

test('global asset list is paginated', function () {
    $admin = User::factory()->admin()->create();
    Asset::factory()->count(16)->create();

    $response = $this->actingAs($admin)->get(route('backoffice.assets.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('assets.total', 16)
        ->has('assets.data', 15)
    );
});

test('global asset list can be searched by name, barcode, or serial number', function () {
    $admin = User::factory()->admin()->create();
    Asset::factory()->create(['name' => 'AC Split Lobi', 'barcode' => 'AST-AAAAAAA', 'serial_number' => 'SN-1']);
    Asset::factory()->create(['name' => 'Genset Utama', 'barcode' => 'AST-BBBBBBB', 'serial_number' => 'SN-2']);

    $byName = $this->actingAs($admin)->get(route('backoffice.assets.index', ['search' => 'Lobi']));
    $byName->assertInertia(fn ($page) => $page->has('assets.data', 1)->where('assets.data.0.name', 'AC Split Lobi'));

    $byBarcode = $this->actingAs($admin)->get(route('backoffice.assets.index', ['search' => 'BBBBBBB']));
    $byBarcode->assertInertia(fn ($page) => $page->has('assets.data', 1)->where('assets.data.0.name', 'Genset Utama'));

    $bySerial = $this->actingAs($admin)->get(route('backoffice.assets.index', ['search' => 'SN-1']));
    $bySerial->assertInertia(fn ($page) => $page->has('assets.data', 1)->where('assets.data.0.name', 'AC Split Lobi'));
});

test('global asset list can be filtered by client independently of site and location', function () {
    $admin = User::factory()->admin()->create();
    $client = Client::factory()->create();
    $site = Site::factory()->for($client)->create();
    $location = Location::factory()->for($site)->create();
    $matching = Asset::factory()->forLocation($location)->create();
    $otherClientAsset = Asset::factory()->create();

    $response = $this->actingAs($admin)->get(route('backoffice.assets.index', ['client_id' => $client->id]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('assets.data', 1)
        ->where('assets.data.0.id', $matching->id)
    );
});

test('global asset list can be filtered by site independently of location', function () {
    $admin = User::factory()->admin()->create();
    $site = Site::factory()->create();
    $locationA = Location::factory()->for($site)->create();
    $locationB = Location::factory()->for($site)->create();
    $matchingA = Asset::factory()->forLocation($locationA)->create();
    $matchingB = Asset::factory()->forLocation($locationB)->create();
    $otherSiteAsset = Asset::factory()->create();

    $response = $this->actingAs($admin)->get(route('backoffice.assets.index', ['site_id' => $site->id]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->has('assets.data', 2));
});

test('global asset list can be filtered by location', function () {
    $admin = User::factory()->admin()->create();
    $location = Location::factory()->create();
    $matching = Asset::factory()->forLocation($location)->create();
    $otherLocationAsset = Asset::factory()->create();

    $response = $this->actingAs($admin)->get(route('backoffice.assets.index', ['location_id' => $location->id]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('assets.data', 1)
        ->where('assets.data.0.id', $matching->id)
    );
});

test('global asset list filters combine client, site, and location together', function () {
    $admin = User::factory()->admin()->create();
    $client = Client::factory()->create();
    $site = Site::factory()->for($client)->create();
    $location = Location::factory()->for($site)->create();
    $matching = Asset::factory()->forLocation($location)->create();

    $otherLocationSameSite = Location::factory()->for($site)->create();
    Asset::factory()->forLocation($otherLocationSameSite)->create();

    $response = $this->actingAs($admin)->get(route('backoffice.assets.index', [
        'client_id' => $client->id,
        'site_id' => $site->id,
        'location_id' => $location->id,
    ]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('assets.data', 1)
        ->where('assets.data.0.id', $matching->id)
    );
});

test('office staff can create an asset from the global list by picking its location', function () {
    $officeStaff = User::factory()->officeStaff()->create();
    $location = Location::factory()->create();

    // The global page's create flow resolves a location_id client-side via
    // the new search endpoints, then POSTs to the same Location-scoped
    // store endpoint ticket 04 already built — no new store endpoint.
    $response = $this->actingAs($officeStaff)->post(route('backoffice.locations.assets.store', $location), [
        'name' => 'AC Split Baru',
    ]);

    $response->assertRedirect();
    $asset = Asset::where('location_id', $location->id)->where('name', 'AC Split Baru')->first();
    expect($asset)->not->toBeNull();
    expect($asset->barcode)->toStartWith('AST-');

    $listResponse = $this->actingAs($officeStaff)->get(route('backoffice.assets.index'));
    $listResponse->assertInertia(fn ($page) => $page
        ->has('assets.data', 1)
        ->where('assets.data.0.location.id', $location->id)
        ->where('assets.data.0.location.site.id', $location->site_id)
        ->where('assets.data.0.location.site.client.id', $location->site->client_id)
    );
});

test('field staff cannot view the global asset list', function () {
    $fieldStaff = User::factory()->fieldStaff()->create();

    $this->actingAs($fieldStaff)
        ->get(route('backoffice.assets.index'))
        ->assertForbidden();
});
