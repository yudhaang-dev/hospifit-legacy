<?php

namespace App\Notifications\Identity;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Queued variant of Laravel's stock verification-link notification, so sending it
 * doesn't block the HTTP request on the SMTP round-trip — matches this app's
 * `QUEUE_CONNECTION=database` setup (see `composer dev`'s queue worker).
 *
 * The Indonesian mail copy registered via `VerifyEmail::toMailUsing(...)` in
 * `AppServiceProvider` still applies here: `$toMailCallback` is inherited static
 * storage, not redeclared on this subclass.
 */
class QueuedVerifyEmail extends VerifyEmail implements ShouldQueue
{
    use Queueable;
}
