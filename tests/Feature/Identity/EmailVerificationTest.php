<?php

use App\Models\User;
use App\Notifications\Identity\QueuedVerifyEmail;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;

test('unverified user is blocked from backoffice', function () {
    $user = User::factory()->admin()->unverified()->create();

    $this->actingAs($user)
        ->get('/backoffice')
        ->assertRedirect(route('verification.notice'));
});

test('unverified user is blocked from field', function () {
    $user = User::factory()->fieldStaff()->unverified()->create();

    $this->actingAs($user)
        ->get('/field')
        ->assertRedirect(route('verification.notice'));
});

test('unverified user is blocked from the client portal', function () {
    $user = User::factory()->clientAdmin()->unverified()->create();

    $this->actingAs($user)
        ->get('/portal')
        ->assertRedirect(route('verification.notice'));
});

test('unverified user sees the verification prompt page', function () {
    $user = User::factory()->admin()->unverified()->create();

    $this->actingAs($user)
        ->get(route('verification.notice'))
        ->assertOk();
});

test('verified user is redirected away from the verification prompt', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route('verification.notice'))
        ->assertRedirect(route('backoffice.dashboard'));
});

test('valid signed link verifies the email and redirects to the correct area', function () {
    Event::fake();

    $user = User::factory()->admin()->unverified()->create();

    $url = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)],
    );

    $this->actingAs($user)
        ->get($url)
        ->assertRedirect(route('backoffice.dashboard'));

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();

    Event::assertDispatched(Verified::class);
});

test('tampered verification link is rejected', function () {
    $user = User::factory()->admin()->unverified()->create();

    $url = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1('wrong-email@example.com')],
    );

    $this->actingAs($user)->get($url)->assertForbidden();

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

test('expired verification link is rejected', function () {
    $user = User::factory()->admin()->unverified()->create();

    $url = URL::temporarySignedRoute(
        'verification.verify',
        now()->subMinutes(1),
        ['id' => $user->id, 'hash' => sha1($user->email)],
    );

    $this->actingAs($user)->get($url)->assertForbidden();

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

test('unverified user can resend the verification email', function () {
    Notification::fake();

    $user = User::factory()->admin()->unverified()->create();

    $this->actingAs($user)
        ->post(route('verification.send'))
        ->assertRedirect();

    Notification::assertSentTo($user, QueuedVerifyEmail::class);
});

test('verified user logging in again is never re-prompted', function () {
    $user = User::factory()->admin()->create();

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('backoffice.dashboard'));
});
