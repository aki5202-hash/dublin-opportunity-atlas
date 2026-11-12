#!/usr/bin/env python3
"""Precompute TFI + walk/cycle times from preset Dublin origins to unique venues."""
from __future__ import annotations

import json
import math
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

OUT_DIR = Path("/workspace/dublin-opportunity-atlas")
DATA = Path("/workspace/dublin-atlas/atlas_data.json")
NOMINATIM_UA = "DublinOpportunityAtlas/3.0 (academic research; polite 1 req/sec)"
TFI_UA = "DublinOpportunityAtlas/3.0 (academic research; accessibility study)"
TFI_KEY = "630688984d38409689932a37a8641bb9"
TFI_BASE = "https://api-lts.transportforireland.ie/lts/lts/v1/public"
OSRM_BASE = "https://router.project-osrm.org"
WHEN_ISO = "2026-11-12T08:30:00"
WALK_M_PER_MIN = 80.0
CYCLE_M_PER_MIN = 250.0

PRESETS = [
    {"id": "city-centre", "name": "City Centre", "nameZh": "市中心", "query": "O'Connell Bridge, Dublin, Ireland", "lat": 53.3473, "lng": -6.2591, "fixed": True},
    {"id": "tallaght", "name": "Tallaght", "nameZh": "Tallaght", "query": "The Square, Tallaght, Dublin, Ireland"},
    {"id": "blanchardstown", "name": "Blanchardstown", "nameZh": "Blanchardstown", "query": "Blanchardstown Centre, Dublin 15, Ireland"},
    {"id": "clondalkin", "name": "Clondalkin", "nameZh": "Clondalkin", "query": "Clondalkin, Dublin, Ireland"},
    {"id": "coolock", "name": "Coolock", "nameZh": "Coolock", "query": "Coolock, Dublin 17, Ireland"},
    {"id": "ballymun", "name": "Ballymun", "nameZh": "Ballymun", "query": "Ballymun, Dublin 9, Ireland"},
    {"id": "finglas", "name": "Finglas", "nameZh": "Finglas", "query": "Finglas, Dublin 11, Ireland"},
    {"id": "dun-laoghaire", "name": "Dún Laoghaire", "nameZh": "Dún Laoghaire", "query": "Dún Laoghaire, County Dublin, Ireland"},
    {"id": "swords", "name": "Swords", "nameZh": "Swords", "query": "Swords, County Dublin, Ireland"},
    {"id": "lucan", "name": "Lucan", "nameZh": "Lucan", "query": "Lucan, County Dublin, Ireland"},
    {"id": "rathmines", "name": "Rathmines", "nameZh": "Rathmines", "query": "Rathmines, Dublin 6, Ireland"},
    {"id": "balbriggan", "name": "Balbriggan", "nameZh": "Balbriggan", "query": "Balbriggan, County Dublin, Ireland"},
]


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


def haversine_m(lat1, lon1, lat2, lon2):
    r = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


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
    # PnYnMnDTnHnMnS or PT#H#M#S
    iso = iso.strip().upper()
    if not iso.startswith("P"):
        return None
    days = hours = minutes = seconds = 0.0
    body = iso[1:]
    if "T" in body:
        date_part, time_part = body.split("T", 1)
    else:
        date_part, time_part = body, ""
    import re
    m = re.search(r"(\d+(?:\.\d+)?)D", date_part)
    if m:
        days = float(m.group(1))
    m = re.search(r"(\d+(?:\.\d+)?)H", time_part)
    if m:
        hours = float(m.group(1))
    m = re.search(r"(\d+(?:\.\d+)?)M", time_part)
    if m:
        minutes = float(m.group(1))
    m = re.search(r"(\d+(?:\.\d+)?)S", time_part)
    if m:
        seconds = float(m.group(1))
    return int(round(days * 24 * 60 + hours * 60 + minutes + seconds / 60.0))


def tfi_plan(origin, dest_name, dest_lat, dest_lon):
    body = {
        "type": "LEAVE_AFTER",
        "modes": ["WALK", "BUS", "TRAM", "RAIL", "COACH", "FERRY"],
        "date": WHEN_ISO,
        "time": WHEN_ISO,
        "routeType": "FASTEST",
        "cyclePlanType": "BALANCED",
        "cycleSpeed": 20,
        "walkingSpeed": 1,
        "maxWalkTime": 40,
        "minComfortWaitTime": 5,
        "includeRealTimeUpdates": False,
        "restrictToFreeTravelPassOnly": False,
        "showNoBikesAllowedOnTrains": False,
        "includeIntermediateStops": False,
        "operator": {"code": "", "name": "Any operator"},
        "origin": {"name": origin["name"], "type": "ADDRESS",
                   "coordinate": {"latitude": origin["lat"], "longitude": origin["lng"]}},
        "destination": {"name": dest_name, "type": "ADDRESS",
                        "coordinate": {"latitude": dest_lat, "longitude": dest_lon}},
    }
    headers = {
        "Ocp-Apim-Subscription-Key": TFI_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": TFI_UA,
    }
    status, data = http_json("POST", TFI_BASE + "/planJourney", headers, body, timeout=60)
    if status != 200 or not isinstance(data, list) or not data:
        return None, f"TFI planJourney HTTP {status}: {str(data)[:180]}"
    best, best_mins = None, None
    for j in data:
        if not isinstance(j, dict):
            continue
        mins = parse_iso_duration_minutes(j.get("duration") or "")
        if mins is None:
            continue
        if best_mins is None or mins < best_mins:
            best, best_mins = j, mins
    if best is None:
        return None, "TFI returned journeys but no parseable duration"
    modes = []
    for leg in best.get("legs") or []:
        mode = (leg.get("mode") or "UNKNOWN").upper()
        if mode not in modes:
            modes.append(mode)
    return best_mins, " + ".join(modes) or "not stated"


