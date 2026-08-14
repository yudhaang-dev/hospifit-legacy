<?php

use App\Models\Client;
use App\Models\User;

test('admin is redirected to backoffice after login', function () {
    $user = User::factory()->admin()->create();

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('backoffice.dashboard'));
});

test('office staff is redirected to backoffice after login', function () {
    $user = User::factory()->officeStaff()->create();

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('backoffice.dashboard'));
});

test('field staff is redirected to field after login', function () {
    $user = User::factory()->fieldStaff()->create();

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('field.today'));
});

test('client admin is redirected to portal after login', function () {
    $client = Client::factory()->create();
    $user = User::factory()->clientAdmin($client)->create();

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('portal.dashboard'));
});

test('client staff is redirected to portal after login', function () {
    $client = Client::factory()->create();
    $user = User::factory()->clientStaff($client)->create();

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('portal.dashboard'));
});
