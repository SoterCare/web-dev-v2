# SoterCare contracts v1 (AR-11)

Source of truth for cross-repository payloads introduced in Phase 1. JSON Schema draft 2020-12.

| Schema | Transport | Producer → consumer |
|---|---|---|
| `device_event.schema.json` | Socket.IO `device_event`, namespace `/realtime` | edge gateway → api-gateway |
| `device_event_ack.schema.json` | Socket.IO ack of `device_event` | api-gateway → edge gateway |
| `alert_new.schema.json` | Socket.IO `alert.new` | api-gateway → web/mobile (current owner only) |
| `alert_updated.schema.json` | Socket.IO `alert.updated` (+ legacy `alert.attended`, `alert.dismissed`) | api-gateway → web/mobile |
| `push_token_register.request.schema.json` | `POST /notifications/push-tokens` | mobile → api-gateway |
| `alert_seen.request.schema.json` | `POST /alerts/:id/seen` | mobile/web → api-gateway |

`fixtures/valid/*.json` must validate; `fixtures/invalid/*.json` must not (file name prefix = schema name).

Vendored copies live in each consumer repo under `contracts/v1/` and are checked against `CHECKSUMS.sha256` by that repo's contract test. Update with `node scripts/contracts-checksums.cjs` (back-end) and re-copy.
