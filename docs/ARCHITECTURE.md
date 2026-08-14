# Hospifit — Architecture

This document describes the technical shape of Hospifit. It assumes the product scope in
[PRD.md](PRD.md) and the data model in [ERD.md](ERD.md). It builds on top of, and should stay
consistent with, the stack conventions already documented in [`AGENTS.md`](../AGENTS.md) and
[`CLAUDE.md`](../CLAUDE.md).

## 1. Application shape

Hospifit is **one Laravel + Inertia + React monolith** — no separate backend API service and
no separate frontend deployment. This matches the existing starter-kit stack (Laravel 13,
Inertia v3, React 19, Tailwind v4) and avoids introducing new infrastructure for the MVP.

The app is delivered as a **PWA**, but **online-only for MVP**: no service-worker
background sync or offline data queue. Client sites are assumed to have workable internet;
offline-first is deferred until a real connectivity problem is identified (see PRD §8).

## 2. Three layout areas, one app

Rather than separate apps/domains per audience, Hospifit uses **one Inertia app with three
route-prefixed areas**, each with its own layout tuned to how that role actually works:

| Area | Route prefix | Audience | Layout character |
|---|---|---|---|
| Backoffice | `backoffice/*` | Admin/Manager, Office Staff | Desktop dashboard: tables, calendars, contract/asset management screens. |
| Field | `field/*` | Field Staff | Mobile-first, minimal-tap: daily assignment list, check-in/out, barcode scan, camera capture. |
| Portal | (client-facing area, e.g. `portal/*`) | Client Admin/PIC, Client Staff | Simplified views scoped to the client's own data: schedule/status, service history, request submission, cost approvals. |

All three areas share the same Laravel backend, the same `User` authentication, and the same
Inertia/React toolchain — they differ in Inertia page layout and the routes/controllers
exposed to each role, not in deployment or auth mechanism. Role-based middleware determines
which area(s) a given user can reach.

## 3. Domain-driven structure: backend

As the domain grows (Client, Asset, Contract, WorkOrder, Calibration, Approval, Identity —
see ERD.md), business logic is organized **by domain, not by technical layer**, to keep each
context navigable on its own rather than scattered across generic `Controllers`/`Models`
folders as the app grows. This is a **lightweight, package-by-domain** approach — Eloquent
stays Active Record (no repository interfaces, no separate domain-entity/persistence split,
no modules package like `nwidart/laravel-modules`) — chosen because at this scale (single
team, single database, MVP) the heavier tactical-DDD patterns would add indirection without a
real benefit, while still giving each domain a clear home to grow in.

- **Bounded contexts**: `Client` (Client, Site, Location), `Asset` (Asset, AssetType),
  `Contract` (Contract, ContractItem), `WorkOrder` (WorkOrder, WorkOrderPhoto, preventive/
  corrective generation), `Calibration` (CalibrationVendor, CalibrationRecord,
  StaffCertification), `Approval` (ApprovalRequest, ApprovalComment, Witness), `Identity`
  (User, roles/auth).
- **Eloquent models stay flat in `app/Models/`** — the default `php artisan make:model`
  location. The domain boundary is about where *behavior* lives, not where the Active Record
  class sits; moving models into per-domain folders would fight Larastan/Boost tooling
  defaults for a purely cosmetic win.
- **Controllers are grouped under `app/Http/Controllers/{Context}/`** — still inside the
  conventional `Http/Controllers` root Wayfinder already scans, just split into per-domain
  subdirectories. `FormRequest` classes follow the same pattern, under
  `app/Http/Requests/{Context}/`.
- **Business logic lives in `app/Domain/{Context}/`**: `Actions/` (single-purpose invokable
  classes holding the actual logic — e.g. `GeneratePreventiveWorkOrders`,
  `RecordCalibrationResult`), `DTOs/`, domain-specific `Policies/`, and `Notifications/`.
  Controllers stay thin and call Actions directly (`(new SomeAction)->handle(...)` or
  constructor-injected) — plain PHP invokable classes, no action-pattern package (e.g.
  `lorisleiva/laravel-actions`); Laravel doesn't need one for this, and AGENTS.md already
  says not to add dependencies without approval.
- **Boundary enforcement**: one Pest architecture test (`arch()`, built into Pest v5, no new
  dependency) asserts one domain's classes don't reach directly into another domain's
  internals. Organizational-only otherwise for MVP — this one test is a cheap guard rail
  against drift, not a hard framework.

## 4. Domain-driven structure: frontend

`resources/js/pages/` stays exactly as Inertia's convention — page components matched 1:1 to
routes, split by the three layout areas from §2 — and stays **thin**. Domain logic and reusable
UI live alongside it, one folder per bounded context (same context list as §3):

- `resources/js/features/{context}/components/*.tsx` — the actual form/table/display markup
  for that domain (e.g. `features/asset/components/AssetPicker.tsx`,
  `features/calibration/components/CalibrationResultBadge.tsx`).
