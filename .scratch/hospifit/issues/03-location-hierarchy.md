# 03 — Location hierarchy

**What to build:** Within a Site, Office Staff can build out a physical-space tree
(Building/Area/Room/…) as deep as that client actually needs — not a fixed set of levels —
and set per-node defaults that later scheduling/geofencing tickets will read.

**Blocked by:** 02 — Client & Site management.

**Status:** ready-for-agent

- [ ] Office Staff can create a `Location` node directly under a `Site`, or under another
      `Location` (arbitrary depth via a self-referencing parent relationship).
- [ ] Each `Location` node has a `type` (e.g. building/area/room) and a name.
- [ ] A small client can be modeled as `Site → Room` directly; a large client can be modeled
      as `Site → Building → Area → Room` (or deeper) — no schema change required between
      the two.
- [ ] A `Location` node can optionally set a default maintenance interval, inherited by
      anything under it unless overridden further down the tree.
- [ ] A `Location` node can optionally override the Site's default geofence
      (latitude/longitude/radius).
- [ ] A node can be edited or reparented (moved under a different parent) without breaking
      its descendants.
- [ ] The tree is browsable/editable from the backoffice UI (not just via direct DB access).
