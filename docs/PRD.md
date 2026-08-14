# Hospifit — Product Requirements Document

## 1. Overview

Hospifit is a **field service management (FSM) platform** for a single service-provider
organization that performs contract-based maintenance and upkeep of assets owned by its
clients. The organization runs one internal team (office + field staff) serving **multiple
clients**, each with their own facilities, assets, and service contracts.

The system replaces manual/ad-hoc scheduling with a structured flow: a client signs a
contract covering a defined set of assets → the system generates a recurring maintenance
schedule → office staff assign field staff to visits → field staff execute and document the
work → clients get visibility and, where money or timing needs their sign-off, a say in
approving it.

This document describes product scope only. Technical decisions live in
[ARCHITECTURE.md](ARCHITECTURE.md); the data model lives in [ERD.md](ERD.md).

## 2. Goals

- Give office staff a single place to manage client contracts, assets, and the maintenance
  calendar derived from them, instead of tracking schedules manually.
- Give field staff a simple, mobile-friendly way to see their daily assignments, identify
  the right asset on-site, and record proof of work (photos, notes).
- Give clients visibility into what's been serviced and a lightweight approval mechanism
  when work requires cost beyond what the contract covers, or when scheduling needs their
  sign-off (calibration).
- Help clients that are hospitals/health facilities stay compliant on required equipment
  calibration, without building a full compliance suite.
- Lay the groundwork (progress meters) for contract-based billing without building billing
  itself in this phase.

## 3. Out of scope (MVP)

- Billing/invoicing (only the underlying progress meters are built; invoicing consumes them
  in a later phase).
- Offline data entry / sync (client sites are assumed to have reliable internet).
- Notification channels beyond in-app (email/WhatsApp/SMS are future work — the design should
  not preclude them).
- Structured, per-asset-type maintenance checklists (MVP uses free-text notes + optional
  reference instructions; a formal checklist system is a later phase).
- Staff utilization / workload reporting, auto-assignment or scheduling optimization.
- Physical barcode-scanner hardware integration and dedicated label-printer drivers (labels
  print to any printer via the browser).
- A structured directory of individual calibration technicians (only the vendor
  organization is tracked; the technician who performs a given job is recorded as free text).
- Granular, parameter-by-parameter calibration measurement data (the calibration certificate
  attachment carries that detail; the system only stores a handful of summary fields).

## 4. Users & roles

| Role | Side | Description |
|---|---|---|
| **Admin/Manager** | Internal | Full access: manage contracts, clients, sites, assets, users, and view all reporting. |
| **Office Staff / Scheduler** | Internal | Day-to-day operations: validate corrective requests, schedule and assign field staff, monitor progress. No contract-management access. |
| **Field Staff** | Internal | Executes assigned visits: check in/out, scans assets, records work, uploads photos. May also perform calibrations if they hold a valid certification. |
| **Client Admin / PIC** | Client | Decides on Approval Requests (cost-bearing corrective work, calibration scheduling/cost), can view all schedules/reports for their organization, can invite other client users. |
| **Client Staff** | Client | Views schedules, work status, and asset service history; can submit new (corrective) service requests. Cannot decide on Approval Requests. |

A client user's access is scoped to their own `Client` (and its sites/assets) only.

## 5. Core domain concepts

- **Client** — a customer organization Hospifit's internal team serves. One client can have
  multiple **Sites** (facilities/locations), e.g. a hospital foundation with a hospital
  building and a separate clinic.
- **Location hierarchy** — within a Site, physical space is modeled as a flexible,
  arbitrarily-deep tree (Building → Area → Room → …). A small clinic might just be
  `Site → Room`; a large hospital might be `Site → Building → Area → Room`. Assets always
  attach to the lowest relevant Location node in that client's tree. See ERD.md for the
  data shape.
- **Asset** — a specific piece of client-owned equipment under a Location (e.g. one AC unit,
  or a medical device), identified by a Hospifit-generated barcode. Has a maintenance
  history and belongs to an `Asset Type`/category for shared defaults (maintenance interval,
  instructions, whether calibration applies). Carries a status
  (available / under calibration / out of service) reflecting whether it's currently usable.
- **Contract** — an agreement with a client, scoped to one Site, typically ~1 year, defining
  which assets/locations are covered and the maintenance cadence. A client can have multiple
  concurrent contracts (e.g. one per site). Renewing a contract is done by **duplicating** the
  previous one (inheriting its covered assets/locations) rather than re-entering everything.
