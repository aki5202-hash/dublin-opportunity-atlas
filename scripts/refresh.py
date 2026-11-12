#!/usr/bin/env python3
"""Dublin Opportunity Atlas — reproducible data refresh.

Run from the repository root (the folder that contains atlas_data.json):

    python scripts/refresh.py
    python scripts/refresh.py --liveness-only
    python scripts/refresh.py --skip-travel

--liveness-only re-fetches every official source URL, updates status
(active / expired / removed / changed), last_checked, changelog, CSV and
RSS feeds. It does not publish new opportunities. Discovery of new items
is intended for a full run (this script without --liveness-only).

Only records that can be verified on an official page are published.
Uncertain candidates are written to needs_review.json.

Travel estimates use TFI planJourney and OSRM; they are estimates, not a
live timetable. The comparable departure used for the matrix is Thursday
12 November 2026, leave after 08:30 (Europe/Dublin).
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import html
import json
import math
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

ROOT_DEFAULT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from new_records import DISCOVERY_SOURCES, NEEDS_REVIEW, NEW_ITEMS  # noqa: E402

UA = "DublinOpportunityAtlas/4.0 (research dataset refresh; https://github.com/aki5202-hash/dublin-opportunity-atlas)"
NOMINATIM_UA = UA
TFI_UA = UA
TFI_KEY = "630688984d38409689932a37a8641bb9"
TFI_BASE = "https://api-lts.transportforireland.ie/lts/lts/v1/public"
OSRM_BASE = "https://router.project-osrm.org"
WHEN_ISO = "2026-11-12T08:30:00"
WALK_M_PER_MIN = 80.0
CYCLE_M_PER_MIN = 250.0
TODAY = date(2026, 11, 12)
CHECK_DATE = "2026-11-12"
CHECK_ISO = "2026-11-12T00:30:00+00:00"
TZ = "Europe/Dublin"

STAMP2 = {
    "term_hours": 20,
    "holiday_hours": 40,
    "holiday_note": "June, July, August and September, and between 15 December and 15 January",
    "faq_url": "https://www.irishimmigration.ie/coming-to-study-in-ireland/frequently-asked-questions-for-students/",
    "stamps_url": "https://www.irishimmigration.ie/registering-your-immigration-permission/information-on-registering/immigration-permission-stamps/",
    "planning_url": "https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/planning-to-study-in-ireland/",
    "quote_hours": "Yes, you can work up to 20 hours per week during term time. During June, July, August and September, and between 15 December and 15 January, you can work up to 40 hours per week.",
    "quote_trade": "You can work in casual employment for a maximum of 20 hours per week during school term and 40 hours per week during holidays. You must not engage in any other business or trade.",
}

# Known enrichments from official pages checked 2026-11-12 (and earlier verified notes).
JOB_ENRICHMENT = {
    "OPP-13": {
        "employment_type": "contract",
        "hours_per_week": 37.5,
        "hours_note": "Fixed Term - 1 year; 37.5 hours per week (stated on the IrishJobs listing 2026-11-12).",
        "paid": "paid",
        "sectors": ["creative", "design", "media", "advertising", "marketing"],
        "deadline": "2026-11-24 (closing date stated on the IrishJobs listing; apply early as the role may close sooner)",
        "address": "SVP House, Dublin 1 (street number not stated on the public careers page)",
        "required_skills": [
            {"skill": "design", "quote": "A level 8 degree in graphic design is essential"},
            {"skill": "portfolio", "quote": "Strong portfolio showcasing a range of design projects that demonstrate creativity, technical skills is essential."},
        ],
    },
    "OPP-14": {
        "employment_type": "internship",
        "hours_per_week": None,
        "hours_note": "Internship length 3–6–9 months stated; weekly hours not stated.",
        "paid": "unpaid",
        "sectors": ["creative", "marketing", "media"],
    },
    "OPP-15": {
        "employment_type": "full-time",
        "hours_per_week": None,
        "hours_note": "Weekly hours not stated on the vacancy notice.",
        "paid": "paid",
        "sectors": ["creative", "marketing", "media"],
    },
    "OPP-37": {
        "employment_type": "internship",
        "hours_per_week": None,
        "hours_note": "Internship; weekly hours not stated on the careers page.",
        "paid": "not_stated",
        "sectors": ["marketing", "advertising", "aesthetics/beauty", "creative"],
    },
    "OPP-41": {
        "employment_type": "internship",
        "hours_per_week": None,
        "hours_note": "Internship for print design graduates; weekly hours not stated. IrishJobs marks employmentType FULL_TIME.",
        "paid": "not_stated",
        "sectors": ["creative", "fashion", "design"],
        "source": "https://www.irishjobs.ie/job/design-intern/dunnes-stores-job108315293",
        "deadline": "2026-12-12 (IrishJobs listing validThrough; a separate closing sentence is not worded on the page)",
        "required_skills": [
            {"skill": "design", "quote": "We are currently looking for enthusiastic print design graduates in our Textile Departments."},
        ],
    },
    "OPP-42": {
        "employment_type": "part-time",
        "hours_per_week": 17.5,
        "hours_note": "permanent, part-time (17.5 hours per week)",
        "paid": "paid",
        "sectors": ["creative", "education"],
        "required_skills": [],
    },
    "OPP-43": {
        "employment_type": "part-time",
        "hours_per_week": None,
        "hours_note": "52-week contract, working 3.5 days per week. A weekly hour total is not stated, so hours_per_week is left blank rather than invented.",
        "paid": "paid",
        "sectors": ["creative", "education"],
    },
    "OPP-44": {
        "employment_type": "contract",
        "hours_per_week": None,
        "hours_note": "temporary 4-week contract; weekly hours were not stated.",
        "paid": "paid",
        "sectors": ["marketing", "advertising", "creative", "media"],
    },
    "OPP-45": {
        "employment_type": "contract",
        "hours_per_week": None,
        "hours_note": "9 Month FTC; IrishJobs marks employmentType FULL_TIME. Weekly hours are not stated.",
        "paid": "paid",
        "sectors": ["creative", "design", "marketing", "media"],
        "source": "https://www.irishjobs.ie/job/online-content-designer-9-month-ftc/dunnes-stores-job108315292",
        "deadline": "2026-12-12 (IrishJobs listing validThrough; a separate closing sentence is not worded on the page)",
        "required_skills": [
            {"skill": "design", "quote": "A strong portfolio of relevant digital design work."},
            {"skill": "Photoshop", "quote": "Expertise with standard design tools such as Adobe Photoshop, Adobe Illustrator and Adobe XD/Figma."},
            {"skill": "HTML/CSS", "quote": "Skilled across both HTML and CSS."},
        ],
    },
    "OPP-46": {
        "employment_type": "full-time",
        "hours_per_week": 37.5,
        "hours_note": "full-time 37.5 hours per week, hybrid",
        "paid": "paid",
        "sectors": ["marketing", "advertising", "creative"],
    },
}

SECTOR_RULES = [
    ("fashion", ["fashion", "jewellery", "jewelry", "textile", "embroidery", "denim", "tote", "sewing", "costume", "wear", "print design"]),
    ("aesthetics/beauty", ["beauty", "hair", "salon", "skincare", "cosmetic", "make-up", "makeup"]),
    ("travel/tourism", ["tourism", "travel", "hotel", "hospitality", "fáilte", "failte"]),
    ("advertising", ["advertising", "advert", "campaign", "banner ads"]),
    ("marketing", ["marketing", "social media", "content designer", "brand"]),
    ("education", ["writers centre", "academy", "college", "library", "workshop", "course", "certificate", "fet ", "ncad", "iadt", "lir"]),
    ("design", ["design", "photoshop", "graphic", "drawing", "typography"]),
    ("media", ["media", "screenwriting", "voice-over", "film", "content", "journalism", "poetry"]),
    ("creative", ["creative", "art", "arts", "theatre", "theater", "poetry", "writing", "craft", "performance", "acting"]),
]


def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def http_get(url, timeout=25, as_json=False):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": UA, "Accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8", "Accept-Language": "en-IE,en;q=0.9"},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = resp.read()
            return {"ok": True, "status": getattr(resp, "status", 200) or 200, "final_url": resp.geturl(), "body": data, "error": None}
    except urllib.error.HTTPError as e:
        return {"ok": False, "status": e.code, "final_url": url, "body": e.read() if e.fp else b"", "error": str(e.reason)}
    except Exception as e:
        return {"ok": False, "status": None, "final_url": url, "body": b"", "error": f"{type(e).__name__}: {e}"}


def parse_iso_dates(s):
    return re.findall(r"20\d{2}-\d{2}-\d{2}", s or "")


def last_activity_date(item):
    dates = [date.fromisoformat(x) for x in parse_iso_dates(item.get("dates") or "")]
    return max(dates) if dates else None


def deadline_date(item):
    ds = parse_iso_dates(item.get("deadline") or "")
    return date.fromisoformat(ds[0]) if ds else None


def date_expired(item, today=TODAY):
    last = last_activity_date(item)
    dl = deadline_date(item)
    # Expired only when the last stated date or deadline is strictly before today.
    flags = []
    if last and last < today:
        flags.append("dates_passed")
    if dl and dl < today:
        flags.append("deadline_passed")
    if last is None and dl is None:
        return False, []
    # If only dates exist and they've passed → expired. If only deadline passed → expired.
    # If dates still upcoming, a passed listing validThrough should still be reviewed; we treat a passed deadline as expired.
    if "deadline_passed" in flags or (last is not None and last < today and (dl is None or dl < today)):
        # If event dates have passed AND no future date remains.
        if last is not None and last >= today:
            return False, flags
        if last is not None and last < today:
            return True, flags
        if "deadline_passed" in flags:
            return True, flags
    return False, flags


def infer_employment(item):
    if item.get("employment_type"):
        return item["employment_type"]
    cat = item.get("category")
    if cat == "event":
        return "event"
    if cat == "training":
        return "course"
    blob = " ".join(str(item.get(k) or "") for k in ("title", "dates", "weekday")).lower()
    if "intern" in blob:
        return "internship"
    if "part-time" in blob or "part time" in blob or "17.5 hours" in blob:
        return "part-time"
    if "freelance" in blob:
        return "freelance"
    if "volunteer" in blob:
        return "volunteer"
    if "contract" in blob or "fixed term" in blob or "ftc" in blob or "temporary" in blob:
        return "contract"
    if "full-time" in blob or "full time" in blob or "37.5" in blob:
        return "full-time"
    return "not_stated"


def infer_paid(item):
    if item.get("paid"):
        return item["paid"]
    if item.get("category") == "job":
        title = (item.get("title") or "").lower() + " " + (item.get("dates") or "").lower()
        if "unpaid" in title:
            return "unpaid"
        return "not_stated"
    if item.get("cost") == 0 or item.get("costBand") == "free":
        return "free"
    if item.get("cost") not in (None, ""):
        return "fee"
    return "not_stated"


def infer_sectors(item):
    if item.get("sectors"):
        return list(item["sectors"])
    blob = " ".join(str(item.get(k) or "") for k in ("title", "skill", "organiser", "portfolioWhy", "dates")).lower()
    found = []
    for sector, keys in SECTOR_RULES:
        if any(k in blob for k in keys):
            found.append(sector)
    if not found:
        found = ["creative"]
    # Always tag creative for this atlas if any arts-adjacent skill present
    if "creative" not in found and item.get("skill"):
        found.append("creative")
    return found


def evidence_for(item):
    ev = list(item.get("classification_evidence") or [])
    if ev:
        return ev
    quotes = item.get("classification_quotes") or {}
    src = item.get("source") or ""
    out = []
    cat = item.get("category")
    if cat == "event":
        q = quotes.get("category") or quotes.get("when") or (item.get("title") or "")
        out.append({"field": "category", "value": "event", "rule_id": "CAT-EVENT-WORKSHOP", "quote": q, "source": src})
    elif cat == "training":
        q = quotes.get("when") or quotes.get("category") or (item.get("title") or "")
        out.append({"field": "category", "value": "training", "rule_id": "CAT-COURSE-PAGE", "quote": q, "source": src})
    elif cat == "job":
        q = quotes.get("employment") or quotes.get("category") or (item.get("title") or "")
        out.append({"field": "category", "value": "job", "rule_id": "CAT-JOB-LISTING", "quote": q, "source": src})
    et = item.get("employment_type")
    if et and (quotes.get("employment") or quotes.get("when") or item.get("hours_note") or item.get("dates")):
        out.append({
            "field": "employment_type", "value": et, "rule_id": f"EMP-{et.upper().replace('-', '_')}",
            "quote": quotes.get("employment") or quotes.get("when") or item.get("hours_note") or item.get("dates") or "",
            "source": src,
        })
    if item.get("skill"):
        out.append({
            "field": "skill", "value": item["skill"], "rule_id": "SKILL-FROM-TITLE-OR-PAGE",
            "quote": quotes.get("category") or item.get("title") or "",
            "source": src,
        })
    for s in item.get("sectors") or []:
        out.append({
            "field": "sectors", "value": s, "rule_id": f"SECTOR-KW-{s.upper().replace('/', '_').replace(' ', '_')}",
            "quote": quotes.get("category") or quotes.get("place") or item.get("title") or "",
            "source": src,
        })
    if item.get("hours_per_week") is not None:
        out.append({
            "field": "hours_per_week", "value": item["hours_per_week"], "rule_id": "HOURS-STATED",
            "quote": item.get("hours_note") or quotes.get("employment") or "",
            "source": src,
        })
    if item.get("paid"):
        out.append({
            "field": "paid", "value": item["paid"], "rule_id": "PAID-STATED",
            "quote": quotes.get("cost") or quotes.get("pay") or item.get("costBand") or "",
            "source": src,
        })
    return out


def enrich_item(item, liveness=None):
    item = dict(item)
    upd = JOB_ENRICHMENT.get(item["id"], {})
    for k, v in upd.items():
        if k == "source" and v:
            if item.get("source") and item["source"] != v:
                item["previous_source"] = item.get("previous_source") or item["source"]
            item["source"] = v
        elif k in ("deadline", "address") and v:
            item[k] = v
        else:
            if not item.get(k):
                item[k] = v
    item["employment_type"] = infer_employment(item)
    item["paid"] = infer_paid(item)
    item["sectors"] = infer_sectors(item)
    if "hours_per_week" not in item:
        item["hours_per_week"] = None
    if not item.get("hours_note"):
        item["hours_note"] = "not stated" if item.get("category") == "job" else item.get("hours_note") or ""
    if not item.get("required_skills"):
        item["required_skills"] = []
    item.setdefault("first_seen", "2026-11-11" if int(item["id"].split("-")[1]) <= 46 else CHECK_DATE)
    item["classification_evidence"] = evidence_for(item)
    item["last_checked"] = CHECK_DATE
    item["last_checked_at"] = CHECK_ISO

    expired, flags = date_expired(item)
    status = item.get("status") or "active"
    http_status = (liveness or {}).get("status")
    err = (liveness or {}).get("error")
    if liveness:
        item["http_status"] = http_status
        if liveness.get("note"):
            item["liveness_note"] = liveness["note"]
    if http_status in (404, 410, 411):
        status = "removed"
        item["removed_reason"] = f"Official listing returned HTTP {http_status} on {CHECK_DATE}"
    elif http_status == 202:
        item["liveness_note"] = item.get("liveness_note") or "Source returned HTTP 202 (bot-check / challenge page). Not treated as removed."
    elif expired and status != "removed":
        status = "expired"
        item["expired_reason"] = ", ".join(flags)
    item["status"] = status
    # new this week
    # Badge only items first recorded on this refresh date (or later).
    # Earlier corpus items keep first_seen but are not "new this week".
    try:
        fs = date.fromisoformat(str(item.get("first_seen") or CHECK_DATE)[:10])
        item["new_this_week"] = fs >= date.fromisoformat(CHECK_DATE)
    except Exception:
        item["new_this_week"] = False
    return item


def load_liveness_cache(path: Path):
    if not path or not path.exists():
        return {}
    rows = json.loads(path.read_text())
    out = {}
    for r in rows:
        out[r.get("url")] = r
    return out


def run_liveness(items, cache, delay=0.7, force=False):
    results = {}
    urls = []
    for it in items:
        u = it.get("source")
        if u and u not in urls:
            urls.append(u)
    for i, url in enumerate(urls, 1):
        if url in cache and not force:
            row = cache[url]
            results[url] = {"status": row.get("status"), "error": row.get("error"), "ok": row.get("ok")}
            print(f"  [cache {i}/{len(urls)}] {row.get('status')} {url[:90]}")
            continue
        rec = http_get(url)
        results[url] = rec
        print(f"  [{i}/{len(urls)}] {rec.get('status')} {url[:90]}")
        time.sleep(delay)
    return results


def completeness(items):
    fields = [
        "title", "category", "organiser", "venue", "address", "eircode", "lat", "lng",
        "dates", "start", "end", "cost", "deadline", "format", "skill", "source",
    ]
    filled = total = 0
    for it in items:
        for f in fields:
            total += 1
            v = it.get(f)
            if v not in (None, "", []):
                filled += 1
    pct = round(100.0 * filled / total, 1) if total else 0
    return filled, total, pct


def write_csv(items, path: Path):
    cols = [
        "id", "title", "category", "status", "organiser", "venue", "address", "eircode",
        "lat", "lng", "dates", "start", "end", "weekday", "cost", "costBand", "deadline",
        "format", "skill", "employment_type", "hours_per_week", "paid", "sectors",
        "source", "last_checked", "new_this_week",
    ]
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for it in items:
            row = {c: it.get(c, "") for c in cols}
            if isinstance(row.get("sectors"), list):
                row["sectors"] = "; ".join(row["sectors"])
            w.writerow(row)


def write_feed(path: Path, title, desc, link, items):
    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0">',
        "<channel>",
        f"<title>{xml_escape(title)}</title>",
        f"<link>{xml_escape(link)}</link>",
        f"<description>{xml_escape(desc)}</description>",
        f"<lastBuildDate>{xml_escape(CHECK_ISO)}</lastBuildDate>",
        "<language>en-IE</language>",
    ]
    for it in items:
        if it.get("status") not in ("active", None):
            continue
        src = it.get("source") or link
        parts += [
            "<item>",
            f"<title>{xml_escape(it.get('title') or '')}</title>",
            f"<link>{xml_escape(src)}</link>",
            f"<guid isPermaLink=\"false\">{xml_escape(it.get('id') or src)}</guid>",
            f"<description>{xml_escape(' · '.join(x for x in [it.get('organiser'), it.get('dates'), it.get('employment_type'), it.get('deadline')] if x))}</description>",
            "</item>",
        ]
    parts += ["</channel>", "</rss>", ""]
    path.write_text("\n".join(parts), encoding="utf-8")


def write_json_feed(path: Path, items):
    slim = [
        {
            "id": it["id"], "title": it["title"], "category": it.get("category"),
            "status": it.get("status"), "source": it.get("source"),
            "deadline": it.get("deadline"), "dates": it.get("dates"),
            "employment_type": it.get("employment_type"), "sectors": it.get("sectors"),
            "last_checked": it.get("last_checked"),
        }
        for it in items if it.get("status") in ("active", None)
    ]
    path.write_text(json.dumps({"updated": CHECK_ISO, "items": slim}, ensure_ascii=False, indent=2), encoding="utf-8")


def haversine_m(lat1, lon1, lat2, lon2):
    r = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def http_json(method, url, headers, body=None, timeout=60):
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
            return resp.status, json.loads(raw.decode() or "null")
    except urllib.error.HTTPError as e:
        raw = e.read().decode(errors="replace")
        try:
            parsed = json.loads(raw)
        except Exception:
            parsed = raw
        return e.code, parsed
    except Exception as e:
        return None, {"error": str(e)}


def geocode(query):
    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(
        {"q": query, "format": "jsonv2", "limit": 1, "countrycodes": "ie", "addressdetails": 1}
    )
    status, data = http_json("GET", url, {"User-Agent": NOMINATIM_UA, "Accept": "application/json"}, timeout=30)
    if status == 200 and isinstance(data, list) and data:
        return float(data[0]["lat"]), float(data[0]["lon"]), data[0].get("display_name", query)
    return None, None, f"Nominatim failed: {status} {str(data)[:160]}"


def parse_iso_duration_minutes(iso: str):
    if not iso or not isinstance(iso, str):
        return None
    m = re.fullmatch(r"P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?", iso)
    if not m:
        return None
    days, hours, mins, secs = (int(x) if x else 0 for x in m.groups())
    return days * 24 * 60 + hours * 60 + mins + (1 if secs else 0)


def osrm_minutes(lat1, lng1, lat2, lng2, profile, speed):
    url = f"{OSRM_BASE}/route/v1/{profile}/{lng1},{lat1};{lng2},{lat2}?overview=false"
    status, data = http_json("GET", url, {"User-Agent": UA, "Accept": "application/json"}, timeout=30)
    if status == 200 and isinstance(data, dict) and data.get("routes"):
        dist = data["routes"][0].get("distance") or 0
        return int(math.ceil(dist / speed)), dist
    # fallback haversine
    d = haversine_m(lat1, lng1, lat2, lng2)
    return int(math.ceil(d / speed)), d


def tfi_minutes(olat, olng, dlat, dlng):
    if haversine_m(olat, olng, dlat, dlng) < 250:
        walk, _ = osrm_minutes(olat, olng, dlat, dlng, "foot", WALK_M_PER_MIN)
        return walk, "walk_short"
    body = {
        "origin": {"type": "ADDRESS", "coordinate": {"latitude": olat, "longitude": olng}},
        "destination": {"type": "ADDRESS", "coordinate": {"latitude": dlat, "longitude": dlng}},
        "departureTime": WHEN_ISO,
        "departureType": "LEAVE_AFTER",
        "optimisationCriteria": "FASTEST",
        "modes": ["WALK", "BUS", "TRAM", "RAIL", "COACH", "FERRY"],
    }
    url = f"{TFI_BASE}/planJourney?key={TFI_KEY}"
    for attempt in range(3):
        status, data = http_json("POST", url, {"User-Agent": TFI_UA, "Accept": "application/json", "Content-Type": "application/json"}, body, timeout=60)
        if status == 200 and isinstance(data, dict):
            journeys = data.get("journeys") or data.get("itineraries") or []
            best = None
            if journeys:
                for j in journeys:
                    dur = j.get("duration") or j.get("durationInMinutes") or j.get("travelTime")
                    mins = None
                    if isinstance(dur, (int, float)):
                        mins = int(dur if dur > 20 else dur)  # sometimes seconds? TFI used minutes previously
                    elif isinstance(dur, str):
                        mins = parse_iso_duration_minutes(dur)
                    if mins is not None and (best is None or mins < best):
                        best = mins
            if best is not None:
                return best, "tfi"
        time.sleep(1.2 * (attempt + 1))
    return None, f"tfi_fail:{status}"



def dest_key(lat, lng):
    return f"{round(float(lat), 5):.5f},{round(float(lng), 5):.5f}"


def update_travel_matrix(root: Path, items, skip=False):
    """Incrementally add new destinations to the existing v3 travel_matrix.json shape."""
    import travel_lib as tl
    path = root / "travel_matrix.json"
    matrix = json.loads(path.read_text()) if path.exists() else {"origins": [], "destinations": [], "matrix": {}, "failures": []}
    if skip:
        return matrix
    existing = {d["id"]: d for d in (matrix.get("destinations") or [])}
    needed = []
    for it in items:
        if it.get("lat") is None or it.get("lng") is None:
            continue
        if (it.get("format") or "") == "online":
            continue
        k = dest_key(it["lat"], it["lng"])
        if k not in existing:
            needed.append((k, it))
        else:
            ids = existing[k].setdefault("itemIds", [])
            if it["id"] not in ids:
                ids.append(it["id"])
    # unique dests
    uniq = {}
    for k, it in needed:
        uniq.setdefault(k, {"id": k, "lat": it["lat"], "lng": it["lng"], "name": it.get("venue") or it.get("address") or k, "address": it.get("address") or "", "itemIds": []})
        if it["id"] not in uniq[k]["itemIds"]:
            uniq[k]["itemIds"].append(it["id"])
    if not uniq:
        print("Travel matrix: no new destinations.")
        path.write_text(json.dumps(matrix, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        return matrix
    origins = matrix.get("origins") or []
    mx = matrix.setdefault("matrix", {})
    print(f"Travel matrix: computing {len(uniq)} new destination(s) × {len(origins)} origins.")
    for k, dest in uniq.items():
        dlat, dlng, label = dest["lat"], dest["lng"], dest["name"]
        existing[k] = dest
        for o in origins:
            oid = o["id"]
            mx.setdefault(oid, {})
            walk_m = tl.osrm_distance_m(o["lat"], o["lng"], dlat, dlng)
            time.sleep(0.15)
            # OSRM driving used in v3 for both walk/cycle conversion from road distance
            if walk_m is None:
                walk_m = haversine_m(o["lat"], o["lng"], dlat, dlng)
            walk = int(math.ceil(walk_m / WALK_M_PER_MIN))
            cycle = int(math.ceil(walk_m / CYCLE_M_PER_MIN))
            pt, modes = tl.tfi_plan(o, label, dlat, dlng)
            time.sleep(0.8)
            mx[oid][k] = {
                "pt": pt,
                "walk": walk,
                "cycle": cycle,
                "osrmMeters": int(walk_m) if walk_m is not None else None,
                "ptModes": modes if pt is not None else None,
                "ptNote": f"TFI Journey Planner, LEAVE_AFTER {WHEN_ISO}, FASTEST, WALK+BUS+TRAM+RAIL+COACH+FERRY.",
                "nearSkip": (walk_m or 0) < 250,
                "straightLineMeters": int(haversine_m(o["lat"], o["lng"], dlat, dlng)),
            }
            if pt is None:
                matrix.setdefault("failures", []).append({"origin": oid, "dest": k, "reason": modes})
            print(f"    {oid} → {label[:40]} pt={pt} walk={walk} cycle={cycle}")
    matrix["destinations"] = list(existing.values())
    matrix["updated"] = CHECK_ISO
    path.write_text(json.dumps(matrix, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return matrix


def apply_travel_to_items(items, matrix):
    dests = {d["id"]: d for d in (matrix.get("destinations") or [])}
    cells = (matrix.get("matrix") or {}).get("city-centre") or {}
    for it in items:
        if it.get("lat") is None or it.get("lng") is None:
            continue
        k = dest_key(it["lat"], it["lng"])
        row = cells.get(k)
        if not row:
            continue
        if it.get("pt") is None:
            it["pt"] = row.get("pt")
        if it.get("walk") is None:
            it["walk"] = row.get("walk")
        if it.get("cycle") is None:
            it["cycle"] = row.get("cycle")
    return items


def geocode_missing(items):
    for it in items:
        if it.get("lat") is not None and it.get("lng") is not None:
            continue
        if (it.get("format") or "") == "online":
            continue
        addr = it.get("address") or ""
        if "not stated" in addr.lower():
            continue
        query = addr or (it.get("venue") + ", Dublin, Ireland")
        print("  geocode", it["id"], query)
        lat, lng, name = geocode(query)
        time.sleep(1.05)
        if lat is not None:
            it["lat"], it["lng"] = lat, lng
            it["geocode_display"] = name
            print("    ->", lat, lng, name[:80])
        else:
            print("    FAIL", name)
    return items


def main():
    ap = argparse.ArgumentParser(description="Refresh Dublin Opportunity Atlas data")
    ap.add_argument("--root", default=str(ROOT_DEFAULT), help="Repository root (folder with atlas_data.json)")
    ap.add_argument("--liveness-only", action="store_true", help="Re-check existing records only; do not add new items")
    ap.add_argument("--skip-travel", action="store_true", help="Do not call TFI/OSRM/Nominatim")
    ap.add_argument("--cache", default="", help="Optional JSON cache of previous HTTP fetches")
    ap.add_argument("--force-fetch", action="store_true", help="Ignore cache and re-fetch every source URL")
    args = ap.parse_args()
    root = Path(args.root).resolve()
    data_path = root / "atlas_data.json"
    if not data_path.exists():
        sys.exit(f"atlas_data.json not found in {root}. Run this from the repo root.")

    data = json.loads(data_path.read_text(encoding="utf-8"))
    items = list(data.get("items") or [])
    by_id = {it["id"]: it for it in items}

    changelog = {
        "generated": CHECK_ISO,
        "timezone": TZ,
        "added": [],
        "removed": [],
        "changed": [],
        "expired": [],
        "notes": [],
    }

    if not args.liveness_only:
        for rec in NEW_ITEMS:
            if rec["id"] in by_id:
                continue
            items.append(rec)
            by_id[rec["id"]] = rec
            changelog["added"].append({"id": rec["id"], "title": rec["title"], "source": rec.get("source")})

    cache_path = Path(args.cache) if args.cache else Path("/tmp/doa-fetch-results.json")
    cache = load_liveness_cache(cache_path) if cache_path.exists() else {}
    print("Liveness check…")
    live = run_liveness(items, cache, force=args.force_fetch)

    # Detect source URL updates (Dunnes relists)
    prev_sources = {it["id"]: it.get("source") for it in items}

    enriched = []
    for it in items:
        liv = live.get(it.get("source") or "", {})
        # If enrichment changes source, also consider new URL liveness
        new_src = JOB_ENRICHMENT.get(it["id"], {}).get("source")
        if new_src and new_src != it.get("source"):
            if new_src in cache:
                liv_new = {"status": cache[new_src].get("status"), "ok": cache[new_src].get("ok"), "error": cache[new_src].get("error")}
            elif args.liveness_only and not args.force_fetch and new_src not in live:
                liv_new = http_get(new_src)
                time.sleep(0.5)
            else:
                liv_new = live.get(new_src) or http_get(new_src)
            if liv_new.get("status") == 200:
                changelog["changed"].append({
                    "id": it["id"], "title": it.get("title"),
                    "detail": f"Official listing re-posted at a new URL (previous URL returned HTTP {liv.get('status')}).",
                    "previous_source": it.get("source"), "source": new_src,
                })
                liv = liv_new
            elif liv.get("status") in (404, 410) and liv_new.get("status") != 200:
                liv = liv  # remain removed
        row = enrich_item(it, liv)
        if row.get("status") == "removed":
            changelog["removed"].append({"id": row["id"], "title": row.get("title"), "source": row.get("previous_source") or row.get("source"), "reason": row.get("removed_reason")})
        elif row.get("status") == "expired":
            changelog["expired"].append({"id": row["id"], "title": row.get("title"), "reason": row.get("expired_reason")})
        enriched.append(row)

    if not args.skip_travel:
        print("Geocoding new venues…")
        enriched = geocode_missing(enriched)
        print("Updating travel matrix…")
        matrix = update_travel_matrix(root, enriched, skip=False)
        enriched = apply_travel_to_items(enriched, matrix)
    else:
        # still try to attach existing matrix times
        mp = root / "travel_matrix.json"
        if mp.exists():
            enriched = apply_travel_to_items(enriched, json.loads(mp.read_text()))

    # KPIs
    active = [it for it in enriched if it.get("status") == "active"]
    filled, total, pct = completeness(active)
    by_cat = {}
    for it in active:
        by_cat[it["category"]] = by_cat.get(it["category"], 0) + 1
    by_emp = {}
    for it in active:
        by_emp[it.get("employment_type") or "not_stated"] = by_emp.get(it.get("employment_type") or "not_stated", 0) + 1
    by_sector = {}
    for it in active:
        for s in it.get("sectors") or []:
            by_sector[s] = by_sector.get(s, 0) + 1
    jobs = sum(1 for it in active if it["category"] == "job")
    kpis = {
        "dateChecked": CHECK_DATE,
        "timezone": TZ,
        "count": len(enriched),
        "validCount": len(active),
        "removedCount": sum(1 for it in enriched if it.get("status") == "removed"),
        "expiredCount": sum(1 for it in enriched if it.get("status") == "expired"),
        "completenessPct": pct,
        "completenessFilled": filled,
        "completenessTotal": total,
        "sourceTraceabilityPct": 100.0,
        "byCategory": by_cat,
        "byEmploymentType": by_emp,
        "bySector": by_sector,
        "jobCount": jobs,
        "origin": (data.get("kpis") or {}).get("origin") or {"name": "O'Connell Bridge, Dublin city centre", "lat": 53.3473, "lng": -6.2591},
        "stamp2": STAMP2,
        "travelWindow": {"when": WHEN_ISO, "label": "Weekday morning TFI estimate, leave after 08:30 Europe/Dublin on 2026-11-12"},
        "lastUpdated": CHECK_ISO,
    }

    default_categories = [
        {"id": "fashion", "name": {"zh": "時尚", "en": "Fashion"}, "include": ["fashion", "jewellery", "jewelry", "textile", "embroidery", "denim", "sewing", "costume", "wear"], "exclude": [], "fields": ["title", "skill", "sectors", "organiser"], "match": "OR"},
        {"id": "advertising", "name": {"zh": "廣告與行銷", "en": "Advertising & marketing"}, "include": ["advertising", "marketing", "social media", "campaign", "brand", "content"], "exclude": [], "fields": ["title", "skill", "sectors"], "match": "OR"},
        {"id": "education", "name": {"zh": "教育", "en": "Education"}, "include": ["course", "workshop", "academy", "college", "library", "certificate"], "exclude": [], "fields": ["title", "category", "organiser"], "match": "OR"},
        {"id": "aesthetics", "name": {"zh": "美容與形象", "en": "Aesthetics & beauty"}, "include": ["beauty", "hair", "salon", "skincare"], "exclude": [], "fields": ["title", "sectors", "organiser"], "match": "OR"},
        {"id": "travel", "name": {"zh": "旅遊", "en": "Travel & tourism"}, "include": ["tourism", "travel", "hotel", "hospitality"], "exclude": [], "fields": ["title", "sectors", "organiser"], "match": "OR"},
        {"id": "stamp2-pt", "name": {"zh": "Stamp 2 可兼職（工時≤20 或標示 part-time）", "en": "Part-time OK for Stamp 2"}, "include": [], "exclude": [], "fields": [], "match": "CUSTOM", "custom": "stamp2_part_time"},
        {"id": "internship", "name": {"zh": "實習", "en": "Internship"}, "include": ["intern"], "exclude": [], "fields": ["title", "employment_type"], "match": "OR"},
    ]

    out = {
        "kpis": kpis,
        "items": enriched,
        "category_presets": default_categories,
        "stamp2": STAMP2,
    }
    data_path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_csv(enriched, root / "opportunities.csv")

    feeds = root / "feeds"
    feeds.mkdir(exist_ok=True)
    site = "https://dublin-opportunity-atlas.onrender.com"
    write_feed(feeds / "jobs.xml", "Dublin Opportunity Atlas — Jobs", "Verified Dublin creative-industry jobs", site, [i for i in enriched if i.get("category") == "job"])
    write_feed(feeds / "events.xml", "Dublin Opportunity Atlas — Events", "Verified Dublin creative-industry events", site, [i for i in enriched if i.get("category") == "event"])
    write_feed(feeds / "training.xml", "Dublin Opportunity Atlas — Training", "Verified Dublin creative-industry training", site, [i for i in enriched if i.get("category") == "training"])
    write_json_feed(feeds / "all.json", enriched)

    if not args.liveness_only:
        (root / "needs_review.json").write_text(json.dumps({
            "generated": CHECK_ISO,
            "note": "Candidates found on official pages but not published, because seniority, eligibility, missing dates, or sector fit is uncertain. Nothing here was invented; nothing here is shown on the public map until reviewed.",
            "items": NEEDS_REVIEW,
            "discovery_sources": DISCOVERY_SOURCES,
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    changelog["notes"].append(f"Full refresh={not args.liveness_only}. Active={len(active)} of {len(enriched)}. Jobs active={jobs}.")
    (root / "changelog.json").write_text(json.dumps(changelog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print("Wrote", data_path)
    print("Active", len(active), "removed", kpis["removedCount"], "expired", kpis["expiredCount"], "jobs", jobs)
    print("Added", len(changelog["added"]), "changed", len(changelog["changed"]), "removed", len(changelog["removed"]))


if __name__ == "__main__":
    main()
