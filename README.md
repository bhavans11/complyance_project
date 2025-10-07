# Invoicing ROI Simulator (React + Node.js + SQLite)

## What is included
- backend/: Node.js + Express + SQLite API
- frontend/: React (Vite) single-page app
- README with run instructions

## Quick start

### Prerequisites
- Node.js (v16+ recommended)
- npm
- sqlite3 CLI

### Install & run backend
```bash
cd backend
npm install
node server.js
```
Backend runs on http://localhost:5000

### Install & run frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173 (Vite)

### Notes
- The backend `db.js` will create `roi.db` automatically in the backend folder.
- To save scenarios, use the Save Scenario button after simulating.
- The PDF report endpoint requires an email (lead capture) and will return a PDF directly.
