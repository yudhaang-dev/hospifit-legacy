<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('guest cannot update the password', function () {
    $this->put(route('settings.password.update'), [
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])->assertRedirect(route('login'));
});

test('an unconfirmed session cannot update the password', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->put(route('settings.password.update'), [
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertRedirect(route('password.confirm'));
});

test('a confirmed session can update the password', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->put(route('settings.password.update'), [
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    expect(Hash::check('new-password', $user->fresh()->password))->toBeTrue();
});

// Note: end-to-end "other active sessions get invalidated" coverage would need two
// live sessions running concurrently, which a single Pest test client can't simulate.
// That behavior comes from the app-wide `authenticateSessions()` middleware (added in
// bootstrap/app.php) comparing the session's stored password hash against the user's
// current one on every request — it isn't specific to this action, so it isn't
// re-verified per-feature here.
