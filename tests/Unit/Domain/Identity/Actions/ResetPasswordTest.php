<?php

use App\Domain\Identity\Actions\ResetPassword;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

test('updates the password and rotates the remember token for a valid token', function () {
    $user = User::factory()->admin()->create();
    $token = Password::createToken($user);
    $originalRememberToken = $user->remember_token;

    (new ResetPassword)->handle($token, $user->email, 'new-password');

    $user->refresh();

    expect(Hash::check('new-password', $user->password))->toBeTrue();
    expect($user->remember_token)->not->toBe($originalRememberToken);
});

test('throws a validation exception for an invalid token', function () {
    $user = User::factory()->admin()->create();

    (new ResetPassword)->handle('invalid-token', $user->email, 'new-password');
})->throws(ValidationException::class);
