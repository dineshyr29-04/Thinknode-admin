# ThinkNode — Freelancer Dashboard

Professional, local-first React dashboard for freelancers and small agencies.

ThinkNode helps manage clients, projects, invoices and payments with a compact, responsive UI built with Vite, React and Tailwind CSS. It is intentionally client-side-first (localStorage-backed) so you can run it quickly for demos, local bookkeeping or prototyping a server-backed workflow.

Key features

- Client & project management with Kanban-style project columns.
- Invoice builder with live preview and export (HTML / JSON / Print/PDF via browser).
- Payments list with status management (Paid / Delayed / Yet to Pay), payment details and per-invoice received amounts.
- Live revenue graphs and service breakdown charts that update when payments are marked Paid.
- Central `AppContext` for consistent, cascading updates across clients, projects and payments (client-side persistence via `localStorage`).

Tech stack

- Frontend: React + Vite
- Styling: Tailwind CSS
- Charts: Recharts
- Icons: Lucide
- State & persistence: Context API + localStorage

Quick start (development)

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

3. Open the local URL printed by Vite in your browser.

Data model and where revenue comes from

- Source of truth for financial data is the `payments` array in `src/context/AppContext.jsx`.
- Charts and stats derive their numbers from `payments[]`:
	- Revenue trend (`revenueData`) uses the payment's `paidDate` (falls back to invoice `date`).
	- Service pie chart (`serviceBreakdown`) sums the actual received amount (`paidAmount`) or falls back to invoice `amount`.
	- Monthly revenue and total earned are computed from `payments[]` (filtered by `status === 'Paid'`).

If you mark a client or an invoice as Paid, the code now records `paidAmount` and `paidDate`. That ensures the pie chart, revenue graph and summary boxes update immediately.

Where to change behavior (developer guide)

- Central logic & persistence: `src/context/AppContext.jsx` — update functions that add/update/delete payments and clients.
- Payments UI and mark-as-paid flows: `src/pages/Payments.jsx` — this is where user actions invoke context functions.
- Charts: `src/pages/Dashboard.jsx` and `src/pages/Payments.jsx` (chart components use `revenueData` and `serviceBreakdown` from context).

If you need to adapt the app to a backend API

1. Implement a small backend (Node/Express, FastAPI, or similar) with endpoints such as `/api/clients`, `/api/invoices`, `/api/payments` and a database (Postgres, Supabase, MongoDB).
2. Replace local reads/writes in `AppContext` with fetch/Axios calls to those endpoints. Keep optimistic UI updates if you like, but ensure errors roll back state.
3. Add an environment variable in `.env`:

```env
VITE_API_URL=https://api.example.com
```

Troubleshooting & tips

- Nothing updating on the dashboard: verify the `payments` array in the browser `localStorage` (`tn_payments`) or add a `console.log` after the context `setPayments` calls to confirm the saved payload includes `status: 'Paid'`, `paidAmount` and `paidDate`.
- Missing month totals: confirm `paidDate` is populated. `monthlyRevenue` is computed from `paidDate` when present and falls back to invoice `date` otherwise.
- To reset demo data: open devtools → Application → Local Storage → delete keys starting with `tn_`.

Contributing

- Open a PR with a clear description and small, focused changes.
- Follow the existing code style (functional components, hooks, no inline CSS). Keep changes minimal and test in the browser.

Where I changed things recently

- The app now records `paidAmount` and `paidDate` when marking payments as Paid so that all charts and summary boxes update in real time. If you need a walkthrough of the exact code paths, see:
	- `src/context/AppContext.jsx`
	- `src/pages/Payments.jsx`
	- `src/pages/Dashboard.jsx`

Next steps I can do for you

- Scaffold a minimal backend (Express + SQLite or Postgres) and provide code to switch `AppContext` to a remote API.
- Add an integration test that marks invoices paid and asserts that charts/stats update.

If you want the backend scaffold or automated tests, tell me which database you prefer and I will add it.

---
Updated March 2026 — ThinkNode