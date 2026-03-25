# Duka POS - Lightweight POS for Kenyan Small Retailers

Duka POS is a simple, offline-first Point of Sale system designed for small retail shops (dukas) in Kenya. It focuses on core functionalities like sales, inventory management, and receipt printing, with optional M-Pesa integration for cashless transactions.

## Key Features (MVP)

*   **Sales Register:** Process sales with cash and M-Pesa (online/queued).
*   **Inventory Management:** Track product stock levels with basic alerts.
*   **Receipt Printing:** Supports USB ESC/POS compatible thermal receipt printers.
*   **Offline-First:** Core operations function reliably even with intermittent internet.
*   **Simplicity:** User-friendly interface for quick adoption by shop owners.
*   **License:** One-time $400 software license.

## Tech Stack

*   **Runtime:** Electron 28+ (for cross-platform desktop applications)
*   **Frontend:** React 18 + TailwindCSS (for a clean, responsive UI)
*   **State Management:** Zustand (lightweight, minimal boilerplate)
*   **Database:** `better-sqlite3` (fast, synchronous, file-based for offline-first)
*   **Printer Integration:** `node-thermal-printer` (for ESC/POS commands over USB)
*   **Payments:** Safaricom Daraja API (M-Pesa) integration (online, with offline queuing)
*   **Build:** `electron-builder` (for Windows NSIS installer)

## Folder Structure

```
duka-pos/
├── .gitignore
├── dist/                 (Production build output)
├── docs/                 (Documentation for users, developers)
│   ├── how-to-print.md
│   └── license-guide.md
├── index.html            (Main HTML entry point)
├── package.json          (Project dependencies and scripts)
├── planning/             (Project planning artifacts)
│   ├── pos-mvp.md        (Project overview and iteration plan)
│   ├── decisions.md      (Architecture Decision Records)
│   ├── roadmap.md        (Milestones and timeline)
│   └── backlog.md        (Task backlog)
├── projects/             (Separate project workspace)
│   └── duka-pos/         (Actual Duka POS application code)
│       ├── assets/         (Icons, images)
│       ├── src/
│       │   ├── db/           (Database initialization and schema)
│       │   │   ├── init.js
│       │   │   └── schema.sql
│       │   ├── ipc/          (Main process IPC handlers)
│       │   │   ├── index.js    (IPC registration)
│       │   │   ├── products.js
│       │   │   ├── sales.js
│       │   │   ├── ... (settings, printer, mpesa, export handlers)
│       │   ├── main/         (Electron main process)
│       │   │   ├── main.js
│       │   │   └── preload.js
│       │   ├── payments/     (M-Pesa integration logic)
│       │   │   └── mpesa.js
│       │   ├── printer/      (ESC/POS printer logic)
│       │   │   └── escpos.js
│       │   └── renderer/     (Renderer process bootstrapping)
│       │       ├── main.jsx    (React app entry)
│       │       ├── index.html  (Not used in dev, but for prod build)
│       │       └── styles.css
│       ├── src/ui/         (Reusable UI components)
│       │   └── SalesRegister.jsx
│       ├── tests/          (Unit and integration tests)
│       │   ├── unit/
│       │   └── integration/
│       └── App.jsx         (Main React application component)
├── .gitignore
├── README.md
└── ... (other config files like .eslintrc.js, tsconfig.json for future)
```

## Installation and Running Locally (Development)

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd duka-pos
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will launch the Electron app with hot-reloading. The database (`duka-pos.db`) will be created in your user data directory upon first run, and sample products will be seeded if the table is empty.

## MVP Status

The current MVP provides a functional sales register with a product grid, cart, and checkout (cash payment). It includes essential back-end logic for product/inventory management and sales recording via SQLite. Printer and M-Pesa functionalities are currently in placeholder/stub states.

## Future Development

See `planning/pos-mvp/BACKLOG.md` for detailed task breakdown.
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		'