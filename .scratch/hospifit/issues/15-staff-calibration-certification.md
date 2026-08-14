# 15 — Staff calibration certification tracking

**What to build:** Office Staff can see and record which Field Staff members are certified
to perform calibrations, so that assigning an uncertified/expired staff member to a
calibration job is caught (flagged) rather than discovered later.

**Blocked by:** 01 — Foundation: roles, auth, three layout areas.

**Status:** ready-for-agent

- [ ] Admin/Office Staff can record one or more `StaffCertification` entries for a Field
      Staff `User` (certification type, valid-until date).
- [ ] A Field Staff member's currently valid certifications are visible on their profile in
      the backoffice.
- [ ] This data is available for ticket 17 (Calibration execution) to check against when
      assigning an internal calibration job — flagging, not blocking, an assignment to
      someone without a current certification (this ticket only builds the data; the
      assignment-time flag itself is wired up in ticket 17).
