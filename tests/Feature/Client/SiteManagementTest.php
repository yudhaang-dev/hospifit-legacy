<?php

use App\Models\Client;
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
        ->has('sites', 1)
        ->where('sites.0.id', $site->id)
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
