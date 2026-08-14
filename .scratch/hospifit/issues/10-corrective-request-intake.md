# 10 — Corrective (on-demand) request intake

**What to build:** A special-case issue (outside the regular maintenance schedule) can be
reported by either a client user or internal staff, gets checked by Office Staff, and — once
validated — flows through the exact same assignment and execution pipeline as a scheduled
visit.

**Blocked by:** 09 — Field visit execution.

**Status:** ready-for-agent

- [ ] A Client Staff/Admin user can submit a corrective service request against one of
      their assets from the client portal.
- [ ] An Internal Staff member can raise a corrective request on a client's behalf
      (e.g. reported by phone).
- [ ] A new corrective request starts in a "pending review" status — it does not become an
      active Work Order automatically.
- [ ] Office Staff can review a pending request and validate it into an active `WorkOrder`
      (type = corrective), which then goes through the same assignment (ticket 08) and
      execution (ticket 09) flow as scheduled work.
- [ ] If the request originated from Internal Staff (not the client), the client is
      notified in-app once it's validated. If it originated from the client, no separate
      "you're aware" notification is needed.
- [ ] The requesting user (internal or client) is recorded on the resulting Work Order.
