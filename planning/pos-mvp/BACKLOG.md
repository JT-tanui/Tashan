# BACKLOG.md — Duka POS Sprint Backlog

## Sprint 1 (Week 1-2): Foundation + Core Sales

### S1.1 — Repo scaffold & tooling
- [x] Init Electron + React project (electron-builder, Vite)
- [x] Add TailwindCSS
- [x] Add better-sqlite3 dependency
- [x] Add node-thermal-printer dependency
- [x] Add axios (for Daraja)
- [x] Configure electron-builder for Windows NSIS
- [x] Create folder structure (src/main, src/renderer, src/db, src/printer, src/payments)

### S1.2 — Database schema & migrations
- [x] Create schema.sql with all tables
- [x] Write migration runner (apply schema on first launch)
- [x] Seed sample products for dev/testing

### S1.3 — IPC bridge
- [ ] Define IPC channels (products:list, products:create, sales:create, etc.)
- [ ] Main process handlers for each channel
- [ ] Preload script exposing safe API to renderer

### S1.4 — Sales register (core)
- [ ] Sales page UI: product search/select, cart, totals
- [ ] Add-to-cart with quantity, price, discount
- [ ] Tax calculation (configurable rate from settings)
- [ ] Save sale to DB, decrement stock
- [ ] Cash payment flow: enter amount received, show change

### S1.5 — Product catalog & inventory
- [ ] Products list page (name, price, stock, active status)
- [ ] Add/edit product form
- [ ] Stock adjustment (restock) with reason logging
- [ ] Low-stock indicator (configurable threshold)

---

## Sprint 2 (Week 3-4): Receipts, M-Pesa, Reports

### S2.1 — Receipt printing
- [ ] ESC/POS receipt template (store name, date, items, totals, payment method)
- [ ] Print receipt on sale completion
- [ ] Test print button in admin/settings
- [ ] Printer config UI (select port/driver)

### S2.2 — M-Pesa Daraja integration
- [ ] Daraja auth (consumer key/secret → access token)
- [ ] STK Push initiation
- [ ] Transaction status polling
- [ ] Offline queue: save pending M-Pesa requests to DB, retry when online
- [ ] M-Pesa payment flow in sales UI

### S2.3 — Reports & CSV export
- [ ] Daily sales summary (total revenue, transaction count, top items)
- [ ] Date range filter
- [ ] CSV export of sales data
- [ ] End-of-day workflow (summary screen + export prompt)

### S2.4 — Admin & configuration
- [ ] Settings page: store name, address, tax rate, low-stock threshold
- [ ] License activation page (enter key, validate, store locally)
- [ ] Daraja credentials config (consumer key/secret, shortcode)
- [ ] Printer settings

---

## Sprint 3 (Week 5-6): Polish & Package

### S3.1 — UX polish
- [ ] Keyboard shortcuts for common actions (F1=new sale, F2=pay, etc.)
- [ ] Loading states and error handling
- [ ] Empty states (no products, no sales)
- [ ] Confirmation dialogs for destructive actions

### S3.2 — Packaging & installer
- [ ] Windows NSIS installer via electron-builder
- [ ] App icon and branding ("Duka POS")
- [ ] Auto-create DB on first launch
- [ ] First-run setup wizard (store info + license + printer)

### S3.3 — Documentation
- [ ] README with install/run instructions
- [ ] User guide (PDF or in-app help)
- [ ] License activation guide
- [ ] Printer setup guide (tested models list)

---

## Backlog (post-MVP)
- [ ] Multi-device sync via cloud backend
- [ ] Barcode scanner support
- [ ] Customer management (loyalty, credit)
- [ ] WhatsApp/SMS digital receipts
- [ ] Dashboard with charts
- [ ] macOS and Linux builds
- [ ] Auto-updates (electron-updater)
