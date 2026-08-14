<?php

use App\Domain\Client\ClientStatus;
use App\Models\Client;
use App\Models\Site;
use App\Models\User;

test('admin can list clients', function () {
    $admin = User::factory()->admin()->create();
    $client = Client::factory()->create();

    $response = $this->actingAs($admin)->get(route('backoffice.clients.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('backoffice/client/index')
        ->has('clients.data', 1)
        ->where('clients.data.0.id', $client->id)
    );
});

test('client index is paginated', function () {
    $admin = User::factory()->admin()->create();
    Client::factory()->count(16)->create();

    $response = $this->actingAs($admin)->get(route('backoffice.clients.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('clients.total', 16)
        ->where('clients.per_page', 15)
        ->has('clients.data', 15)
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

test('client index can be searched by name', function () {
    $admin = User::factory()->admin()->create();
    Client::factory()->create(['name' => 'RS Sehat Sentosa']);
    Client::factory()->create(['name' => 'Klinik Bahagia']);

    $response = $this->actingAs($admin)->get(route('backoffice.clients.index', ['search' => 'Sehat']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('clients.data', 1)
        ->where('clients.data.0.name', 'RS Sehat Sentosa')
    );
});

test('client index can be sorted by name descending', function () {
    $admin = User::factory()->admin()->create();
    Client::factory()->create(['name' => 'Aaa']);
    Client::factory()->create(['name' => 'Zzz']);

    $response = $this->actingAs($admin)->get(route('backoffice.clients.index', [
        'sort' => 'name',
        'direction' => 'desc',
    ]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('clients.data.0.name', 'Zzz')
        ->where('clients.data.1.name', 'Aaa')
    );
});

test('client index page length can be changed', function () {
    $admin = User::factory()->admin()->create();
    Client::factory()->count(12)->create();

    $response = $this->actingAs($admin)->get(route('backoffice.clients.index', ['per_page' => 10]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('clients.per_page', 10)
        ->has('clients.data', 10)
    );
});

test('admin can delete an empty client', function () {
    $admin = User::factory()->admin()->create();
    $client = Client::factory()->create();

    $response = $this->actingAs($admin)->delete(route('backoffice.clients.destroy', $client));

    $response->assertRedirect();
    expect(Client::find($client->id))->toBeNull();
});

test('deleting a client with a site is blocked', function () {
    $admin = User::factory()->admin()->create();
    $client = Client::factory()->create();
    Site::factory()->for($client)->create();

    $response = $this->actingAs($admin)->delete(route('backoffice.clients.destroy', $client));

    $response->assertRedirect();
    expect(Client::find($client->id))->not->toBeNull();
});

test('deleting a client with a user is blocked', function () {
    $admin = User::factory()->admin()->create();
    $client = Client::factory()->create();
    User::factory()->clientAdmin($client)->create();

    $response = $this->actingAs($admin)->delete(route('backoffice.clients.destroy', $client));

    $response->assertRedirect();
    expect(Client::find($client->id))->not->toBeNull();
});

test('admin can bulk update client status', function () {
    $admin = User::factory()->admin()->create();
    $clients = Client::factory()->count(3)->create(['status' => ClientStatus::Active]);

    $response = $this->actingAs($admin)->patch(route('backoffice.clients.bulk-status'), [
        'ids' => $clients->pluck('id')->all(),
        'status' => 'inactive',
    ]);

    $response->assertRedirect();
    expect(Client::where('status', ClientStatus::Inactive)->count())->toBe(3);
});

test('admin can bulk delete clients with a mix of deletable and blocked clients', function () {
    $admin = User::factory()->admin()->create();
    $deletable = Client::factory()->create();
    $blocked = Client::factory()->create();
    Site::factory()->for($blocked)->create();

    $response = $this->actingAs($admin)->delete(route('backoffice.clients.bulk-destroy'), [
        'ids' => [$deletable->id, $blocked->id],
    ]);

    $response->assertRedirect();
    expect(Client::find($deletable->id))->toBeNull();
    expect(Client::find($blocked->id))->not->toBeNull();
});
