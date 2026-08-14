<?php

use App\Models\Client;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

test('client admin only sees their own client in the scoped listing', function () {
    $clientA = Client::factory()->create();
    $clientB = Client::factory()->create();
    $user = User::factory()->clientAdmin($clientA)->create();

    $response = $this->actingAs($user)->get(route('portal.clients.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('clients', 1)
        ->where('clients.0.id', $clientA->id)
    );
});

test('client policy denies viewing another client', function () {
    $clientA = Client::factory()->create();
    $clientB = Client::factory()->create();
    $user = User::factory()->clientAdmin($clientA)->create();

    expect(Gate::forUser($user)->denies('view', $clientB))->toBeTrue();
    expect(Gate::forUser($user)->allows('view', $clientA))->toBeTrue();
});
