# 06 — Contract management

**What to build:** Office Staff/Admin can set up a maintenance contract for a client's Site,
declare exactly which locations/assets it covers, and renew an expiring contract without
re-entering everything from scratch.

**Blocked by:** 04 — Asset registry & barcode generation.

**Status:** ready-for-agent

- [ ] Admin/Office Staff can create a `Contract` scoped to one `Site`, with a start and end
      date and a status (draft/active/expired).
- [ ] A `Site` can have more than one concurrently active `Contract`.
- [ ] Coverage can be marked at the `Location` level (implying everything under it) or at
      the individual `Asset` level (`ContractItem`).
- [ ] A contract can be renewed by duplicating a previous contract, inheriting its covered
      locations/assets, rather than requiring the coverage to be re-selected from scratch.
- [ ] Contracts and their coverage are listed/editable from the backoffice.
