<?php

use App\Models\User;

test('confirm password page is reachable by an authenticated user', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route('password.confirm'))
        ->assertOk();
});

test('wrong password does not confirm the session', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->post('/confirm-password', ['password' => 'wrong-password'])
        ->assertSessionHasErrors('password');

    $this->assertNull(session('auth.password_confirmed_at'));
});

test('correct password confirms the session and redirects to the intended area', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->post('/confirm-password', ['password' => 'password'])
        ->assertRedirect(route('backoffice.dashboard'));

    $this->assertNotNull(session('auth.password_confirmed_at'));
});

test('sensitive settings routes redirect to the confirm-password page without a confirmed session', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route('settings.security'))
        ->assertRedirect(route('password.confirm'));
});

test('sensitive settings routes are reachable once the session is confirmed', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->get(route('settings.security'))
        ->assertOk();
});
