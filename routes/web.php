<?php

use App\Http\Controllers\Identity\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

Route::middleware('auth')->post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

require __DIR__.'/backoffice.php';
require __DIR__.'/field.php';
require __DIR__.'/portal.php';
