<?php

use App\Models\User;

test('field staff cannot access backoffice', function () {
    $user = User::factory()->fieldStaff()->create();

    $this->actingAs($user)->get('/backoffice')->assertForbidden();
});

test('office staff cannot access field', function () {
    $user = User::factory()->officeStaff()->create();

    $this->actingAs($user)->get('/field')->assertForbidden();
});

test('client staff cannot access backoffice', function () {
    $user = User::factory()->clientStaff()->create();

    $this->actingAs($user)->get('/backoffice')->assertForbidden();
});

test('admin cannot access the client portal', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)->get('/portal')->assertForbidden();
});
