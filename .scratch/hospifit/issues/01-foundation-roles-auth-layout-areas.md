# 01 — Foundation: roles, auth, three layout areas

**What to build:** A logged-in user of any role lands in the correct part of the app and
sees only what their role/organization should see. This is the walking skeleton the rest of
Hospifit is built on: session-based login, role-based routing into three distinct layout
areas, and a reusable mechanism that scopes every client-side user to their own `Client`.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] The five roles exist and can be assigned to a `User`: Admin/Manager, Office Staff,
      Field Staff, Client Admin/PIC, Client Staff.
- [ ] Login uses standard session-based auth (no OAuth/token flow) for all roles.
- [ ] Admin/Manager and Office Staff are routed into a `backoffice/*` area with a
      desktop-dashboard layout.
- [ ] Field Staff are routed into a `field/*` area with a mobile-first, minimal-tap layout.
- [ ] Client Admin/PIC and Client Staff are routed into a client-portal area with a layout
      scoped to their organization.
- [ ] A user cannot reach an area outside their role (e.g. Field Staff hitting
      `backoffice/*` is denied/redirected).
- [ ] A reusable client-scoping mechanism exists (e.g. a query scope/policy) that later
      tickets can rely on so Client Admin/PIC and Client Staff only ever see data belonging
      to their own `Client` — proven here even without domain data yet (e.g. a trivial
      scoped listing/test fixture).
- [ ] No domain data model (Client/Site/Asset/etc.) is required to be built yet — this
      ticket only proves the auth/role/area/scoping shape end to end.
- [ ] Routes are split into `routes/backoffice.php`, `routes/field.php`, `routes/portal.php`
      (one per layout area), each declaring its own role-gating middleware, per
      ARCHITECTURE.md §6.
- [ ] The domain-driven folder convention (ARCHITECTURE.md §3–4) is established and
      demonstrated end to end for the `Identity` context: `app/Domain/Identity/` for
      auth-related Actions, `app/Http/Controllers/Identity/` for controllers, and
      `resources/js/features/identity/` for frontend logic/components — so later tickets
      (Client, Asset, Contract, WorkOrder, Calibration, Approval) can follow the same
      pattern instead of inventing their own.
- [ ] `resources/js/pages/` is kept thin and routing-only from the start — page components
      compose from `features/{context}` rather than containing form/business logic directly.
- [ ] shadcn/ui is installed and configured as the component library for all three layout
      areas.
- [ ] `vite-plugin-pwa` is installed and configured for installability (manifest/icons);
      offline caching is left disabled per the online-only decision (ARCHITECTURE.md §1).
- [ ] A Pest architecture test (`arch()`) asserts domain boundaries aren't violated (one
      domain's classes may not reach directly into another's internals) — a guard rail for
      every domain ticket that follows.
