<?php

use App\Http\Controllers\Backoffice\ClientController;
use App\Http\Controllers\Backoffice\DashboardController;
use App\Http\Controllers\Backoffice\SiteController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin,office_staff'])
    ->prefix('backoffice')
    ->name('backoffice.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
        Route::post('clients', [ClientController::class, 'store'])->name('clients.store');
        Route::get('clients/{client}', [ClientController::class, 'show'])->name('clients.show');
        Route::put('clients/{client}', [ClientController::class, 'update'])->name('clients.update');

        Route::post('clients/{client}/sites', [SiteController::class, 'store'])->name('clients.sites.store');
        Route::put('sites/{site}', [SiteController::class, 'update'])->name('sites.update');
    });
