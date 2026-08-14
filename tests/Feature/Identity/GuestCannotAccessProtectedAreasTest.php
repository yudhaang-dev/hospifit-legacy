<?php

test('guest is redirected to login from backoffice', function () {
    $this->get('/backoffice')->assertRedirect(route('login'));
});

test('guest is redirected to login from field', function () {
    $this->get('/field')->assertRedirect(route('login'));
});

test('guest is redirected to login from the client portal', function () {
    $this->get('/portal')->assertRedirect(route('login'));
});
