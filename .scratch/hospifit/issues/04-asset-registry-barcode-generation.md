# 04 — Asset registry & barcode generation

**What to build:** Office Staff can register a client's physical assets under a Location
node, each automatically getting a unique Hospifit-generated barcode, with reusable
per-type defaults and per-asset overrides for maintenance interval and instructions.

**Blocked by:** 03 — Location hierarchy.

**Status:** ready-for-agent

- [ ] Office Staff can define `AssetType` categories (e.g. "AC Split", "Genset") with a
      default maintenance interval and default (optional) reference instructions.
- [ ] Office Staff can register an `Asset` under a specific `Location` node, optionally
      tagged with an `AssetType`.
- [ ] Every registered `Asset` automatically receives a unique, system-generated barcode
      (assets are not assumed to already have a scannable manufacturer barcode).
- [ ] An `Asset` can optionally override its `AssetType`'s/Location's default maintenance
      interval and default instructions.
- [ ] An `Asset` can optionally record an existing manufacturer serial number, separate from
      the generated barcode.
- [ ] Assets are listed/searchable under their Location in the backoffice.
