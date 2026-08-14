# 14 — Calibration applicability, interval & vendor directory

**What to build:** Office Staff can mark which kinds of equipment need calibration, set how
often, and maintain a directory of accredited external calibration organizations to assign
jobs to later.

**Blocked by:** 04 — Asset registry & barcode generation.

**Status:** ready-for-agent

- [ ] `AssetType` has a `requires_calibration` default flag and a `default_calibration_interval`.
- [ ] An individual `Asset` can override both `requires_calibration` and its calibration
      interval independently of its `AssetType`'s defaults.
- [ ] The calibration interval is tracked separately from the existing preventive-maintenance
      interval — an asset can have both, on independent cadences.
- [ ] `Asset` has a `status` field (available / under_calibration / out_of_service), currently
      always "available" until later tickets (16/17) start changing it.
- [ ] Office Staff can create/edit/list `CalibrationVendor` records (name, accreditation
      number, contact) in the backoffice, reusable across many calibration jobs.
