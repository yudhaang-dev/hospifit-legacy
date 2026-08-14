# 18 — Calibration compliance reporting

**What to build:** Office Staff/Admin can see, at a glance, which calibration-required assets
are falling behind and how compliant each contract is overall — extending the existing
contract-progress dashboard with a calibration-specific view.

**Blocked by:** 17 — Calibration execution (internal & external), 13 — Contract progress
meters & reporting.

**Status:** ready-for-agent

- [ ] A due/overdue-calibration list shows assets whose calibration is due soon or already
      overdue, separate from the existing preventive-visit overdue list.
- [ ] The per-contract dashboard (from ticket 13) gains a fourth metric, for contracts
      covering calibration-required assets: how many of those assets are currently
      calibration-current (based on their latest `CalibrationRecord`'s next due date).
- [ ] A per-asset service history view (from ticket 13) includes past `CalibrationRecord`s
      alongside past Work Orders.
