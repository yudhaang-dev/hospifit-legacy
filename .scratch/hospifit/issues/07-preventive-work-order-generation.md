# 07 — Preventive Work Order generation

**What to build:** Given an active contract's coverage, the system works out how often each
covered asset needs a preventive (routine) visit and produces the resulting Work Orders,
visible to Office Staff before anyone is assigned to them. (This covers only
`type = preventive` Work Orders — Calibration due-tracking, which deliberately does *not*
auto-generate an exact date, is its own ticket: 16.)

**Blocked by:** 06 — Contract management.

**Status:** ready-for-agent

- [ ] For each covered `Asset`, the system resolves its effective maintenance interval by
      checking the asset's own override first, then walking up its Location ancestry to the
      nearest node with an interval set.
- [ ] Upcoming preventive `WorkOrder`s (`type = preventive`) are generated for an active
      contract's duration based on the resolved intervals, one per due visit per asset (or
      per location group, per ticket 03/06 coverage).
- [ ] Generated Work Orders are visible as a list/calendar in the backoffice, unassigned at
      this stage.
- [ ] Changing a contract's coverage or an asset's/location's interval is reflected in
      future generation without corrupting already-generated Work Orders.