- **Maintenance schedule** — the recurring interval for a preventive visit. Set by default at
  whichever Location node an asset sits under (so a whole room can share one schedule), with
  the option to override the interval for an individual Asset that needs a different cadence.
  Calibration has its own separate interval (see §6.4) — the two cadences are independent
  even for the same asset.
- **Work Order** — a unit of work to be performed, one of three types:
  - **Preventive** — generated automatically from a contract's maintenance schedule.
  - **Corrective / on-demand** — raised for a specific issue ("kasus khusus"), by either
    internal staff or client staff, and validated by Office Staff before it becomes an
    active Work Order.
  - **Calibration** — required periodically for certain medical equipment to verify
    measurement accuracy against a standard, distinct from Preventive/Corrective because it's
    compliance-driven, only applies to some assets, is often performed by an accredited
    third party, and produces a formal certificate rather than just notes+photos. See §6.4.
- **Approval Request** — a shared mechanism used whenever a Client Admin/PIC needs to
  decide on something before it proceeds: additional cost on a Corrective Work Order (§6.3),
  or a Calibration's proposed schedule/cost (§6.4). While a request is pending, both sides can
  exchange comments and the proposer can revise the details; the request accumulates
  witnesses (relevant internal staff who acknowledge awareness) and escalates with a reminder
  if the client is slow to decide.

## 6. Key workflows

### 6.1 Contract & asset setup (Office Staff / Admin)

1. Admin/Office Staff creates a Client and its Site(s).
2. They build out the Location tree for each Site as deep as that client actually needs.
3. Assets are registered under Location nodes; each gets a system-generated barcode.
4. A Contract is created for a Site, and specific assets/locations are marked as covered.
5. Maintenance intervals are set at Location level (with per-asset overrides where needed) —
   this generates the recurring visit schedule for the contract's duration.
6. Optionally, an `Asset Type` gets default maintenance instructions (reference guidance for
   field staff — not a mandatory checklist), which can be overridden per individual asset.
7. If an `Asset Type` includes equipment that needs periodic calibration, it's flagged as
   `requires_calibration` with a default `calibration_interval` — both overridable per
   individual asset (see §6.4).

### 6.2 Preventive maintenance visit

1. The system produces upcoming visits (Work Orders) from each contract's schedule.
2. Office Staff assigns Field Staff to visits — the system pre-fills a default staff member
   per Site so most visits just need confirming; bulk-assign lets Office Staff reassign many
   visits at once (e.g. when someone is on leave).
3. Field Staff see their daily/periodic assignments, organized by site/route.
4. On arrival, Field Staff check in — GPS coordinates are logged against the Site's
   configured coordinates/radius; being outside the radius is **flagged**, not blocked
   (connectivity/GPS accuracy inside buildings is unreliable).
5. Field Staff identify the asset by scanning its barcode (auto-fills the asset record) or,
   if the barcode is missing/unreadable, searching/selecting it manually.
6. Field Staff perform the work, upload a **before** photo, do the maintenance, upload an
   **after** photo, and add free-text notes. Any admin-authored instructions for that asset
   (or its Asset Type) are shown as reference, not required input.
7. Field Staff check out. The visit is marked complete and counts toward the contract's
   visit and item-handled progress meters.

### 6.3 Corrective (on-demand) maintenance

1. A corrective request is raised — either by a Client Staff/Admin (via portal) reporting an
   issue, or by Internal Staff on the client's behalf.
