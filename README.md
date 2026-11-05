# Thriver Hub demo

A single-file clickable demo of the proposed CFS Recovery platform, with built-in team feedback.

## Deploy (GitHub + Vercel)
1. Push this folder to a GitHub repo.
2. vercel.com → Add New Project → import the repo → Deploy. No build settings needed; it is a static site.
3. Every push to `main` redeploys automatically.

## Team feedback → Google Sheet
Notes left in Feedback mode are stored in a Google Sheet so the whole team sees them.
Follow the setup steps at the top of `Code.gs`, then paste the Web app URL into `SHEET_API_URL` near the top of the `<script>` in `index.html`.
Leave `SHEET_API_URL` blank and notes save only on each person's device.

## Files
- `index.html` — the demo
- `Code.gs` — the Google Apps Script that turns a Sheet into the feedback backend
- `vercel.json` — tells Vercel this is a static site
