<?php

namespace App\Http\Controllers\Identity;

use App\Domain\Identity\Actions\UpdatePassword;
use App\Http\Controllers\Controller;
use App\Http\Requests\Identity\UpdatePasswordRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;

class PasswordController extends Controller
{
    /**
     * Update the current user's password.
     */
    public function update(UpdatePasswordRequest $request, UpdatePassword $updatePassword): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $updatePassword->handle($user, $request->string('password')->toString());

        return back()->with('success', __('Kata sandi Anda berhasil diperbarui.'));
    }
}
