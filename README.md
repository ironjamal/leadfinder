# Lead Finder

A simple internal tool to search local businesses on Google Maps, spot the
ones with no website listed in their Google Business data, and manage
outreach on a lightweight per-lead basis.

**What it does:** Search → find businesses → filter "no website" → save
leads → track basic outreach status → export CSV. That's it — no accounts,
no database, no full CRM.

## 1. Install

```bash
npm install
```

## 2. Add your Google API key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create (or select) a project.
2. Enable the **Places API (New)**.
3. Create an API key under **APIs & Services → Credentials**.
4. (Recommended) Restrict the key to the Places API and, if possible, to your server's IP.
5. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

6. Open `.env.local` and paste your key:

   ```
   GOOGLE_PLACES_API_KEY=your_actual_key_here
   ```

The key is only ever used on the server (inside `src/app/api/search/route.ts`)
and is never sent to the browser.

## 3. Run the project

Development:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Production:

```bash
npm run build
npm start
```

## 4. How to use the tool

1. Enter a **business type** (e.g. "Dentist", "Restaurant", "Gym").
2. Enter a **location** (e.g. "Riyadh, Saudi Arabia").
3. Pick how many results you want (20 / 50 / 100).
4. Click **Find Leads**. The summary bar at the top shows Total Results,
   No Website, Website Listed, and Saved Leads at a glance.
5. Use the **All / No Website / Website Listed** filter to narrow the
   list — "No Website" is visually highlighted since it's the main
   prospecting use case.
6. Each card shows Open in Google Maps, Visit Website (if listed), Call,
   Copy Number, and WhatsApp (when Google provides a safe international
   number) — plus a "Potential Website Opportunity" tag on no-website leads.
7. Click **Save Lead** on any business. Duplicate saves of the same place
   are automatically prevented.
8. Click **Saved Leads** (top right) to open your list. From there you can:
   - Search saved leads by name, category, location, or phone
   - Filter by lead status (New / Contacted / Replied / Interested / Won / Not Interested)
   - Change a lead's status directly from a dropdown
   - Add or edit a short note per lead
   - Select individual leads and **Export Selected**, or **Export All CSV**
   - Delete a single lead, or **Clear all saved leads** (with a confirmation step)

Saved leads, their status, and their notes all persist in the browser's
localStorage — they survive a page refresh, with no backend involved.

## Notes on accuracy

Google Places data is not guaranteed to be complete. "No Website Listed"
means Google's data does not include a website for that business — it does
not guarantee the business has no website at all. Treat it and the
"Potential Website Opportunity" tag as a prospecting signal, not a
verified fact.

WhatsApp links are only generated when Google returns a reliable
international-format phone number for the business (common for the
Gulf/Egypt region this tool targets). If that's not available, you'll
still get Call and Copy Number instead of a broken WhatsApp link.

## Project structure

```
src/
  app/
    api/search/route.ts   # Server-side route that calls the Google Places API
    page.tsx               # Main page (dashboard summary + search + results)
    layout.tsx              # Root layout
    globals.css              # Tailwind + base styles
  components/
    SearchForm.tsx          # Search form (business type, location, count)
    SummaryBar.tsx           # Total Results / No Website / Website Listed / Saved Leads
    FilterBar.tsx           # All / No Website / Website Listed filter
    SkeletonCard.tsx         # Loading placeholder shown while searching
    BusinessCard.tsx        # Single business result card + actions
    OpportunityTag.tsx        # "Potential Website Opportunity" indicator
    SavedLeadsPanel.tsx     # Saved leads: search, status, notes, export, delete
    StatusBadge.tsx         # "Website Listed / No Website / Unknown" badge
  lib/
    googlePlaces.ts         # Google Places API (New) integration + dedup
    csv.ts                   # CSV generation + download helper
    savedLeads.ts             # localStorage read/write + lead status/notes
    phone.ts                  # tel: and wa.me link builders
    types.ts                  # Shared TypeScript types
```

Everything is plain Next.js/React/TypeScript — feel free to edit any file
directly to change behavior or styling.
