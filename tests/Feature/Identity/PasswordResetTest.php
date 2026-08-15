<?php

use App\Models\User;
use App\Notifications\Identity\QueuedResetPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;

test('forgot password page is reachable by guests', function () {
    $this->get(route('password.request'))->assertOk();
});

test('requesting a reset link for an existing email sends a notification', function () {
    Notification::fake();

    $user = User::factory()->admin()->create();

    $this->post(route('password.email'), ['email' => $user->email])
        ->assertRedirect()
        ->assertSessionHas('success');

    Notification::assertSentTo($user, QueuedResetPassword::class);
});

test('requesting a reset link for a non-existent email gets the same generic response', function () {
    Notification::fake();

    $this->post(route('password.email'), ['email' => 'nobody@example.com'])
        ->assertRedirect()
        ->assertSessionHas('success')
        ->assertSessionDoesntHaveErrors();

    Notification::assertNothingSent();
});

test('reset password page is reachable with a token', function () {
    $user = User::factory()->admin()->create();
    $token = Password::createToken($user);

    $this->get(route('password.reset', ['token' => $token, 'email' => $user->email]))
        ->assertOk();
});

test('valid token resets the password and invalidates other sessions', function () {
    $user = User::factory()->admin()->create();
    $token = Password::createToken($user);

    $this->post(route('password.store'), [
        'token' => $token,
        'email' => $user->email,
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])->assertRedirect(route('login'));

    $user->refresh();

    expect(Hash::check('new-password', $user->password))->toBeTrue();
    expect($user->remember_token)->not->toBeNull();

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'new-password'])
        ->assertRedirect(route('backoffice.dashboard'));
});

test('expired or invalid token is rejected', function () {
    $user = User::factory()->admin()->create();

    $this->post(route('password.store'), [
        'token' => 'invalid-token',
        'email' => $user->email,
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])->assertSessionHasErrors('email');
});
