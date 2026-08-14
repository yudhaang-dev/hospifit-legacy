<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * List the client(s) visible to the current user — proves the
     * client-scoping mechanism end to end (see Client::scopeVisibleTo()).
     */
    public function index(Request $request): Response
    {
        return Inertia::render('portal/identity/dashboard', [
            'clients' => Client::visibleTo($request->user())->get(),
        ]);
    }
}
