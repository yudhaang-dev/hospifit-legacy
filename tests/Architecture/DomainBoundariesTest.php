<?php

use Illuminate\Support\Facades\File;

/*
|--------------------------------------------------------------------------
| Domain boundary guard rail
|--------------------------------------------------------------------------
|
| Per ARCHITECTURE.md §3, business logic lives per bounded context under
| app/Domain/{Context}. One context's classes must never reach directly
| into another context's internals, and the domain layer must never reach
| up into the HTTP layer. Only the Identity context exists today, so these
| rules are self-proving now — they exist to catch drift the moment the
| next domain (Client, Asset, Contract, ...) is added.
|
*/

$contexts = collect(File::directories(app_path('Domain')))
    ->map(fn (string $path) => basename($path));

foreach ($contexts as $context) {
    $others = $contexts->reject(fn (string $other) => $other === $context);

    if ($others->isEmpty()) {
        continue;
    }

    arch("Domain\\{$context} does not depend on other domain contexts")
        ->expect("App\\Domain\\{$context}")
        ->not->toUse($others->map(fn (string $other) => "App\\Domain\\{$other}")->all());
}

arch('the domain layer does not depend on the HTTP layer')
    ->expect('App\Domain')
    ->not->toUse('App\Http');
