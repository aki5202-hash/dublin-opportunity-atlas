# Dublin Opportunity Atlas

An interactive map and dashboard of verified creative-industry opportunities in Dublin: events, vocational training, and entry-level / junior / graduate / intern jobs.

The public site is a single-page dashboard (`index.html`) with filters, a sortable table, a cost-versus-time chart, and an OpenStreetMap street basemap (Leaflet, with [OpenStreetMap](https://www.openstreetmap.org/copyright) attribution). `atlas_data.json` and `opportunities.csv` contain the same underlying records.

Data was last checked on 11 November 2026 (Europe/Dublin). The dataset contains 46 valid records (19 events, 17 training items, 10 jobs).

## Research question

Can job seekers in different parts of Dublin fairly access creative-industry events, vocational training, and entry-level jobs? How do location, time, transport, and cost affect chances of a career change?

## What’s included

Each record includes (where the official listing states them): organiser, venue, address, dates and times, cost or salary, registration or application deadline, format, skill type, official source URL, local authority area, and travel times from a fixed origin at O’Connell Bridge, Dublin city centre (53.3473, −6.2591).

Salary, fees, and deadlines are recorded only when stated on the official page. Fields that are not stated are left blank or marked “not stated” — they are never invented. Jobs use the cost band `n/a (job)`.

## Methodology

- **Sources.** Official employer career pages, Arts Council, Irish Theatre Institute / Performing Arts Forum, and reputable Irish job boards (for example IrishJobs). Aggregator estimates (such as board-generated salary tools) are not treated as stated salaries. IrishJobs `validThrough` is recorded as listing expiry, which is not always a separately worded closing date. Listings that have closed, passed their deadline, or return HTTP 410 are excluded.
- **Geocoding.** OpenStreetMap Nominatim (Ireland only, WGS84).
- **Public transport times.** Transport for Ireland Journey Planner (fastest itinerary after a weekday daytime departure; walking, bus, tram, rail, coach, and ferry).
- **Walk and cycle times.** Distance from the public OSRM router, converted at 4.8 km/h (walking) and 15 km/h (cycling). These are estimates for one departure window, not a timetable guarantee.
- **Cost bands.** Free; ≤€50; €51–200; >€200; `n/a (job)`; or not stated.
- **Portfolio value.** High = NFQ-accredited programmes, multi-week making courses, or paid / professional jobs and internships that produce client or brand work. Medium = short tutored workshops or recurring artist-led classes. Low = talks, advice clinics, webinars, networking, or self-led drop-ins.
- **Time filters.** Evening-feasible items start at 18:00 or later, run on a weekend, or are online. A Monday–Wednesday daytime conflict is recorded when attendance is required Monday–Wednesday 09:00–17:00. Unstated job office hours are treated as weekday daytime.

At the last check, record completeness was 90.1% (1,326 of 1,472 brief-field cells filled) and source traceability was 100% (every record has an official or reputable listing URL).

## Local preview

Open `index.html` in a web browser. The dashboard embeds its data and loads Leaflet from a public CDN; no build step is required. The CSV and JSON files are provided for reuse and audit.

## Licence and attribution

Opportunity records remain the responsibility of their original publishers; follow each official listing for terms and current availability. Map tiles © OpenStreetMap contributors.
