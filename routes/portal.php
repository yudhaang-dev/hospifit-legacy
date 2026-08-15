<?php

use App\Http\Controllers\Portal\ClientController;
use App\Http\Controllers\Portal\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:client_admin,client_staff'])
    ->prefix('portal')
    ->name('portal.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
    });