- `resources/js/features/{context}/lib/` and `features/{context}/hooks/` (where needed) —
  hooks that wrap Wayfinder-generated actions and Inertia's `useForm` (e.g.
  `useCreateAssetForm()`), plus hand-maintained TypeScript types mirroring the backend
  entities/DTOs for that domain. No PHP→TS type-generation package — Wayfinder already
  generates the route/controller glue, and a second codegen pipeline isn't justified by the
  current data-shape complexity.

`pages/{area}/{context}/*.tsx` just composes `features/{context}` pieces into a route-matched
page with minimal logic of its own.

## 5. Frontend dependencies & patterns

The starter kit ships with only Inertia + React + Tailwind — no component library, form
library, data/state library, or domain-specific tooling. The following are added on top:

- **UI components**: [shadcn/ui](https://ui.shadcn.com) (Radix primitives + Tailwind,
  components copied into the repo rather than pulled from node_modules) — composes with the
  existing `cn()` helper and avoids framework lock-in across three quite different layout
  areas.
- **Forms & validation**: Inertia's built-in `useForm` hook only. Laravel `FormRequest`
  validation is the single source of truth for validation rules; no client-side schema
  library (React Hook Form/zod) duplicating it.
- **Client-side data/state**: no query/cache library. Inertia page props are the primary data
  source; polling (e.g. in-app notifications) uses `router.reload({ only: [...] })` on an
  interval rather than a second data-fetching paradigm.
- **UI text / i18n**: no i18n library. All UI text is Bahasa Indonesia only (see §16); strings
  are hardcoded directly in components. Revisit only if multi-language becomes a real
  requirement.
