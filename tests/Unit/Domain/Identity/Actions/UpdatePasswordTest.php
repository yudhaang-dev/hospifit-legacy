<?php

use App\Domain\Identity\Actions\UpdatePassword;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('hashes and saves the new password', function () {
    $user = User::factory()->admin()->create();

    (new UpdatePassword)->handle($user, 'brand-new-password');

    expect(Hash::check('brand-new-password', $user->fresh()->password))->toBeTrue();
});
