<?php

use App\Models\Client;
use App\Models\Location;
use App\Models\Site;
use App\Models\User;

test('admin can view a client with its sites', function () {
    $admin = User::factory()->admin()->create();
    $client = Client::factory()->create();
    $site = Site::factory()->for($client)->create();

    $response = $this->actingAs($admin)->get(route('backoffice.clients.show', $client));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('backoffice/client/show')
        ->where('client.id', $client->id)
        ->has('sites.data', 1)
        ->where('sites.data.0.id', $site->id)
    );
});

test('site list within a client is paginated', function () {
    $admin = User::factory()->admin()->create();
    $client = Client::factory()->create();
    Site::factory()->count(16)->for($client)->create();

    $response = $this->actingAs($admin)->get(route('backoffice.clients.show', $client));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('sites.total', 16)
        ->has('sites.data', 15)
    );
});

test('office staff can create a site under a client', function () {
    $officeStaff = User::factory()->officeStaff()->create();
    $client = Client::factory()->create();

    $response = $this->actingAs($officeStaff)->post(route('backoffice.clients.sites.store', $client), [
        'name' => 'Gedung Utama',
        'address' => 'Jl. Sehat No. 1',
        'latitude' => -6.2,
        'longitude' => 106.8,
        'geofence_radius_m' => 100,
    ]);

    $response->assertRedirect();
    expect(Site::where('client_id', $client->id)->where('name', 'Gedung Utama')->exists())->toBeTrue();
});

test('a site cannot be created without an existing parent client', function () {
    $officeStaff = User::factory()->officeStaff()->create();

    $response = $this->actingAs($officeStaff)->post(route('backoffice.clients.sites.store', ['client' => 999999]), [
        'name' => 'Gedung Utama',
        'latitude' => -6.2,
        'longitude' => 106.8,
        'geofence_radius_m' => 100,
    ]);

    $response->assertNotFound();
    expect(Site::count())->toBe(0);
});

test('admin can update a site', function () {
    $admin = User::factory()->admin()->create();
    $site = Site::factory()->create();

    $response = $this->actingAs($admin)->put(route('backoffice.sites.update', $site), [
        'name' => 'Gedung Baru',
        'address' => $site->address,
        'latitude' => $site->latitude,
        'longitude' => $site->longitude,
        'geofence_radius_m' => 250,
    ]);

    $response->assertRedirect();
    expect($site->refresh())
        ->name->toBe('Gedung Baru')
        ->geofence_radius_m->toBe(250);
});

test('creating a site without required geofence fields fails validation', function () {
    $officeStaff = User::factory()->officeStaff()->create();
    $client = Client::factory()->create();

    $response = $this->actingAs($officeStaff)->post(route('backoffice.clients.sites.store', $client), [
        'name' => 'Gedung Utama',
    ]);

    $response->assertSessionHasErrors(['latitude', 'longitude', 'geofence_radius_m']);
    expect(Site::count())->toBe(0);
});

test('field staff cannot manage sites', function () {
    $fieldStaff = User::factory()->fieldStaff()->create();
    $client = Client::factory()->create();

    $this->actingAs($fieldStaff)
        ->post(route('backoffice.clients.sites.store', $client), [])
        ->assertForbidden();
});

test('site list within a client can be searched by name', function () {
    $admin = User::factory()->admin()->create();
    $client = Client::factory()->create();
    Site::factory()->for($client)->create(['name' => 'Gedung Utama']);
    Site::factory()->for($client)->create(['name' => 'Gedung Timur']);

    $response = $this->actingAs($admin)->get(route('backoffice.clients.show', [
        'client' => $client,
        'search' => 'Utama',
    ]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('sites.data', 1)
        ->where('sites.data.0.name', 'Gedung Utama')
    );
});

test('site list within a client can be sorted by geofence radius descending', function () {
    $admin = User::factory()->admin()->create();
    $client = Client::factory()->create();
    Site::factory()->for($client)->create(['geofence_radius_m' => 50]);
    Site::factory()->for($client)->create(['geofence_radius_m' => 200]);

    $response = $this->actingAs($admin)->get(route('backoffice.clients.show', [
        'client' => $client,
        'sort' => 'geofence_radius_m',
        'direction' => 'desc',
    ]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('sites.data.0.geofence_radius_m', 200)
        ->where('sites.data.1.geofence_radius_m', 50)
    );
});

test('site list within a client page length can be changed', function () {
    $admin = User::factory()->admin()->create();
    $client = Client::factory()->create();
    Site::factory()->count(12)->for($client)->create();

    $response = $this->actingAs($admin)->get(route('backoffice.clients.show', [
        'client' => $client,
        'per_page' => 10,
    ]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('sites.per_page', 10)
        ->has('sites.data', 10)
    );
});

test('admin can delete a site', function () {
    $admin = User::factory()->admin()->create();
    $site = Site::factory()->create();

    $response = $this->actingAs($admin)->delete(route('backoffice.sites.destroy', $site));

    $response->assertRedirect();
    expect(Site::find($site->id))->toBeNull();
});

test('admin can bulk delete sites', function () {
    $admin = User::factory()->admin()->create();
    $client = Client::factory()->create();
    $sites = Site::factory()->count(3)->for($client)->create();

    $response = $this->actingAs($admin)->delete(route('backoffice.sites.bulk-destroy'), [
        'ids' => $sites->pluck('id')->all(),
    ]);

    $response->assertRedirect();
    expect(Site::whereIn('id', $sites->pluck('id'))->count())->toBe(0);
});

test('field staff cannot delete sites', function () {
    $fieldStaff = User::factory()->fieldStaff()->create();
    $site = Site::factory()->create();

    $this->actingAs($fieldStaff)
        ->delete(route('backoffice.sites.destroy', $site))
        ->assertForbidden();

    expect(Site::find($site->id))->not->toBeNull();
});

test('deleting a site with a location is blocked', function () {
    $admin = User::factory()->admin()->create();
    $site = Site::factory()->create();
    Location::factory()->for($site)->create();

    $response = $this->actingAs($admin)->delete(route('backoffice.sites.destroy', $site));

    $response->assertRedirect();
    expect(Site::find($site->id))->not->toBeNull();
});

test('admin can view a site with its location tree', function () {
    $admin = User::factory()->admin()->create();
    $site = Site::factory()->create();
    $building = Location::factory()->for($site)->create(['type' => 'building', 'name' => 'Gedung A']);
    $room = Location::factory()->childOf($building)->create(['type' => 'room', 'name' => 'Ruang 101']);

    $response = $this->actingAs($admin)->get(route('backoffice.sites.show', $site));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('backoffice/site/show')
        ->where('site.id', $site->id)
        ->has('locations', 2)
        ->where('locations.0.id', $building->id)
        ->where('locations.0.depth', 0)
        ->where('locations.1.id', $room->id)
        ->where('locations.1.depth', 1)
    );
});
