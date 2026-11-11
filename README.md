# Dublin Opportunity Atlas

An interactive map of verified creative-industry opportunities in Dublin: events, vocational training, and entry-level / junior / graduate / intern jobs.

The public site (`index.html`) is a static, no-build dashboard. It uses Leaflet with OpenStreetMap tiles (with [attribution](https://www.openstreetmap.org/copyright)), Chart.js for the equity comparison, and a precomputed public-transport matrix. You can set a personal profile (home area, travel mode, weekly free time, budget, skills, goal), see a transparent match score, compare how many in-person opportunities are reachable from different Dublin areas, star a shortlist, export CSV or a calendar file, and print a personal plan.

The interface is Traditional Chinese with an English toggle. Profile settings persist in the browser and can be shared as URL parameters.

Data was last checked on 11 November 2026 (Europe/Dublin). The dataset contains 46 valid records (19 events, 17 training items, 10 jobs). As of that date and time, no item had all of its dates or its deadline already in the past; the app will mark and hide such items if they appear later.

## Research question

Can job seekers in different parts of Dublin fairly access creative-industry events, vocational training, and entry-level jobs? How do location, time, transport, and cost affect chances of a career change?

## What’s included

Each record includes (where the official listing states them): organiser, venue, address, dates and times, cost or salary, registration or application deadline, format, skill type, official source URL, local authority area, and travel times.

Salary, fees, and deadlines are recorded only when stated on the official page. Fields that are not stated are left blank or marked “not stated” — they are never invented. Jobs use the cost band `n/a (job)`.

`atlas_data.json` and `opportunities.csv` are the source tables. `travel_matrix.json` holds TFI and walk/cycle estimates from twelve preset origins (City Centre, Tallaght, Blanchardstown, Clondalkin, Coolock, Ballymun, Finglas, Dún Laoghaire, Swords, Lucan, Rathmines, Balbriggan) to each geocoded venue.

## Methodology

- **Sources.** Official employer career pages, Arts Council, Irish Theatre Institute / Performing Arts Forum, and reputable Irish job boards (for example IrishJobs). Aggregator salary-tool estimates are not treated as stated salaries. IrishJobs `validThrough` is listing expiry, not always a separately worded close.
- **Geocoding.** OpenStreetMap Nominatim (Ireland only, WGS84). The City Centre origin is fixed at O’Connell Bridge (53.3473, −6.2591).
- **Public transport.** Transport for Ireland Journey Planner, fastest itinerary, modes WALK+BUS+TRAM+RAIL+COACH+FERRY. The travel matrix uses a comparable weekday-morning departure: Thursday 12 November 2026, leave after 08:30 (Europe/Dublin). These are estimates, not a live timetable. Evening or weekend services may differ.
- **Walk and cycle.** OSRM road-network distance converted at 4.8 km/h and 15 km/h.
- **Custom map pin.** Straight-line distance estimates only, clearly labelled as not TFI.
- **Match score.** A weighted average of travel fit, time-slot fit, cost fit, skill match, portfolio value, and deadline urgency. Weights shift with the chosen goal (explore / build portfolio / get a job). Each card explains the score. This is a decision aid, not a ranking of quality.
- **Cost bands.** Free; ≤€50; €51–200; >€200; `n/a (job)`; or not stated.
- **Equity panel.** Counts how many in-person, geocoded opportunities are within 30 / 45 / 60 minutes by public transport from each preset origin, plus median stated fee and the share that is free or evening/weekend feasible. Insight sentences are generated from those counts only.

## Known gaps

Some job listings do not state a street, so travel cannot be estimated and they are omitted from area comparisons. Entry-level creative vacancies are scarce on official channels. Map range rings are schematic distance, not true transit isochrones.

## Local preview

Serve the folder over HTTP (the app fetches JSON, so `file://` will not work):

```
python3 -m http.server 8080
```

Then open http://localhost:8080/

## Licence and attribution

Opportunity records remain the responsibility of their original publishers; follow each official listing for terms and current availability. Map tiles © OpenStreetMap contributors. Travel times are estimates.