- **Barcode scanning**: `@zxing/browser` for in-browser camera-based barcode scanning (§11).
- **Date/time formatting**: `date-fns` — used for relative/duration formatting (e.g. "jatuh
  tempo 3 hari lagi" for PM/calibration due dates), which is common enough in this domain to
  be worth a small dependency over hand-rolling it on `Intl` alone.
- **Charts/visualization**: none for MVP. Contract progress meters and the calibration
  compliance metric (§17) are plain numeric cards + Tailwind progress bars; add a charting
  library later only if trend-over-time visualization is actually requested.
- **PWA**: `vite-plugin-pwa` generates the manifest and handles installability, with its
  offline-caching features disabled (per the online-only decision in §1) — used only for
  install-prompt/manifest wiring, not for cache-based offline support.
- **Frontend testing**: none dedicated for MVP. Pest feature tests (which exercise Inertia
  responses) plus manual QA cover the frontend layer; revisit if frontend-only logic (e.g.
  barcode-match validation, geofence radius math) grows complex enough to need isolated unit
  tests.

## 6. Route organization

Routes split into one file per layout area — `routes/backoffice.php`, `routes/field.php`,
`routes/portal.php` — included from `web.php`/`bootstrap/app.php`, mirroring the layout-area
split in §2. Each file declares its role-gating middleware once at the top. Within a file,
routes are grouped by domain context (§3/§4), in the same order as the `features/{domain}`
folders, so a route's position always matches where its frontend/backend code lives. This
replaces a single growing `web.php` as the domain surface expands across all three areas.

## 7. Auth

- **Primary application login** (all three areas) uses **session-based auth** (Laravel's
  standard cookie/session flow), not OAuth tokens. This is simpler for a browser-based PWA
  used by internal staff and client users — no token storage/refresh logic needed client-side.
- **Laravel Passport** (already installed in this starter kit) is **reserved for future
  third-party/API integration** — e.g. a client's ERP system pulling data from Hospifit via
  API. It is not part of the MVP login flow and does not need to be wired up until an actual
  integration is being built.

## 8. Roles & access control

Two internal levels plus Field Staff, two client levels — see PRD §4 for the full
description. For MVP this is implemented as simple role checks (e.g. a `role` column /
Laravel policy per role), not a fine-grained permissions system. Client-side users are always
scoped to their own `Client` — every query touching client data must filter by the
authenticated user's client, not just role.

## 9. Location data: flexible hierarchy

Because client site structure varies wildly (a one-room clinic vs. a multi-building
hospital), locations are **not** modeled as fixed levels (Site/Building/Area/Room columns).
Instead, a single self-referencing `Location` table (`parent_id` + `type`) represents the
tree under each `Site`, to arbitrary depth. See [ERD.md](ERD.md) for the exact shape. This
keeps onboarding a new client a matter of building out however many levels they actually
need, without schema changes.

## 10. Scheduling defaults & overrides

Maintenance interval is a property that can live on a `Location` node (the default for
everything under it) or be overridden directly on an `Asset`. Resolving an asset's effective
interval means walking up from the asset to its nearest ancestor with an interval set. The
same default → override pattern is used for maintenance instructions (set on `AssetType`,
overridable per `Asset`) — see PRD §5–6.

## 11. Field capture: barcode, GPS, photos

- **Barcodes**: Hospifit **generates** a unique code per `Asset` at registration time (assets
  are not assumed to already have a scannable manufacturer barcode). Labels can be printed
  individually or in bulk (grid-laid-out to the target paper size) directly from the browser
  — no dedicated label-printer driver/integration in MVP.
- **Barcode scanning**: done via the device camera in the browser using `@zxing/browser` (§5;
  no dedicated hardware scanner required for MVP). A manual search/select fallback exists for
  damaged/missing labels.
- **GPS / geofencing**: each `Location` (or `Site`) can be configured with a
  latitude/longitude and radius. Check-in/out always records the device's GPS coordinates;
  if they fall outside the configured radius, the check-in is **flagged**, never blocked —
  in-building GPS accuracy is unreliable enough that hard-blocking would obstruct real work.
- **Photos**: before/after photos are uploaded per Work Order via the device camera/file
  picker; stored as attachments linked to the Work Order (see ERD.md), using the chunked
  upload path described in §12.

## 12. File uploads: chunking & cleanup

All file uploads in the app — Work Order before/after photos, calibration certificate
attachments — go through **one shared chunked-upload path**, rather than branching upload
logic by file type or size: a small file is simply "one chunk," so there's no cost to
chunking uniformly, and one code path is easier to maintain than several.

- **Backend**: [`pionl/laravel-chunk-upload`](https://github.com/pionl/laravel-chunk-upload)
  assembles chunks into the final file on the configured storage disk.
- **Frontend**: `resumable.js` (chunking, retry, pause/resume) wrapped in one shared React
  hook used by every file-upload component.
- **Storage**: local disk for MVP (Laravel's filesystem abstraction), not S3-compatible
  object storage — no production deployment/infra decision has been made yet, and moving to
  S3 later is a config change, not a rewrite.
- **Cleanup**: a daily Laravel scheduled Artisan command (e.g.
  `CleanupExpiredChunkUploads`, scheduled `->daily()`, alongside the queue listener already
  in `composer dev`) purges temp chunk files older than 24 hours — covering chunks left
  behind by failed/abandoned uploads. Cleanup is silent, with an `info`-level log line
  recording the count purged; no admin-facing UI for this routine housekeeping.

## 13. Notifications

In-app only for MVP (see PRD §7). The notification-sending code should be structured behind
a notification abstraction (e.g. Laravel's built-in `Notification` channels) so that adding
email, WhatsApp, or SMS later is a matter of adding a channel, not restructuring call sites.

## 14. Approval Request pattern (shared)

The Corrective-maintenance cost approval and the Calibration schedule/cost approval (PRD §6.3
and §6.4) share one underlying mechanism rather than being two bespoke flows: an
**Approval Request** that is opened by an internal user, decided by a Client Admin/PIC, and —
while pending — supports:

- **Editable-while-pending**: the proposer (Office/Field Staff) can revise the proposed
  detail (a cost estimate, or a calibration date) as long as the request hasn't been decided.
- **Threaded comments**: both sides can exchange comments on the request before a decision,
  the same shape as blog comments — not a rigid single-shot approve/reject.
- **Witnesses**: internal staff connected to the client/job are auto-added, plus any manually
  added, each able to acknowledge awareness.
- **Escalation**: a reminder notification fires to witnesses if the client hasn't decided
  within a configurable window.
- **Notifications**: every new comment or revision notifies the other party in-app.

Model this as one `ApprovalRequest` concept (see ERD.md) with a `subject` distinguishing what
it's approving (a Corrective Work Order's cost, or a Calibration's schedule/cost), rather than
duplicating the approve/comment/witness/escalation logic per feature.

## 15. Calibration execution: internal vs. external

A Calibration Work Order is executed one of two ways (PRD §6.4), and the two paths diverge
enough that they shouldn't be forced through the same UI:

- **Internal**: reuses the Field visit execution shape from §11 (check-in, barcode
  identification, etc.), with the addition of capturing the calibration result. Only
  Field Staff with a currently valid `StaffCertification` should normally be assigned —
  flagged (not blocked) if assigned without one, consistent with this document's
  flag-don't-block stance elsewhere (geofencing, §11).
- **External**: performed by a `CalibrationVendor` (an accredited organization, not an
  individual — the vendor isn't a Hospifit user and never touches the field app). This is a
  simple record-keeping flow: Office Staff notes the planned vendor/date, then after the job
  is done, enters the result and attaches the certificate. No GPS/check-in/barcode-scan steps
  apply here.

## 16. Project-wide convention: English code, Indonesian UI

Across the whole application, not just the calibration feature: **all code and database
artifacts are written in English** — table/column names, model/class/function/variable
names, enum values, and code comments. **All user-facing text is written in Bahasa
Indonesia** — labels, buttons, messages, and notifications. E.g. the calibration result enum
is stored as English values (`pass` / `fail` / `conditional_pass`) but displayed to users as
"Lulus" / "Tidak Lulus" / "Lulus Bersyarat".

## 17. Progress meters & reporting

The three contract progress meters (visits completed, items handled, approved additional-cost
value) are derived from Work Order data. For MVP these can be computed on read (queries/
aggregates) rather than maintained as separate summary tables, since contract volumes are
expected to be modest; revisit if reporting performance becomes an issue.

## 18. Explicitly deferred

Per PRD §3/§8: billing/invoicing, offline sync, non-in-app notification channels, structured
maintenance checklists, staff utilization/optimization reporting, and label-printer hardware
integration. None of the above design should preclude adding these later — the deferrals are
about not building them now, not about closing the door on them.
