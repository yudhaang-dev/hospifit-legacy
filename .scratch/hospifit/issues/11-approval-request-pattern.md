# 11 — Approval Request pattern: cost approval & witness flow

**What to build:** A reusable "Approval Request" mechanism — first delivered for the
corrective-maintenance cost-approval use case, but built generically so Calibration
scheduling (ticket 16) can reuse it without duplicating the logic. When a corrective visit
turns out to need money beyond what the contract covers, the client gets a clear decision to
make, can discuss it with Office Staff before deciding, the relevant internal staff stay in
the loop as it happens, and nobody gets stuck waiting silently.

**Blocked by:** 10 — Corrective (on-demand) request intake.

**Status:** ready-for-agent

- [ ] From a corrective `WorkOrder`, Field Staff or Office Staff can submit a cost estimate,
      opening an `ApprovalRequest` (subject = cost) in "pending" status.
- [ ] While the request is pending, the proposer can revise the estimate.
- [ ] While pending, the requester and the Client Admin/PIC can exchange comments on the
      request (a threaded discussion, like blog comments) before a decision is made.
- [ ] Every new comment or revision sends an in-app notification to the other party.
- [ ] Internal staff connected to that client/job (e.g. the account's Office Staff, whoever
      assigned the visit) are automatically added as witnesses on the `ApprovalRequest`.
- [ ] Additional witnesses can be added manually.
- [ ] Each witness can mark that they've seen/acknowledged the pending request.
- [ ] The Client Admin/PIC for that client can approve or reject the request from the portal.
- [ ] Approving unblocks the work to proceed (or spins up a follow-on Work Order); rejecting
      marks the item as deferred/not-done.
- [ ] If the client hasn't decided within a configurable time window, witnesses receive an
      escalation reminder notification.
- [ ] An approved cost estimate's value is recorded against the contract's progress meter
      data (the meter display itself is built in ticket 13).
- [ ] The `ApprovalRequest`/comment/witness/escalation mechanism is built generically enough
      (e.g. a `subject` field distinguishing what's being approved) that ticket 16
      (Calibration scheduling) can reuse it for a different subject without rebuilding it.
