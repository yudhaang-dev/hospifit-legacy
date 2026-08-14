# 09 — Field visit execution

**What to build:** The `field/*` app end to end — a Field Staff member can see their day's
work, get to the right site, identify the right asset, do and document the job, and have it
marked complete, all from a phone browser.

**Blocked by:** 08 — Office staff assignment.

**Status:** ready-for-agent

- [ ] Field Staff see their assigned Work Orders grouped by site/route, for the current day
      and/or an upcoming period.
- [ ] Field Staff can check in to a visit: GPS coordinates are recorded against the site's
      configured geofence; being outside the radius is flagged on the record but never
      blocks check-in.
- [ ] Field Staff can identify the asset by scanning its barcode via the device camera,
      which auto-fills the correct asset/work order context.
- [ ] If the barcode is missing or unreadable, Field Staff can fall back to manually
      searching/selecting the asset from that location.
- [ ] Field Staff can upload a "before" photo, perform the maintenance, upload an "after"
      photo, and add free-text notes.
- [ ] Photo uploads go through a shared chunked-upload mechanism (`pionl/laravel-chunk-upload`
      backend + `resumable.js` frontend, wrapped in one reusable hook/component) — built here
      for the first time, reusable as-is by later tickets that upload files (e.g. calibration
      attachments in ticket 17), per ARCHITECTURE.md §12.
- [ ] A daily scheduled Artisan command purges temp chunk files older than 24 hours
      (orphaned by failed/abandoned uploads), logging the count purged — no admin-facing UI
      needed for this.
- [ ] If the asset (or its Asset Type) has admin-authored instructions, they're shown to
      the Field Staff as reference — never required to complete the visit.
- [ ] Field Staff can check out, and the Work Order transitions to completed.
- [ ] A completed scheduled visit counts toward its contract's visit-count and
      item-handled progress meters (data only — the meters themselves are built in
      ticket 13).
