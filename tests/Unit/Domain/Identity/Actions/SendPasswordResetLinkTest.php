<?php

use App\Domain\Identity\Actions\SendPasswordResetLink;
use App\Models\User;
use App\Notifications\Identity\QueuedResetPassword;
use Illuminate\Support\Facades\Notification;

test('sends a reset-link notification when the account exists', function () {
    Notification::fake();

    $user = User::factory()->admin()->create();

    (new SendPasswordResetLink)->handle($user->email);

    Notification::assertSentTo($user, QueuedResetPassword::class);
});

test('does nothing observable when the account does not exist', function () {
    Notification::fake();

    (new SendPasswordResetLink)->handle('nobody@example.com');

    Notification::assertNothingSent();
});
