<?php

use App\Http\Controllers\Field\TodayController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:field_staff'])
    ->prefix('field')
    ->name('field.')
    ->group(function () {
        Route::get('/', [TodayController::class, 'index'])->name('today');
    });
