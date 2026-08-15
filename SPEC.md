# Auth: Email Verification, Forgot Password, Passkey Login

## Problem Statement

Hospifit's login only supports email + password today. Users who forget their password have no
self-service recovery path — an operator would have to intervene manually. New accounts are
never confirmed as reachable, so a mistyped or defunct email silently breaks all future
notifications with no warning. And there's no passwordless, phishing-resistant login option,
which both reduces password-related support load and matches what staff and client users
increasingly expect from modern apps — the login page already has a disabled "Masuk dengan
Passkey" placeholder signaling this was anticipated but never built.

## Solution

Add three self-service capabilities to the existing session-based login: (1) email verification
that gates access to all three application areas (backoffice/field/portal) until a user confirms
their address via a signed emailed link; (2) a "Lupa kata sandi?" self-service password reset
flow via emailed link; (3) passkey (WebAuthn) login as an alternative to password entry, built on
Laravel's first-party `laravel/passkeys` package, wired into the existing login form's
placeholder button.

## User Stories

1. As a newly registered user, I want to receive a verification email after my account is
   created, so that I can confirm my email address is correct and reachable.
2. As an unverified user, I want to be blocked from every application area (backoffice, field,
   portal), so that access is only granted once my contact email is confirmed.
3. As an unverified user, I want a clear "verifikasi email Anda" page shown when I try to reach
   my dashboard, so that I understand why I'm blocked instead of seeing a generic error.
4. As an unverified user, I want to resend the verification email if I didn't receive it, so
   that I'm not stuck waiting indefinitely.
5. As an unverified user attempting to resend, I want the action rate-limited, so the system
   can't be abused to spam my (or someone else's) inbox.
6. As a verified user, I want subsequent logins to skip the verification gate entirely, so I'm
   never re-prompted once confirmed.
7. As any user following an expired or tampered verification link, I want a clear rejection
   rather than silent success, so my account can't be verified fraudulently.
8. As a user of any role (Admin, OfficeStaff, FieldStaff, ClientAdmin, ClientStaff), I want the
   verification requirement applied identically regardless of role, so the policy is predictable
   app-wide.
9. As a user who forgot my password, I want a "Lupa kata sandi?" link on the login page, so I
   can discover the recovery flow without contacting support.
10. As a user requesting a reset, I want to submit my email and receive a reset link if an
    account exists for it, so I can regain access without support intervention.
11. As a visitor submitting an email that has no account, I want the same generic response as a
    valid request, so the flow doesn't reveal which emails have registered accounts.
12. As a user following a valid reset link, I want to set a new password that meets the app's
    existing password-complexity policy, so my account stays consistently secure.
13. As a user following an expired reset link, I want a clear rejection with an option to
    request a new one, so I'm not stuck on a dead link.
14. As a user who successfully resets my password, I want any other active sessions for my
    account invalidated, so a potentially compromised session/device is cut off immediately.
15. As a user who successfully resets my password, I want to land back at the login page ready
    to sign in with my new credentials, so the flow has a clear, unambiguous end state.
16. As a user with a registered passkey on my current device, I want to tap "Masuk dengan
    Passkey" and authenticate without typing a password, so login is faster and phishing-resistant.
17. As a user without a registered passkey attempting passkey login, I want a clear failure
    message rather than a silent dead end, so I understand I need to register one first.
18. As a logged-in user, I want a way to register a new passkey against my account, so I can
    enable passwordless login on a given device.
19. As a user logging in via passkey, I want to land in the same correct application area
    (backoffice/field/portal) as I would with password login, so behavior is consistent
    regardless of authentication method.
20. As a user logging in via passkey, I want the existing email-verification gate still
    enforced, so passwordless login can't bypass the organization's verification policy.
21. As a developer maintaining this codebase, I want all three flows to follow the existing
    Identity module's Action/Controller/Request pattern, so the auth code stays consistent and
    reviewable alongside the existing login flow.
22. As a Bahasa Indonesia-speaking user, I want every page, button, and email in these three
    flows written in Indonesian, so the experience matches the rest of the application.

## Implementation Decisions

- **Email verification** (Phase 1): `User` implements `MustVerifyEmail` (import already present,
  currently unused). `verified` middleware added to the `backoffice`, `field`, and `portal` route
  groups, alongside their existing `auth` + `role` middleware. New controllers follow Laravel's
  standard verification-flow shape (prompt / verify-signed-link / resend-notification) rather
  than introducing new Domain Actions — the logic is thin framework glue
  (`$request->fulfill()`), so no `Domain/Identity/Actions` class is needed for this phase.
  Verification email copy is localized to Indonesian via `VerifyEmail::toMailUsing(...)`
  registered in `AppServiceProvider::boot()`, alongside the existing `Password::defaults()`
  customization already there.
- **Forgot password** (Phase 2): new `Domain/Identity/Actions/SendPasswordResetLink` and
  `ResetPassword` actions wrapping Laravel's `Password` facade (`sendResetLink()`/`reset()`),
  matching `AttemptLogin`'s existing Action pattern. New thin controllers
  (`PasswordResetLinkController`, `NewPasswordController`) and `FormRequest`s
  (`ForgotPasswordRequest`, `ResetPasswordRequest`) under the existing
  `app/Http/{Controllers,Requests}/Identity/` directories. New password validation reuses the
  existing `Password::defaults()` rule from `AppServiceProvider`. **Non-enumeration decision:**
  the reset-request response is generic regardless of whether the email exists, to avoid
  confirming account existence to unauthenticated visitors — consistent with the existing login
  flow's combined "Email atau kata sandi salah" message, which likewise avoids revealing which
  field was wrong. **Session invalidation decision:** a successful password reset invalidates the
  user's other active sessions (standard Laravel `Password::reset()` behavior via session-token
  rehash). Reset-link notification copy is localized the same way as Phase 1's `VerifyEmail`.
  Routes for both phases live in `routes/web.php` next to `login`/`logout`, not in a per-area
  route file — identity concerns aren't area-specific.
