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

        // Bulk routes must be registered before the `clients/{client}` wildcard
        // routes below, otherwise Laravel would try to resolve "bulk-status"/
        // "bulk-delete" as a {client} route-model-binding value and 404.
        Route::patch('clients/bulk-status', [ClientController::class, 'bulkUpdateStatus'])->name('clients.bulk-status');
        Route::delete('clients/bulk-delete', [ClientController::class, 'bulkDestroy'])->name('clients.bulk-destroy');

        Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
        Route::post('clients', [ClientController::class, 'store'])->name('clients.store');
        Route::get('clients/{client}', [ClientController::class, 'show'])->name('clients.show');
        Route::put('clients/{client}', [ClientController::class, 'update'])->name('clients.update');
        Route::delete('clients/{client}', [ClientController::class, 'destroy'])->name('clients.destroy');

        Route::post('clients/{client}/sites', [SiteController::class, 'store'])->name('clients.sites.store');
        Route::put('sites/{site}', [SiteController::class, 'update'])->name('sites.update');
    });
