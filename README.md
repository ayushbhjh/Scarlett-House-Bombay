# Scarlett House Bombay Landing Page

Luxury, conversion-focused restaurant landing page built with Next.js 14, Tailwind CSS, and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Admin login

Admin route: `/admin/reservations`

Use `.env.local` values:
- `ADMIN_USER_ID`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_TOKEN`

Defaults are available in `.env.example`, but change them before production.

## Save reservations to Google Sheets

The reservation form now posts to `POST /api/reservations` and appends each row to Google Sheets.
Every form submit is also saved locally to `data/reservations.json` by the backend.

1. Create a Google Cloud service account and enable the Google Sheets API.
2. Share this sheet with that service account email as `Editor`:
   `https://docs.google.com/spreadsheets/d/1WqZbfMToXVX1D-oZaYpFHeeuaoFrzIR1sTkQLTaJM_w/edit?gid=0#gid=0`
3. Copy `.env.example` to `.env.local` and fill:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (keep `\n` escaped)
   - Optional: `GOOGLE_SHEET_RANGE` (defaults to `A:G`; this appends to first sheet)

Columns appended are:
`SubmittedAt`, `Name`, `Phone`, `Guests`, `Date`, `Time`, `Source`.

Health check endpoint:
GET /api/health/sheets

Fetch saved reservations:
GET /api/reservations
# Scarlett-House-Bombay
