# POS MVP Plan — Kenya small retailers (dukas)  

Goal: Deliver a lightweight software-only POS for small shops in Kenya with a one-time license of $400. Offline-first, supports sales, inventory, and receipts. Includes USB thermal receipt printer support and M-Pesa + cash payments. No restaurant features. 

## Assumptions
- Target customers: small retail shops and dukas in Kenya
- License: one-time $400 per install; software-only; no ongoing subscription
- Hardware: software-only; receipt printer via USB (thermal) supported via local app
- Connectivity: offline-first; online features optional for future
- Payment: Cash and M-Pesa (Safaricom Daraja) available via API when online; offline queue for later
- Platform: desktop or tablet with a local app (Electron-based) to access USB printer and local DB
- Compliance: basic data protection; no personal data collection beyond business data needed to operate POS

## MVP Scope (Must-have)
- Sales register
  - Create/sell items using a catalog or quick-add
  - Line items with quantity, price, discount (optional)
  - Compute total, tax (optional), and change
  - Save sale with timestamp and status
- Inventory management
  - Product catalog with stock levels
  - Stock decrement on sale; restock capability
  - Low-stock alerts
- Receipts
  - Printable receipts via USB thermal printer (ESC/POS)
  - Simple receipt layout: shop name, date/time, items, totals, payment method
- Payments
  - Cash handling (record cash received, change due)
  - M-Pesa flow (Safi Daraja) when online; queue offline if network unavailable
  - Optional receipt for M-Pesa payments (digital or printed)
- Admin/config
  - License activation (enter license key)
  - Printer configuration (port/driver) and test print
  - Basic store info (name, address, tax rate)
- Data model
  - Local SQLite database with schema for products, sales, sale_items, inventory_logs, licenses, settings
- Security & licensing
  - Local license key storage; basic validation; data-at-rest protection (encryption at rest optional for MVP)

## Non-functional requirements
- Offline-first: All core features work without internet; data queued for remote sync in future
- Performance: App starts quickly; sales entry response < 200ms per item; receipts print reliably
- Reliability: Durable local DB with simple backup/export options
- Usability: Clean, minimal UI; quick open/close of day flow
- Portability: Works on Windows/macOS; optional mobile via container if needed later
- Security: License validation; no network calls for core operations unless requested (M-Pesa) 

## Architecture overview
- Frontend: Electron app with React (or lightweight framework) for cross-platform UI
- Local datastore: SQLite (via better-sqlite3) for offline-first operations
- Printer integration: Node.js module to communicate with ESC/POS printers over USB
- Payments: M-Pesa integration via Safaricom Daraja API when online; offline queue persisted in DB
- Sync (future): Optional cloud backend for multi-device syncing; initial MVP is standalone

## Data model (high-level)
- products: id, name, sku, price, cost, stock, barcode, is_active
- sales: id, store_id, date_time, total, tax, discount, payment_method, status
- sale_items: id, sale_id, product_id, quantity, unit_price, line_total
- licenses: id, license_key, activated_at, installed_on
- settings: id, key, value
- inventory_logs: id, product_id, change, reason, timestamp
- receipts: id, sale_id, format, exported_at

## Integrations & hardware
- USB thermal receipt printer: ESC/POS commands via Node.js library; implement test_print flow
- M-Pesa (Safaricom Daraja): REST API integration; support for STK push or direct payment; handle webhook callbacks in future (not required for MVP)

## License & pricing model
- One-time license key stored locally; license validation logic in the app
- No cloud subscription in MVP; future options may include optional cloud features with subscription

## MVP success criteria
- Ability to perform 3 typical sales with 2–3 products each, generate printable receipts, and update inventory accordingly
- Cash and M-Pesa payment flows demonstrated (with M-Pesa simulated if needed for testing)
- Offline operation per above; no crashes when internet is down
- License activation works with a valid key

## Risks & mitigations
- Printer compatibility: provide a list of tested printer models and a robust test print flow; include a fallback print template
- M-Pesa integration: rely on official Daraja sandbox for testing; design queueing for offline mode
- Offline sync: design simple queue and durability; plan for eventual cloud sync with conflict resolution
- Licensing: ensure license can be activated offline; consider license revocation or upgrade path

## Roadmap & milestones
- Week 0-1: Finalize requirements, create backlog, design DB schema, set up repo
- Week 2-3: MVP core — sales, inventory, receipts; basic UI; printer test
- Week 4-5: M-Pesa integration skeleton and offline queue; cash handling flows
- Week 6: Basic reports (daily totals, top items) and day-end workflow
- Week 7-8: Polish, docs, packaging, build/installers, vendor materials
- Post-MVP: pilot with 1-2 shops; gather feedback; iterate

## Acceptance criteria (MVP)
- Licensed at least 1 store; license activation saves locally
- Create a sale with 2–3 items; stock updates correctly
- Generate and print a receipt via USB printer; receipt matches layout requirements
- Process a cash payment; verify recording of change
- M-Pesa flow can be completed online; queue works when offline
- Admin can configure store details and printer; test print works

## Next actions for us
- Confirm the proposed MVP scope aligns with your vision (any additions/removals)
- Decide on UI framework (React vs Svelte) and whether to use Electron for desktop or a web app wrapper
- Set up a repo skeleton and initial database schema
- Create a licensing flow and a test M-Pesa integration plan
- Draft a 2-week sprint plan with concrete tasks and owners

If you’re happy, I’ll start by creating a repo skeleton and the initial database schema, then lay out a concrete sprint plan with tasks and owners.