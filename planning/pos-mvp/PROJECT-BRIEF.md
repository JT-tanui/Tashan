# PROJECT-BRIEF.md

## Project

- Name: Duka POS (MVP)
- Slug: duka-pos-mvp
- Status: greenfield

## Problem

Lightweight, offline-first POS for small retail shops (dukas) in Kenya. Current solutions are often too complex, require internet, or are overpriced.

## Users

- Primary user(s): Duka owners and shop attendants in Kenya.
- Jobs to be done:
  - Process sales quickly (cash/M-Pesa).
  - Track inventory levels.
  - Print thermal receipts via USB.
  - Export end-of-day sales data (CSV).

## Success Criteria

- MVP success metric(s): First store licensed at $400; system processes 5 sales with thermal receipt printing and correct inventory updates.
- Release target: v0.1.0 in 8 weeks.

## Constraints

- Tech constraints: Windows-first Electron app; local-only SQLite DB.
- Time/budget constraints: 8-week MVP timeline.
- Non-functional requirements: Offline-first; Daraja M-Pesa sandbox integration; ESC/POS thermal printer support.
