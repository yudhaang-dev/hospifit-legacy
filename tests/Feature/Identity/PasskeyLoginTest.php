<?php

use App\Models\User;

test('guest can fetch passkey login options', function () {
    $this->get(route('passkey.login-options'))
        ->assertOk()
        ->assertJsonStructure(['options']);
});

test('authenticated user cannot reach the guest-only passkey login options route', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route('passkey.login-options'))
        ->assertRedirect();
});

test('an unrecognized passkey credential is rejected with a clear failure', function () {
    $this->withSession(['passkey.verification_options' => '{}'])
        ->postJson(route('passkey.login'), [
            'credential' => [
                'id' => 'unknown-credential-id',
                'rawId' => 'dW5rbm93bg',
                'type' => 'public-key',
                'response' => [
                    'clientDataJSON' => 'e30',
                    'authenticatorData' => 'AA',
                    'signature' => 'AA',
                ],
            ],
        ])->assertStatus(422);
});
