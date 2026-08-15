<?php

use App\Domain\Identity\Http\Responses\PasskeyLoginResponse;
use App\Models\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Passkeys\Contracts\PasskeyLoginResponse as PasskeyLoginResponseContract;

test('the passkeys package resolves the app response implementation', function () {
    expect(app(PasskeyLoginResponseContract::class))->toBeInstanceOf(PasskeyLoginResponse::class);
});

test('admin lands in backoffice after a passkey login', function () {
    Auth::login(User::factory()->admin()->create());

    $response = app(PasskeyLoginResponse::class)->toResponse(Request::create('/passkeys/login', 'POST'));

    expect($response->headers->get('Location'))->toBe(route('backoffice.dashboard'));
});

test('field staff lands in field after a passkey login', function () {
    Auth::login(User::factory()->fieldStaff()->create());

    $response = app(PasskeyLoginResponse::class)->toResponse(Request::create('/passkeys/login', 'POST'));

    expect($response->headers->get('Location'))->toBe(route('field.today'));
});

test('client admin lands in the portal after a passkey login', function () {
    Auth::login(User::factory()->clientAdmin(Client::factory()->create())->create());

    $response = app(PasskeyLoginResponse::class)->toResponse(Request::create('/passkeys/login', 'POST'));

    expect($response->headers->get('Location'))->toBe(route('portal.dashboard'));
});

test('a JSON request gets the redirect target in the response body', function () {
    Auth::login(User::factory()->admin()->create());

    $request = Request::create('/passkeys/login', 'POST');
    $request->headers->set('Accept', 'application/json');

    $response = app(PasskeyLoginResponse::class)->toResponse($request);

    expect($response->getData(true))->toBe(['redirect' => route('backoffice.dashboard')]);
});