2. Office Staff reviews and validates the request (checks it's a legitimate/in-scope issue)
   and turns it into a Work Order. If the request came from the client, they're already
   aware; if it was raised internally, Office Staff can optionally notify the client.
3. Field Staff is assigned and performs the visit as in 6.2.
4. **If** the work requires cost beyond what the contract covers, an **Approval Request** is
   opened (see §5):
   - Field Staff (or Office Staff) submits a cost estimate, opening the request in "pending"
     status.
   - The relevant internal staff (whoever manages that client account / assigned the job) are
     automatically added as **witnesses** ("saksi") who acknowledge they're aware of the
     situation — manual witnesses can also be added.
   - While pending, the proposer can revise the estimate, and both sides can exchange
     comments on the request (a threaded discussion) before a decision is made. Each new
     comment or revision notifies the other party in-app.
   - The Client Admin/PIC approves or rejects the request. Approval unblocks the work
     (or spins it into its own Work Order); rejection marks the item deferred/not-done.
   - If the client doesn't decide within a configurable time, witnesses get an escalation
     reminder so the issue doesn't stall.
   - Approved cost value accumulates into the contract's progress meter.
5. **If** no additional cost is needed, the client is simply notified — no Approval Request
   is needed.

### 6.4 Calibration

Some medical equipment (e.g. patient monitors, diagnostic devices) must be periodically
calibrated — checked against a measurement standard — to stay compliant with health-facility
regulation/accreditation requirements. This is tracked as its own Work Order type, separate
from Preventive and Corrective maintenance.

1. Only `Asset`s flagged `requires_calibration` (via their `Asset Type` default or an
   individual override) participate in this workflow, each with its own
   `calibration_interval`.
2. Unlike Preventive maintenance, the system does **not** auto-generate an exact visit date —
   it only flags that an asset's calibration is due within an upcoming period. The exact date
   is a 3-way coordination between the client (equipment will be unavailable), Hospifit, and
   — if performed externally — the calibration vendor's own availability, so it can't be
   computed from the interval alone.
3. Office Staff proposes a calibration date, which opens an **Approval Request** (see §5) —
   the same approve/reject + editable-while-pending + comment-thread + witness/escalation
   mechanism as §6.3's cost approval. If the calibration is outside any contract's coverage,
   the schedule and an estimated cost are approved together in one combined Approval Request
   rather than two separate gates.
4. Once approved, the calibration is performed one of two ways:
   - **Internal** — a Field Staff member who holds a currently valid calibration
     certification performs it using the same visit shape as §6.2 (check-in, etc.), plus
     recording the calibration result. Assigning a staff member without a valid/current
     certification is flagged, not blocked.
   - **External** — performed by an accredited third-party **Calibration Vendor**
     (an organization/lab — name, accreditation number, contact; tracked in a reusable
     directory). This is a lighter flow with no GPS/check-in/field-app steps, since the
     vendor isn't a Hospifit user: Office Staff records the planned vendor and date, then
     after the job is done, enters the result.
5. The `Asset`'s status is set to "under calibration" for the duration and reverts once done,
   so it's visibly unavailable and doesn't get double-booked by another Work Order.
6. The completed calibration is recorded with: certificate number, date performed, next due
   date, an overall result — **Lulus / Tidak Lulus / Lulus Bersyarat** (Pass / Fail /
   Conditional pass) — and one or more file attachments for the full certificate/report.
   No granular per-parameter measurement fields are captured — the attachment carries that
   detail.
7. A due/overdue calibration list (separate from the Preventive-visit overdue list) and a
   fourth contract-level compliance metric ("N of M covered assets currently
   calibration-current") support keeping equipment compliant — see §6.6.

### 6.5 Barcode labels

Office/Admin staff can generate and print asset barcode labels — individually, or in bulk,
laid out in a grid sized to the paper being printed on — to physically affix to newly
registered client assets.

### 6.6 Client visibility

Client Admin/PIC and Client Staff can, scoped to their own organization:
- View upcoming and past visit schedules and their status.
- Submit a new corrective service request.
- View each asset's service history, including calibration records.
- (Client Admin/PIC only) Decide on Approval Requests — additional-cost requests and
  calibration scheduling/cost requests.

### 6.7 Contract progress & reporting

Each contract tracks four running meters (the first three are the basis for future billing,
not billing itself): completed visits vs. contracted, count of items/assets handled,
accumulated value of approved additional-cost work, and — for contracts covering assets that
require calibration — how many of those assets are currently calibration-current.

MVP reporting surfaces:
- A per-client/per-contract progress dashboard (the four meters above).
- An overdue-visits list (scheduled preventive visits past due and not completed).
- A due/overdue-calibration list, tracked separately from the preventive-visit list.
- Per-asset service history (all past Work Orders and calibration records for that asset).

## 7. Notifications

In-app notifications only for MVP, covering: new corrective request assigned for review,
Approval Request activity (new request, comments/revisions, escalation reminders, witness
acknowledgments) for both cost approvals and calibration scheduling, and due/overdue
calibration alerts. The notification model should not assume a single channel, so
email/WhatsApp/SMS can be added later without restructuring.

## 8. Open items for later phases

- Billing/invoicing built on top of the progress meters.
- Structured per-asset-type maintenance checklists.
- Offline support for field staff, if problem locations are identified later.
- Additional notification channels (email, WhatsApp/SMS).
- Staff utilization/workload reporting and assignment optimization.
- Finer-grained permissions beyond the two-level role split per side.
- A structured individual-technician directory for calibration vendors, if free-text proves
  insufficient.
- Direct date-negotiation UI (proposing alternative dates inline) beyond comments, if the
  comment-thread pattern proves insufficient in practice.
