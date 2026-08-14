<?php

namespace App\Http\Controllers\Field;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class TodayController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('field/identity/today');
    }
}
