-- Duka POS — SQLite Schema (MVP)
-- All tables use INTEGER PRIMARY KEY (SQLite rowid alias, auto-increment)

CREATE TABLE products (
  id          INTEGER PRIMARY KEY,
  name        TEXT    NOT NULL,
  sku         TEXT    UNIQUE,
  price       REAL    NOT NULL DEFAULT 0,
  cost        REAL    DEFAULT 0,
  stock       INTEGER NOT NULL DEFAULT 0,
  barcode     TEXT,
  is_active   INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE sales (
  id              INTEGER PRIMARY KEY,
  date_time       TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
  subtotal        REAL    NOT NULL DEFAULT 0,
  tax             REAL    NOT NULL DEFAULT 0,
  discount        REAL    NOT NULL DEFAULT 0,
  total           REAL    NOT NULL DEFAULT 0,
  payment_method  TEXT    NOT NULL DEFAULT 'cash',  -- cash | mpesa
  amount_received REAL    DEFAULT 0,
  change_due      REAL    DEFAULT 0,
  mpesa_ref       TEXT,
  status          TEXT    NOT NULL DEFAULT 'completed'  -- completed | voided | pending_mpesa
);

CREATE TABLE sale_items (
  id          INTEGER PRIMARY KEY,
  sale_id     INTEGER NOT NULL REFERENCES sales(id),
  product_id  INTEGER NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL DEFAULT 1,
  unit_price  REAL    NOT NULL,
  line_total  REAL    NOT NULL
);

CREATE TABLE inventory_logs (
  id          INTEGER PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id),
  change      INTEGER NOT NULL,        -- positive = restock, negative = sale/adjustment
  reason      TEXT    NOT NULL,         -- sale | restock | adjustment | return
  timestamp   TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE settings (
  id    INTEGER PRIMARY KEY,
  key   TEXT    NOT NULL UNIQUE,
  value TEXT
);

CREATE TABLE licenses (
  id           INTEGER PRIMARY KEY,
  license_key  TEXT    NOT NULL,
  activated_at TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
  machine_id   TEXT
);

CREATE TABLE mpesa_queue (
  id                  INTEGER PRIMARY KEY,
  sale_id             INTEGER REFERENCES sales(id),
  phone_number        TEXT    NOT NULL,
  amount              REAL    NOT NULL,
  checkout_request_id TEXT,
  status              TEXT    NOT NULL DEFAULT 'pending',  -- pending | sent | confirmed | failed
  created_at          TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at          TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date_time);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_queue_status ON mpesa_queue(status);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
