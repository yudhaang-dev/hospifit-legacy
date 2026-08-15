<?php

namespace App\Notifications\Identity;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Queued variant of Laravel's stock password-reset-link notification, so sending it
 * doesn't block the HTTP request on the SMTP round-trip — matches this app's
 * `QUEUE_CONNECTION=database` setup (see `composer dev`'s queue worker).
 *
 * The Indonesian mail copy registered via `ResetPassword::toMailUsing(...)` in
 * `AppServiceProvider` still applies here: `$toMailCallback` is inherited static
 * storage, not redeclared on this subclass.
 */
class QueuedResetPassword extends ResetPassword implements ShouldQueue
{
    use Queueable;
}
