<?php

use App\Models\Client;
use App\Models\User;

test('admin can reach the security settings page once confirmed', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('settings.security'))
        ->assertOk();
});

test('field staff can reach the security settings page once confirmed', function () {
    $user = User::factory()->fieldStaff()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('settings.security'))
        ->assertOk();
});

test('client admin can reach the security settings page once confirmed', function () {
    $client = Client::factory()->create();
    $user = User::factory()->clientAdmin($client)->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('settings.security'))
        ->assertOk();
});

test('the passkeys prop lists a registered passkey without leaking its credential', function () {
    $user = User::factory()->admin()->create();
    $passkey = $user->passkeys()->create([
        'name' => 'Laptop Kantor',
        'credential_id' => 'test-credential-id',
        'credential' => ['type' => 'public-key'],
    ]);

    $response = $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('settings.security'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('passkeys', 1)
        ->where('passkeys.0.id', $passkey->id)
        ->where('passkeys.0.name', 'Laptop Kantor')
        ->missing('passkeys.0.credential')
        ->missing('passkeys.0.credential_id'));
});
