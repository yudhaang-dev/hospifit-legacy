# 17 — Calibration execution (internal & external)

**What to build:** Once a calibration's schedule is approved, the job actually gets done —
either by a certified internal Field Staff member using the normal visit flow, or by an
external accredited vendor whose result gets logged afterward — and the outcome (certificate,
result, next due date) is recorded against the asset.

**Blocked by:** 16 — Calibration due-tracking & schedule approval, 09 — Field visit
execution, 15 — Staff calibration certification tracking.

**Status:** ready-for-agent

- [ ] When Office Staff assigns an internal Field Staff member to a calibration Work Order,
      the system flags (does not block) the assignment if that staff member has no current
      `StaffCertification`.
- [ ] Internal execution reuses the field-visit flow from ticket 09 (check-in, etc.), with an
      added step to capture the calibration result at completion.
- [ ] For externally-performed calibration, Office Staff records the assigned
      `CalibrationVendor` and planned date (no GPS/check-in/barcode-scan steps), then after
      the job is done, enters the result — no field-app visit flow is required for the vendor.
- [ ] The `Asset`'s status is set to `under_calibration` for the duration of the job (internal
      or external) and reverts to `available` once the result is recorded.
- [ ] Completing a calibration (either path) creates a `CalibrationRecord`: certificate
      number, date performed, next due date, result (pass / fail / conditional_pass — stored
      in English, displayed in Indonesian per the project's language convention), and one or
      more file attachments — uploaded via the same chunked-upload mechanism built in ticket
      09, not a separate upload path. No granular per-parameter measurement fields are
      captured.
- [ ] The calibration Work Order transitions to completed once the `CalibrationRecord` is
      saved.
