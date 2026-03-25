# ARCHITECTURE.md — Duka POS

## System Shape

```
┌─────────────────────────────────────────┐
│              Electron Shell              │
│  ┌─────────────┐   ┌─────────────────┐  │
│  │  Main Process│   │ Renderer (React)│  │
│  │  - IPC bridge│◄─►│ - Sales UI      │  │
│  │  - SQLite    │   │ - Inventory UI  │  │
│  │  - Printer   │   │ - Reports UI    │  │
│  │  - M-Pesa    │   │ - Admin/Config  │  │
│  │  - CSV Export│   │                 │  │
│  └─────────────┘   └─────────────────┘  │
│         │                                │
│    ┌────▼────┐   ┌──────────────┐        │
│    │ SQLite  │   │ USB Printer  │        │
│    │ (local) │   │ (ESC/POS)    │        │
│    └─────────┘   └──────────────┘        │
│         │                                │
│    ┌────▼────────────────┐               │
│    │ M-Pesa Daraja API   │ (online only) │
│    │ + Offline Queue     │               │
│    └─────────────────────┘               │
└─────────────────────────────────────────┘
```

## Key Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Electron + React | Cross-platform desktop; USB printer access via Node; Windows-first |
| 2 | SQLite via better-sqlite3 | Offline-first; no server; fast; single-file DB |
| 3 | ESC/POS via escpos or node-thermal-printer | Mature Node libs for USB thermal printers |
| 4 | M-Pesa Daraja REST API | Official Safaricom API; STK Push for customer payments |
| 5 | IPC bridge pattern | Main process owns DB/printer/network; renderer is pure UI |
| 6 | CSV export for reports | Simple, works offline, importable to Excel/Sheets |

## Tech Stack

- **Runtime:** Electron 28+ (Chromium + Node 20)
- **UI:** React 18 + TailwindCSS (lightweight, fast)
- **State:** Zustand (minimal, no boilerplate)
- **DB:** better-sqlite3 (synchronous, fast, no native compile issues on Windows)
- **Printer:** node-thermal-printer (ESC/POS over USB)
- **M-Pesa:** Axios + Daraja REST endpoints
- **Build:** electron-builder (Windows NSIS installer)
- **Testing:** Vitest (unit) + Playwright (E2E, later)

## Data Flow

1. **Sale:** Renderer creates sale → IPC → Main process inserts into SQLite → decrements stock → returns sale ID
2. **Receipt:** Renderer requests print → IPC → Main process formats ESC/POS commands → sends to USB printer
3. **M-Pesa:** Renderer initiates payment → IPC → Main process calls Daraja STK Push → polls for result (or queues offline)
4. **Export:** Renderer requests CSV → IPC → Main process queries SQLite → writes CSV to filesystem → returns path

## Security

- License key validated locally (SHA-256 hash check against machine ID)
- SQLite DB file permissions restricted to app user
- No data leaves the machine except M-Pesa API calls (user-initiated)
- Daraja credentials stored in local encrypted config (not in source)
