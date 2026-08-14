# 12 — Client portal visibility

**What to build:** A client user can log into the portal and see what's actually happening
with their own facilities and equipment — schedules, statuses, and service history — without
any risk of seeing another client's data.

**Blocked by:** 09 — Field visit execution.

**Status:** ready-for-agent

- [ ] Client Admin/PIC and Client Staff can view a list of upcoming and past visits
      (`WorkOrder`s) for their organization's sites, with current status.
- [ ] Client Admin/PIC and Client Staff can view an individual asset's service history
      (past completed Work Orders, with notes/photos where available).
- [ ] All portal views are scoped to the logged-in user's own `Client` (built on the
      client-scoping mechanism from ticket 01) — attempting to access another client's data
      is denied.
