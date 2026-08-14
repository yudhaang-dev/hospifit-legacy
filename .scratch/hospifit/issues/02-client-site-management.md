# 02 — Client & Site management

**What to build:** Admin/Office Staff can register a client organization and its
facilities (Sites) in the backoffice, including each Site's geofence default used later for
field check-in validation.

**Blocked by:** 01 — Foundation: roles, auth, three layout areas.

**Status:** ready-for-agent

- [ ] Admin/Office Staff can create, edit, and list `Client` records (name, status).
- [ ] Admin/Office Staff can create, edit, and list `Site` records under a `Client`
      (name, address, latitude/longitude, geofence radius).
- [ ] A `Client` can have multiple `Site`s.
- [ ] Client Admin/PIC and Client Staff cannot see or manage other clients' records
      (relies on the client-scoping mechanism from ticket 01).
- [ ] Basic validation prevents creating a Site without a parent Client.
