<?php

use App\Models\User;

test('logout invalidates the session and blocks further access', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->post(route('logout'))
        ->assertRedirect(route('login'));

    $this->get('/backoffice')->assertRedirect(route('login'));
});