- **Passkey login** (Phase 3): adds `laravel/passkeys` (composer) + `@laravel/passkeys` (npm) —
  Laravel's official first-party WebAuthn/passkey package (PHP 8.2+, Laravel 11–13), replacing
  the third-party `laragear/webauthn` option that was ruled out for lacking confirmed Laravel 13
  support. `User` implements the package's `PasskeyUser` contract + `PasskeyAuthenticatable`
  trait. **Correction found during implementation:** the installed package
  (`laravel/passkeys-server` v0.2.1) has no redirect hook on `Passkeys::authorizeLoginUsing(...)`
  — that callback is a login allow/deny gate (`bool`), not a way to customize where the user lands.
  The area-aware redirect is instead implemented by binding the package's
  `Laravel\Passkeys\Contracts\PasskeyLoginResponse` contract (in `AppServiceProvider::register()`)
  to `App\Domain\Identity\Http\Responses\PasskeyLoginResponse`, which calls
  `ResolveAreaForUser` the same way `AttemptLogin` does — so passkey and password login still land
  users in an identical place, just via the package's response-contract override point rather than
  the login-authorization callback. The existing disabled "Masuk dengan Passkey" button in
  `login-form.tsx` becomes the login entry point (calls `Passkeys.verify()`).
  **Open decision, resolved before Phase 3 implementation started:** there was no account/settings
  page anywhere in the app, so passkey *registration* (story 18) had no existing UI surface —
  the user chose to ship login-only support in this phase (against passkeys created out-of-band,
  e.g. via tinker/tests) and explicitly defer self-service registration UI to a follow-up ticket.
- All three phases keep controllers thin, one Action per meaningful operation, and Indonesian
  user-facing copy — the same conventions the existing `AuthenticatedSessionController`/
  `AttemptLogin`/`LoginRequest` trio already establishes.

## Testing Decisions

Two seams:

1. **Feature/HTTP tests** (primary seam) — hit routes via Laravel's test client and assert on
   response/redirect/session/DB state, exactly like the existing
   `tests/Feature/Identity/InvalidCredentialsTest.php`,
   `tests/Feature/Identity/LoginRedirectsToCorrectAreaTest.php`, and
   `tests/Feature/Identity/GuestCannotAccessProtectedAreasTest.php`. New files:
   `tests/Feature/Identity/EmailVerificationTest.php`,
   `tests/Feature/Identity/PasswordResetTest.php`,
   `tests/Feature/Identity/PasskeyLoginTest.php`. These test observable behavior only — HTTP
   status, redirect target, session error bag, and persisted model state — never internal
   method calls.
2. **Unit tests on the new Actions** — `SendPasswordResetLink` and `ResetPassword` (Phase 2) get
   direct unit tests under `tests/Unit/Domain/Identity/Actions/`, asserting their return
   values/side effects in isolation from HTTP, following the project's existing
   `tests/Unit` vs `tests/Feature` split (per `phpunit.xml`). Phase 1 introduces no new Action
   class (see Implementation Decisions), so it's covered by Feature tests only. Phase 3's
   `Passkeys::authorizeLoginUsing` callback is a closure, not a standalone Action — unit-test it
   directly if the package's testing helpers make that practical, otherwise cover it via the
   Feature-test seam only (to be confirmed once the package is actually integrated).
3. `UserFactory`'s existing but currently-unused `unverified()` state is the fixture these tests
   need for email-verification scenarios.

## Out of Scope

- Multi-passkey management UI (naming, listing, revoking individual passkeys) — Phase 3 ships
  login (and, pending the open decision above, possibly minimal registration) only.
- Any second factor/MFA beyond passkey (e.g. TOTP, SMS codes).
- Social login / third-party OAuth providers.
- Changes to `laravel/passport` — it remains reserved for future API integration per
  `docs/ARCHITECTURE.md` §7 and is untouched by this work.
- Production email deliverability setup (a real transactional-mail provider) — dev/staging use
  the existing local mail catcher (`MAIL_HOST=127.0.0.1`, `MAIL_PORT=1025` per `.env`).
- Publishing this spec to an issue tracker — no `gh` CLI or tracker/label configuration is
  available in this environment; this document is checked in as `SPEC.md` only.

## Further Notes

- Phase order, as agreed with the user: **email verification → forgot password → passkey
  login**. Each phase is implemented, tested, and reviewed independently — this spec covers all
  three so the shape of later phases is visible up front, not because they ship together.
- Passkey package research: Laravel now ships an official first-party WebAuthn/passkey package,
  [`laravel/passkeys`](https://packagist.org/packages/laravel/passkeys), confirmed compatible
  with Laravel 11–13 and PHP 8.2+. See [Laravel Introduces First-Party Passkey Authentication
  Support](https://laravel-news.com/laravel-introduces-first-party-passkey-authentication-support)
  for an overview of the package's routes, model contract, and companion `@laravel/passkeys`
  npm client — re-verify the exact API against the package's current README before starting
  Phase 3 implementation, since WebAuthn packages change shape across versions.