def osrm_distance_m(olat, olng, dlat, dlng):
    url = f"{OSRM_BASE}/route/v1/driving/{olng},{olat};{dlng},{dlat}?overview=false"
    status, data = http_json("GET", url, {"User-Agent": TFI_UA, "Accept": "application/json"}, timeout=30)
    if status == 200 and isinstance(data, dict) and data.get("routes"):
        return float(data["routes"][0]["distance"])
    return None


def main():
    items = json.loads(DATA.read_text())["items"]
    dests = {}
    for it in items:
        if it.get("lat") is None or it.get("lng") is None:
            continue
        key = f"{round(it['lat'], 5):.5f},{round(it['lng'], 5):.5f}"
        if key not in dests:
            dests[key] = {
                "id": key,
                "lat": it["lat"],
                "lng": it["lng"],
                "name": it.get("venue") or it.get("address") or it["id"],
                "address": it.get("address") or "",
                "itemIds": [],
            }
        dests[key]["itemIds"].append(it["id"])
    destinations = list(dests.values())
    print(f"Unique destinations: {len(destinations)}")

    origins = []
    for p in PRESETS:
        rec = dict(p)
        if rec.get("fixed"):
            rec["displayName"] = rec["query"]
            rec["geocodeMethod"] = "Fixed study origin (O'Connell Bridge), same coordinates as v1/v2."
        else:
            time.sleep(1.05)
            lat, lng, name = geocode(rec["query"])
            if lat is None:
                print("FAIL geocode", rec["id"], name)
                continue
            rec["lat"], rec["lng"], rec["displayName"] = lat, lng, name
            rec["geocodeMethod"] = f"OpenStreetMap Nominatim, query={rec['query']}"
            print(f"OK {rec['id']}: {lat:.6f},{lng:.6f}  {name}")
        origins.append(rec)

    matrix = {}
    failures = []
    total = len(origins) * len(destinations)
    n = 0
    for origin in origins:
        matrix[origin["id"]] = {}
        for dest in destinations:
            n += 1
            cell = {"pt": None, "walk": None, "cycle": None, "osrmMeters": None, "ptModes": None, "ptNote": None, "nearSkip": False}
            straight = haversine_m(origin["lat"], origin["lng"], dest["lat"], dest["lng"])
            cell["straightLineMeters"] = int(round(straight))
            if straight < 250:
                walk = max(1, int(round(straight / WALK_M_PER_MIN)))
                cycle = max(1, int(round(straight / CYCLE_M_PER_MIN)))
                cell.update({"pt": walk, "walk": walk, "cycle": cycle, "osrmMeters": int(round(straight)),
                             "ptModes": "WALK", "nearSkip": True,
                             "ptNote": f"Origin and venue are {int(round(straight))} m apart (straight line); TFI not called. Walk/cycle from straight-line distance."})
                matrix[origin["id"]][dest["id"]] = cell
                print(f"[{n}/{total}] {origin['id']} -> {dest['name'][:30]} NEAR {cell['pt']} min")
                continue

            time.sleep(0.35)
            dist = osrm_distance_m(origin["lat"], origin["lng"], dest["lat"], dest["lng"])
            if dist is None:
                time.sleep(0.6)
                dist = osrm_distance_m(origin["lat"], origin["lng"], dest["lat"], dest["lng"])
            if dist is not None:
                cell["osrmMeters"] = int(round(dist))
                cell["walk"] = int(round(dist / WALK_M_PER_MIN))
                cell["cycle"] = int(round(dist / CYCLE_M_PER_MIN))
            else:
                # fallback labelled later
                cell["walk"] = int(round(straight / WALK_M_PER_MIN))
                cell["cycle"] = int(round(straight / CYCLE_M_PER_MIN))
                cell["walkFallback"] = "straight-line"

            time.sleep(0.55)
            mins, modes = tfi_plan(origin, dest["name"], dest["lat"], dest["lng"])
            if mins is None:
                time.sleep(1.0)
                mins, modes = tfi_plan(origin, dest["name"], dest["lat"], dest["lng"])
            if mins is not None:
                cell["pt"] = int(round(mins))
                cell["ptModes"] = modes
                cell["ptNote"] = f"TFI Journey Planner, LEAVE_AFTER {WHEN_ISO}, FASTEST, WALK+BUS+TRAM+RAIL+COACH+FERRY."
            else:
                cell["ptNote"] = f"TFI failed: {modes}"
                failures.append((origin["id"], dest["id"], modes))
            matrix[origin["id"]][dest["id"]] = cell
            print(f"[{n}/{total}] {origin['id']} -> {dest['name'][:36]} pt={cell['pt']} walk={cell['walk']} cycle={cell['cycle']}")

    payload = {
        "generatedAt": "2026-11-11",
        "departure": WHEN_ISO,
        "departureNote": (
            "Public-transport minutes are TFI Journey Planner estimates for a comparable weekday morning "
            "departure (Thursday 12 November 2026, leave after 08:30, Europe/Dublin), fastest itinerary, "
            "modes WALK+BUS+TRAM+RAIL+COACH+FERRY. They are not a live timetable. Evening or weekend services may differ. "
            "Walk and cycle minutes use OSRM road-network distance converted at 4.8 km/h and 15 km/h. "
            "Pairs under 250 m use straight-line distance and skip TFI."
        ),
        "origins": origins,
        "destinations": destinations,
        "matrix": matrix,
        "failures": [{"origin": a, "dest": b, "error": c} for a, b, c in failures],
    }
    path = OUT_DIR / "travel_matrix.json"
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    print("Wrote", path, "failures", len(failures))


if __name__ == "__main__":
    main()
