# 13 — Contract progress meters & reporting

**What to build:** Office Staff/Admin get a clear picture of how each contract is
progressing and what's overdue, without needing to dig through raw Work Order records —
the foundation for billing in a later phase, without building billing itself.

**Blocked by:** 09 — Field visit execution, 11 — Approval Request pattern: cost approval &
witness flow.

**Status:** ready-for-agent

- [ ] A per-contract dashboard shows three progress meters: completed visits vs. contracted,
      count of items/assets handled, and accumulated value of approved additional-cost work.
      (A fourth, calibration-compliance meter is added later in ticket 18.)
- [ ] An overdue-visits list shows preventive Work Orders past their due date that are not
      yet completed.
- [ ] A per-asset service history report lists all past Work Orders for that asset.
- [ ] These views are computed from existing `WorkOrder`/`ApprovalRequest` data (no separate
      billing feature is introduced).
