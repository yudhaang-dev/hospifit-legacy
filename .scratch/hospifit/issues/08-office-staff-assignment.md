# 08 — Office staff assignment

**What to build:** Office Staff can get Field Staff assigned to upcoming visits with as
little manual effort as possible — a sensible default pre-fills automatically, and many
visits can be reassigned in one action.

**Blocked by:** 07 — Preventive Work Order generation.

**Status:** ready-for-agent

- [ ] Office Staff can assign a `Field Staff` user to a `WorkOrder`.
- [ ] Each `Site` can have a default Field Staff member configured, which pre-fills the
      assignment on new Work Orders for that site so Office Staff usually just confirms it.
- [ ] Office Staff can select multiple Work Orders and bulk-assign/reassign them to a
      staff member in one action (e.g. covering for someone on leave).
- [ ] Assigned Work Orders show up as that Field Staff member's upcoming workload.
