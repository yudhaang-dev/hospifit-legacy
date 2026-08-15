<?php

namespace App\Providers;

use App\Domain\Asset\Policies\AssetPolicy;
use App\Domain\Asset\Policies\AssetTypePolicy;
use App\Domain\Client\Policies\ClientPolicy;
use App\Domain\Client\Policies\LocationPolicy;
use App\Domain\Client\Policies\SitePolicy;
use App\Domain\Identity\Http\Responses\PasskeyLoginResponse;
use App\Models\Asset;
use App\Models\AssetType;
use App\Models\Client;
use App\Models\Location;
use App\Models\Site;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Laravel\Passkeys\Contracts\PasskeyLoginResponse as PasskeyLoginResponseContract;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(PasskeyLoginResponseContract::class, PasskeyLoginResponse::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configurePolicies();
        $this->configureAuthNotifications();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Register authorization policies (no dedicated AuthServiceProvider in Laravel 13).
     */
    protected function configurePolicies(): void
    {
        Gate::policy(Client::class, ClientPolicy::class);
        Gate::policy(Site::class, SitePolicy::class);
        Gate::policy(Location::class, LocationPolicy::class);
        Gate::policy(Asset::class, AssetPolicy::class);
        Gate::policy(AssetType::class, AssetTypePolicy::class);
    }

    /**
     * Localize the built-in email-verification and password-reset notifications to Indonesian.
     */
    protected function configureAuthNotifications(): void
    {
        VerifyEmail::toMailUsing(function (User $notifiable, string $url): MailMessage {
            return (new MailMessage)
                ->subject('Verifikasi Alamat Email')
                ->line('Klik tombol di bawah untuk memverifikasi alamat email Anda.')
                ->action('Verifikasi Email', $url)
                ->line('Jika Anda tidak membuat akun ini, abaikan email ini.');
        });

        ResetPassword::toMailUsing(function (User $notifiable, string $token): MailMessage {
            $url = route('password.reset', [
                'token' => $token,
                'email' => $notifiable->email,
            ]);

            return (new MailMessage)
                ->subject('Reset Kata Sandi')
                ->line('Anda menerima email ini karena kami menerima permintaan reset kata sandi untuk akun Anda.')
                ->action('Reset Kata Sandi', $url)
                ->line('Tautan reset kata sandi ini akan kedaluwarsa dalam 60 menit.')
                ->line('Jika Anda tidak meminta reset kata sandi, abaikan email ini.');
        });
    }
}
