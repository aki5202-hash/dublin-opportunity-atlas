# Dublin Opportunity Atlas

An interactive map of **verified** creative-industry opportunities in Dublin: events, vocational training, and entry-level / junior / graduate / intern / part-time jobs.

The public site (`index.html`) is a static, no-build dashboard. It uses Leaflet with OpenStreetMap tiles (with [attribution](https://www.openstreetmap.org/copyright)), Chart.js for the equity comparison, and a precomputed public-transport matrix.

The interface is Traditional Chinese with an English toggle. Profile settings, shortlists, custom categories, the application tracker and the weekly planner persist in the browser and can be shared as URL parameters where noted.

**Live site:** https://dublin-opportunity-atlas.onrender.com

Data was last checked on **12 November 2026** (Europe/Dublin). Figures come from official listings. Opportunities and numbers are never invented. Estimates (including travel times) are labelled as estimates.

## Research question

Can job seekers in different parts of Dublin fairly access creative-industry events, vocational training, and entry-level jobs? How do location, time, transport, and cost affect chances of a career change?

## What’s included (v4)

Each record includes (where the official listing states them): organiser, venue, address, dates and times, cost or salary, registration or application deadline, format, skill type, official source URL, local authority area, travel times, employment type, stated hours per week, paid/unpaid, and sector tags.

Every record also has `classification_evidence`: quoted snippets from the official page plus the rule id that fired. The site shows this in a **Why classified this way** drawer, with the source link and last-verified date.

You can create your own categories (keyword include/exclude rules and/or manual tags), preview match counts, inspect conflicts and uncategorised items, export/import JSON, and share rules via the `cats` URL parameter.

Other v4 tools: Stamp 2 work-hours flags (with a link to official Immigration Service Delivery guidance — this is not legal advice), a weekly planner for shortlisted items, side-by-side comparison of up to three opportunities, an application tracker, a skill-gap view against shortlisted job quotes, RSS/JSON feeds, and a changelog of added / removed / changed / expired records.

Salary, fees, hours and deadlines are recorded only when stated on the official page. Fields that are not stated are left blank or marked “not stated”. Jobs use the cost band `n/a (job)`.

## Refreshing the data

The dataset is a static snapshot. To update it in a reproducible way, run the refresh script **from the repository root** (the folder that contains `atlas_data.json`):

```bash
cd dublin-opportunity-atlas
python scripts/refresh.py
```

That command:

1. Re-fetches every official source URL and records HTTP status plus `last_checked`.
2. Marks records `active`, `expired` (dates or deadline strictly before today), `removed` (HTTP 404/410), or `changed` (for example a listing that was re-posted at a new official URL).
3. Searches a defined list of official sources for new opportunities. Only items verified on an official page are published. Uncertain candidates are written to `needs_review.json` instead of the public map.
4. Deduplicates, geocodes new venues (Nominatim, Ireland only), and computes TFI / walk / cycle times for new destinations into `travel_matrix.json`.
5. Writes `atlas_data.json`, `opportunities.csv`, `changelog.json`, and the feeds under `feeds/`.

For a daily liveness check only (status / expired / removed — no discovery of new items, and no TFI calls):

```bash
cd dublin-opportunity-atlas
python scripts/refresh.py --liveness-only --skip-travel
```

Then commit and push:

```bash
git add atlas_data.json changelog.json opportunities.csv travel_matrix.json feeds/ needs_review.json
git commit -m "chore: data refresh"
git push origin main
```

A workflow template lives at `scripts/github-liveness.yml`. To activate the daily liveness check, copy it to `.github/workflows/liveness.yml` and push (this requires the GitHub `workflow` scope). It runs `python scripts/refresh.py --liveness-only --skip-travel` every day at 06:00 UTC and commits any changes using the default `GITHUB_TOKEN` (no extra secrets). Discovery of new items should be run manually with the full `python scripts/refresh.py` command above.

Useful flags: `--root PATH`, `--cache fetches.json`, `--force-fetch`, `--skip-travel`.

The script uses only the Python standard library.

## Methodology

- **Sources.** Official employer career pages, Arts Council, Irish Theatre Institute / Performing Arts Forum, official college course pages, local-authority library and event pages, and reputable Irish job boards (IrishJobs / Jobs.ie). Aggregator salary-tool estimates are not treated as stated salaries. IrishJobs / Jobs.ie `validThrough` is listing expiry, not always a separately worded close.
- **Classification.** Category, skill, employment type and sector tags are assigned by explicit rules. The triggering rule id and a quoted official snippet are stored on the record.
- **Geocoding.** OpenStreetMap Nominatim (Ireland only, WGS84). The City Centre origin is fixed at O’Connell Bridge (53.3473, −6.2591).
- **Public transport.** Transport for Ireland Journey Planner, fastest itinerary, modes WALK+BUS+TRAM+RAIL+COACH+FERRY. The travel matrix uses a comparable weekday-morning departure: Thursday 12 November 2026, leave after 08:30 (Europe/Dublin). These are estimates, not a live timetable. Evening or weekend services may differ.
- **Walk and cycle.** OSRM road-network distance converted at 4.8 km/h and 15 km/h.
- **Custom map pin.** Straight-line distance estimates only, clearly labelled as not TFI.
- **Match score.** A weighted average of travel fit, time-slot fit, cost fit, skill match, portfolio value, and deadline urgency. Weights shift with the chosen goal. Each card explains the score. This is a decision aid, not a ranking of quality.
- **Stamp 2 flags.** Compared only with hours stated on the listing, against the published Immigration Service Delivery term-time (20 hours/week) and holiday (40 hours/week; June–September and 15 December–15 January) limits. [Official FAQ](https://www.irishimmigration.ie/coming-to-study-in-ireland/frequently-asked-questions-for-students/). Not legal advice.
- **Cost bands.** Free; ≤€50; €51–200; >€200; `n/a (job)`; or not stated.

## Local preview

Serve the folder over HTTP (the app fetches JSON, so `file://` will not work):

```
python3 -m http.server 8080
```

Then open http://localhost:8080/

## Licence and attribution

Opportunity records remain the responsibility of their original publishers; follow each official listing for terms and current availability. Map tiles © OpenStreetMap contributors. Travel times are estimates.
