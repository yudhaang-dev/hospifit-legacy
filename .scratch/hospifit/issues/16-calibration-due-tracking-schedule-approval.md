# 16 — Calibration due-tracking & schedule approval

**What to build:** Office Staff can see which assets need calibration soon, propose an actual
visit date, and get the client's sign-off on that date (and cost, if it's outside any
contract) before it's locked in — reusing the Approval Request mechanism rather than a
bespoke flow.

**Blocked by:** 14 — Calibration applicability, interval & vendor directory,
11 — Approval Request pattern: cost approval & witness flow.

**Status:** ready-for-agent

- [ ] The system flags `Asset`s whose calibration is due within an upcoming period, based on
      their resolved calibration interval and last completed calibration (if any) — it does
      **not** auto-generate an exact visit date the way preventive Work Order generation does.
- [ ] Office Staff can create a `WorkOrder` (`type = calibration`) for a due asset and propose
      a specific date.
- [ ] Proposing a date opens an `ApprovalRequest` (subject = calibration_schedule) using the
      same mechanism as ticket 11: editable-while-pending, threaded comments, witnesses,
      escalation reminder, Client Admin/PIC approve/reject.
- [ ] If the calibration isn't covered by any active contract, the proposed date and an
      estimated cost are presented together in a single combined `ApprovalRequest` (one
      approval, not two separate gates).
- [ ] Approving the request confirms the Work Order's scheduled date; rejecting sends it back
      to Office Staff to re-propose (via the same comment thread).
