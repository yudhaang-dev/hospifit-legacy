<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Renders the client's own Client record via the scoping mechanism —
     * proves criterion 7 (client-scoping) visually alongside the API-style
     * ClientController::index() proof.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('portal/identity/dashboard', [
            'clients' => Client::visibleTo($request->user())->get(),
        ]);
    }
}
