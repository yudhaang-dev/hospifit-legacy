<?php

use App\Domain\Client\ClientStatus;
use App\Models\Client;
use App\Models\User;

test('admin can list clients', function () {
    $admin = User::factory()->admin()->create();
    $client = Client::factory()->create();

    $response = $this->actingAs($admin)->get(route('backoffice.clients.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('backoffice/client/index')
        ->has('clients', 1)
        ->where('clients.0.id', $client->id)
    );
});

test('office staff can create a client', function () {
    $officeStaff = User::factory()->officeStaff()->create();

    $response = $this->actingAs($officeStaff)->post(route('backoffice.clients.store'), [
        'name' => 'RS Sehat Sentosa',
        'status' => 'active',
    ]);

    $response->assertRedirect();
    expect(Client::where('name', 'RS Sehat Sentosa')->exists())->toBeTrue();
});

test('admin can update a client', function () {
    $admin = User::factory()->admin()->create();
    $client = Client::factory()->create(['status' => ClientStatus::Active]);

    $response = $this->actingAs($admin)->put(route('backoffice.clients.update', $client), [
        'name' => 'Nama Baru',
        'status' => 'inactive',
    ]);

    $response->assertRedirect();
    expect($client->refresh())
        ->name->toBe('Nama Baru')
        ->status->toBe(ClientStatus::Inactive);
});

test('creating a client without a name fails validation', function () {
    $admin = User::factory()->admin()->create();

    $response = $this->actingAs($admin)->post(route('backoffice.clients.store'), [
        'status' => 'active',
    ]);

    $response->assertSessionHasErrors('name');
    expect(Client::count())->toBe(0);
});

test('field staff cannot manage clients', function () {
    $fieldStaff = User::factory()->fieldStaff()->create();

    $this->actingAs($fieldStaff)->get(route('backoffice.clients.index'))->assertForbidden();
});

test('client staff cannot manage clients', function () {
    $client = Client::factory()->create();
    $clientStaff = User::factory()->clientStaff($client)->create();

    $this->actingAs($clientStaff)->get(route('backoffice.clients.index'))->assertForbidden();
});
