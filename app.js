/* Dublin Opportunity Atlas v3 */
"use strict";

const CHECK_DATE = (window.DOA_CHECK_DATE || "2026-11-12");
const TODAY = new Date(); // expiry uses the viewer's clock; dataset last_checked is separate
const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABEL = {
  zh: { mon: "一", tue: "二", wed: "三", thu: "四", fri: "五", sat: "六", sun: "日" },
  en: { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" }
};
const PERIODS = ["morning", "afternoon", "evening"];
const PERIOD_HOURS = { morning: [6, 12], afternoon: [12, 18], evening: [18, 24] };
const CAT = { event: { zh: "活動", en: "Event" }, training: { zh: "訓練", en: "Training" }, job: { zh: "職缺", en: "Job" } };
const SKILLS = ["design", "writing", "photography", "digital marketing", "performance", "craft/fashion", "business", "AI/tech"];
const STORAGE_PROFILE = "doa-profile-v3";
const STORAGE_SHORT = "doa-shortlist-v3";

const I18N = {
  zh: {
    kicker: "Dublin Opportunity Atlas", title: "都柏林機會地圖集",
    checked: "資料核對：2026-11-11（Europe/Dublin）",
    navPicks: "精選", navMap: "地圖", navEquity: "公平洞察", navCal: "行事曆", navShort: "短名單", navMethod: "方法",
    share: "分享設定", myProfile: "我的設定",
    heroTitle: "從你所在的地方，看清能去的機會。",
    heroLede: "這是一份以官方來源核實的都柏林創意產業活動、職業訓練與入門職缺地圖。設定住家、通勤與空檔後，系統會依透明公式計算個人媒合分數，並比較各區可達性——數字皆來自資料，不會臆造機會。",
    yourSetup: "你的設定", editProfile: "編輯設定", copyLink: "複製分享連結",
    topPicks: "為你精選", topPicksSub: "依媒合分數排序。每張卡片都會說明「為什麼適合你」。",
    onlySkills: "只看感興趣的技能",
    mapTitle: "地圖與清單",
    mapSub: "標記依可達性上色；可縮放叢集。點選地圖或清單會互相同步。環圈為示意距離，不是真正的交通等時圈。",
    equityTitle: "各區公平洞察",
    equitySub: "以預設起點、平日上午 TFI 大眾運輸時間，比較 30／45／60 分鐘內可達的面對面機會。",
    insightsTitle: "由資料生成的觀察",
    barriersTitle: "目前設定下被排除的原因",
    barriersSub: "以你的通勤上限、空檔、預算與截止日期，硬性篩掉的筆數（線上項目不受通勤限制）。",
    calTitle: "行事曆與截止日期",
    calSub: "即將到來的場次與申請截止。三日內截止會標示「即將截止」。",
    icsAll: "下載短名單全部 .ics",
    shortTitle: "短名單與個人計畫",
    shortSub: "為機會按星號收藏。可匯出 CSV，或列印一份只含短名單的計畫。",
    exportCsv: "匯出 CSV", printPlan: "列印計畫", methodTitle: "資料透明度",
    downloadCsv: "下載 opportunities.csv",
    footerMap: "地圖圖磚 © OpenStreetMap contributors。通勤時間為估計值，不是即時時刻表。",
    onboardTitle: "設定你的檔案", back: "上一步", skip: "略過", next: "下一步", done: "完成",
    source: "來源", star: "加入短名單", unstar: "已收藏", ics: "下載 .ics",
    travelEst: "估計", tfi: "TFI 估計", customEst: "直線距離估計（非 TFI）",
    unknownStreet: "刊登未載明街道，無法估算通勤", online: "線上，無需通勤",
    expired: "已過期", soon: "即將截止", todayFlag: "今日", deadlineSoon: "即將截止",
    why: "為什麼適合你",
    noPicks: "目前沒有符合條件的精選。試試放寬通勤時間、空檔或預算。",
    copied: "已複製連結", filterAll: "全部", cat: "類型", cost: "費用", format: "形式",
    reach: "可達性", search: "搜尋標題", reachable: "可達", stretch: "略遠", far: "較遠", unknown: "未知",
    modePt: "大眾運輸", modeWalk: "步行", modeCycle: "騎行",
    goalExplore: "探索", goalPortfolio: "累積作品", goalJob: "尋找工作",
    clickMap: "在地圖上點選住家", home: "住家", slots: "每週空檔", budget: "預算上限",
    skills: "感興趣的技能", goal: "目標", maxMin: "最長通勤（分）",
    morning: "上午", afternoon: "下午", evening: "晚上", noBudget: "不設上限",
    formula: "媒合分數公式", barriersTravel: "通勤超過上限", barriersTime: "與空檔不符",
    barriersCost: "超出預算", barriersDeadline: "已截止",
    emptyShort: "短名單還是空的。在精選或清單裡按星號收藏。",
    setHomeFirst: "請先選一個預設地區，或在地圖上點選住家。",
    estimateNote: "以下為估計值，不是即時時刻表。"
  },
  en: {
    kicker: "Dublin Opportunity Atlas", title: "Dublin Opportunity Atlas",
    checked: "Checked: 2026-11-11 (Europe/Dublin)",
    navPicks: "Top picks", navMap: "Map", navEquity: "Equity", navCal: "Calendar", navShort: "Shortlist", navMethod: "Method",
    share: "Share profile", myProfile: "My profile",
    heroTitle: "See which opportunities you can actually reach.",
    heroLede: "A verified map of Dublin creative-industry events, vocational training and entry-level jobs. Set your home, travel and free time to get a transparent match score and compare areas. Figures come from the source data; opportunities are never invented.",
    yourSetup: "Your setup", editProfile: "Edit profile", copyLink: "Copy share link",
    topPicks: "Top picks for you", topPicksSub: "Ranked by match score, each with a short explanation.",
    onlySkills: "Only skills I chose",
    mapTitle: "Map and list",
    mapSub: "Markers are coloured by reachability and clustered. The map and list stay in sync. Range rings are schematic distance, not true transit isochrones.",
    equityTitle: "Equity across areas",
    equitySub: "For preset origins, compares how many in-person opportunities are reachable within 30 / 45 / 60 minutes on weekday-morning TFI public transport.",
    insightsTitle: "Insights generated from the data",
    barriersTitle: "Why items drop out of your profile",
    barriersSub: "Hard exclusions from your travel cap, free-time slots, budget and deadlines (online items are not limited by travel).",
    calTitle: "Calendar and deadlines",
    calSub: "Upcoming sessions and application deadlines. Deadlines within three days are flagged.",
    icsAll: "Download shortlist .ics",
    shortTitle: "Shortlist and personal plan",
    shortSub: "Star opportunities to save them. Export CSV or print a plan with only your shortlist.",
    exportCsv: "Export CSV", printPlan: "Print plan", methodTitle: "Data transparency",
    downloadCsv: "Download opportunities.csv",
    footerMap: "Map tiles © OpenStreetMap contributors. Travel times are estimates, not a live timetable.",
    onboardTitle: "Set up your profile", back: "Back", skip: "Skip", next: "Next", done: "Done",
    source: "Source", star: "Shortlist", unstar: "Saved", ics: "Download .ics",
    travelEst: "estimate", tfi: "TFI estimate", customEst: "Straight-line estimate (not TFI)",
    unknownStreet: "Street not stated on the listing, so travel cannot be estimated",
    online: "Online, no travel", expired: "Expired", soon: "Deadline soon", todayFlag: "Today",
    deadlineSoon: "Deadline soon", why: "Why this matches",
    noPicks: "No top picks under the current filters. Try a longer travel cap, more free-time slots, or a higher budget.",
    copied: "Link copied", filterAll: "All", cat: "Type", cost: "Cost", format: "Format",
    reach: "Reach", search: "Search titles", reachable: "Within cap", stretch: "A little further",
    far: "Farther", unknown: "Unknown",
    modePt: "Public transport", modeWalk: "Walk", modeCycle: "Cycle",
    goalExplore: "Explore", goalPortfolio: "Build a portfolio", goalJob: "Get a job",
    clickMap: "Click the map to set home", home: "Home", slots: "Weekly free time",
    budget: "Budget cap", skills: "Skills of interest", goal: "Goal", maxMin: "Max travel (minutes)",
    morning: "Morning", afternoon: "Afternoon", evening: "Evening", noBudget: "No cap",
    formula: "Match-score formula", barriersTravel: "Travel over cap", barriersTime: "Time slot mismatch",
    barriersCost: "Over budget", barriersDeadline: "Deadline passed",
    emptyShort: "Your shortlist is empty. Star items in the picks or list.",
    setHomeFirst: "Please pick a preset area, or click the map to set home.",
    estimateNote: "Figures below are estimates, not a live timetable."
  }
};

let DATA = null, MATRIX = null, map, cluster, homeMarker, chart, pickMap = null;
let rings = [];
let pickMarkerId = null;
let onboardStep = 0;
let profile = defaultProfile();
let shortlist = new Set();
let filters = { category: "all", costBand: "all", format: "all", reach: "all", q: "", hideExpired: true };

function t(key) { return (I18N[profile.lang] || I18N.zh)[key] || key; }
function defaultProfile() {
  return { homeId: "city-centre", lat: 53.3473, lng: -6.2591, homeLabel: "City Centre",
    mode: "pt", maxMinutes: 45, slots: {}, budget: null, skills: [], goal: "explore", lang: "zh" };
}
function origins() { return (MATRIX && MATRIX.origins) || []; }
function itemsAll() { return (DATA && DATA.items) || []; }
function applyI18n() {
  document.documentElement.lang = profile.lang === "en" ? "en" : "zh-Hant";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (I18N[profile.lang] && I18N[profile.lang][k]) el.textContent = I18N[profile.lang][k];
  });
  document.getElementById("lang-zh").setAttribute("aria-pressed", profile.lang === "zh" ? "true" : "false");
  document.getElementById("lang-en").setAttribute("aria-pressed", profile.lang === "en" ? "true" : "false");
}
function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_PROFILE);
    if (raw) Object.assign(profile, JSON.parse(raw));
  } catch (e) { /* ignore */ }
  const u = new URLSearchParams(location.search);
  if (u.get("lang") === "en" || u.get("lang") === "zh") profile.lang = u.get("lang");
  if (u.get("home")) {
    const o = origins().find((x) => x.id === u.get("home"));
    if (o) { profile.homeId = o.id; profile.lat = o.lat; profile.lng = o.lng; profile.homeLabel = o.name; }
  }
  if (u.get("clat") && u.get("clng")) {
    profile.homeId = "custom";
    profile.lat = Number(u.get("clat"));
    profile.lng = Number(u.get("clng"));
    profile.homeLabel = u.get("clabel") || "Custom";
  }
  if (["pt", "walk", "cycle"].includes(u.get("mode"))) profile.mode = u.get("mode");
  if (u.get("max") && Number(u.get("max")) > 0) profile.maxMinutes = Number(u.get("max"));
  if (u.get("budget") === "none") profile.budget = null;
  else if (u.get("budget") && !Number.isNaN(Number(u.get("budget")))) profile.budget = Number(u.get("budget"));
  if (u.get("goal") && ["explore", "portfolio", "job"].includes(u.get("goal"))) profile.goal = u.get("goal");
  if (u.get("skills")) profile.skills = u.get("skills").split(",").map((s) => s.trim()).filter(Boolean);
  if (u.get("slots")) {
    profile.slots = {};
    u.get("slots").split(",").forEach((tok) => { if (tok) profile.slots[tok] = true; });
  }
  try { shortlist = new Set(JSON.parse(localStorage.getItem(STORAGE_SHORT) || "[]")); } catch (e) { shortlist = new Set(); }
}
function saveProfile() {
  localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
  localStorage.setItem(STORAGE_SHORT, JSON.stringify([...shortlist]));
}
function shareUrl() {
  const u = new URLSearchParams();
  u.set("lang", profile.lang);
  if (profile.homeId === "custom") {
    u.set("clat", String(profile.lat)); u.set("clng", String(profile.lng)); u.set("clabel", profile.homeLabel || "Custom");
  } else u.set("home", profile.homeId);
  u.set("mode", profile.mode);
  u.set("max", String(profile.maxMinutes));
  if (profile.budget == null) u.set("budget", "none"); else u.set("budget", String(profile.budget));
  u.set("goal", profile.goal);
  if (profile.skills.length) u.set("skills", profile.skills.join(","));
  const slots = Object.keys(profile.slots).filter((k) => profile.slots[k]);
  if (slots.length) u.set("slots", slots.join(","));
  return location.origin + location.pathname + "?" + u.toString();
}
async function copyShare() {
  const url = shareUrl();
  try { await navigator.clipboard.writeText(url); alert(t("copied")); }
  catch (e) { prompt(t("copyLink"), url); }
}
function parseISODates(s) { return s ? [...s.matchAll(/20\d{2}-\d{2}-\d{2}/g)].map((m) => m[0]) : []; }
function dateObj(iso) { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); }
function isoFromDate(d) {
  const z = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
}
function addDays(d, n) { const x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
function lastActivityDate(item) {
  const ds = parseISODates(item.dates || "").map(dateObj);
  return ds.length ? ds.reduce((a, b) => (a > b ? a : b)) : null;
}
function deadlineDate(item) {
  const ds = parseISODates(item.deadline || "");
  return ds.length ? dateObj(ds[0]) : null;
}
function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function isExpired(item) {
  if (item && (item.status === "expired" || item.status === "removed")) return true;
  const today = startOfDay(TODAY);
  const last = lastActivityDate(item);
  const dl = deadlineDate(item);
  // A date on today is still current (not strictly before today's calendar date).
  if (last && last < today && (!dl || dl < today)) return true;
  if (!last && dl && dl < today) return true;
  return false;
}
function deadlineSoon(item) {
  const dl = deadlineDate(item);
  if (!dl || isExpired(item)) return false;
  return dl <= addDays(TODAY, 3);
}
function weekdayKeys(item) {
  const w = ((item.weekday || "") + " " + (item.dates || "") + " " + (item.timeBand || "")).toLowerCase();
  const keys = new Set();
  const map = { monday: "mon", tuesday: "tue", wednesday: "wed", thursday: "thu", friday: "fri", saturday: "sat", sunday: "sun" };
  Object.entries(map).forEach(([name, k]) => { if (w.includes(name)) keys.add(k); });
  if (/weekdays?/.test(w) && keys.size === 0) ["mon", "tue", "wed", "thu", "fri"].forEach((k) => keys.add(k));
  if ((item.timeBand || "").startsWith("Weekend")) { keys.add("sat"); keys.add("sun"); }
  if ((item.category === "job" || (item.timeBand || "").includes("Weekday daytime")) && keys.size === 0) {
    ["mon", "tue", "wed", "thu", "fri"].forEach((k) => keys.add(k));
  }
  if (keys.size === 0 && (item.timeBand || "").includes("weekday")) {
    ["mon", "tue", "wed", "thu", "fri"].forEach((k) => keys.add(k));
  }
  return [...keys];
}
function hourOf(s) {
  if (!s || !/^\d{1,2}:\d{2}/.test(s)) return null;
  const [h, m] = s.split(":").map(Number);
  return h + m / 60;
}
function periodsFor(item) {
  const start = hourOf(item.start);
  const end = hourOf(item.end);
  const out = new Set();
  if (start != null) {
    const fin = end != null && end > start ? end : start + 0.5;
    Object.entries(PERIOD_HOURS).forEach(([p, range]) => {
      if (start < range[1] && fin > range[0]) out.add(p);
    });
  } else if ((item.timeBand || "").toLowerCase().includes("evening")) out.add("evening");
  else if ((item.timeBand || "").toLowerCase().includes("weekend")) { out.add("morning"); out.add("afternoon"); }
  else { out.add("morning"); out.add("afternoon"); }
  return [...out];
}
function requiredSlots(item) {
  const days = weekdayKeys(item);
  const periods = periodsFor(item);
  const slots = [];
  days.forEach((d) => periods.forEach((p) => slots.push(d + "-" + p)));
  return slots;
}
function destFor(item) {
  if (!MATRIX) return null;
  return MATRIX.destinations.find((d) => d.itemIds.includes(item.id)) || null;
}
function haversineKm(aLat, aLng, bLat, bLng) {
  const R = 6371;
  const p1 = aLat * Math.PI / 180, p2 = bLat * Math.PI / 180;
  const dp = (bLat - aLat) * Math.PI / 180;
  const dl = (bLng - aLng) * Math.PI / 180;
  const s = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
function travelOf(item) {
  if (item.format === "online" || item.area === "Online") {
    return { minutes: 0, kind: "online", label: t("online"), modeSource: "online" };
  }
  if (item.lat == null || item.lng == null) {
    return { minutes: null, kind: "unknown", label: t("unknownStreet"), modeSource: "unknown" };
  }
  const mode = profile.mode;
  if (profile.homeId && profile.homeId !== "custom" && MATRIX && MATRIX.matrix[profile.homeId]) {
    const dest = destFor(item);
    const cell = dest ? MATRIX.matrix[profile.homeId][dest.id] : null;
    if (cell) {
      const minutes = cell[mode];
      const kind = cell.nearSkip ? "near" : (minutes == null ? "failed" : "tfi");
      const label = mode === "pt"
        ? (cell.ptNote && String(cell.ptNote).startsWith("TFI failed") ? t("travelEst") : t("tfi"))
        : t("travelEst") + " (OSRM 4.8 / 15 km/h)";
      return { minutes, kind, label, modeSource: "matrix", cell };
    }
  }
  const km = haversineKm(profile.lat, profile.lng, item.lat, item.lng);
  const walk = Math.round((km / 4.8) * 60);
  const cycle = Math.round((km / 15) * 60);
  const pt = Math.round((km * 1.5 / 22) * 60);
  const minutes = mode === "walk" ? walk : mode === "cycle" ? cycle : pt;
  return { minutes, kind: "straight", label: t("customEst") + " · " + km.toFixed(1) + " km", modeSource: "straight", walk, cycle, pt, km };
}
function travelFit(item, tr) {
  if (tr.kind === "online") return { score: 100, why: t("online") };
  if (tr.minutes == null) return { score: 40, why: t("unknownStreet") };
  const cap = profile.maxMinutes;
  if (tr.minutes <= cap) return { score: 100, why: tr.minutes + "′ ≤ " + cap + "′ (" + tr.label + ")" };
  if (tr.minutes <= cap * 1.25) return { score: 60, why: tr.minutes + "′ (" + t("stretch") + ", " + tr.label + ")" };
  if (tr.minutes <= cap * 1.5) return { score: 30, why: tr.minutes + "′ (" + t("far") + ", " + tr.label + ")" };
  return { score: 0, why: tr.minutes + "′ > " + cap + "′ (" + tr.label + ")" };
}
function timeFit(item) {
  const used = Object.keys(profile.slots).filter((k) => profile.slots[k]);
  const need = requiredSlots(item);
  if (!used.length) return { score: 70, why: profile.lang === "en" ? "Weekly free time not set, so time fit is treated as unknown." : "尚未設定每週空檔，時段適合度暫以未知計。" };
  const hit = need.filter((s) => profile.slots[s]);
  if (!need.length) return { score: 70, why: profile.lang === "en" ? "Session days are not fully stated." : "場次星期未完整載明。" };
  if (hit.length === need.length) return { score: 100, why: profile.lang === "en" ? "Covers your free-time slots." : "正好落在你的空檔。" };
  if (hit.length) return { score: 70, why: profile.lang === "en" ? "Partly overlaps your free-time slots." : "與你的空檔部分重疊。" };
  if (item.eveningFeasible === "yes" && used.some((s) => s.endsWith("evening") || s.startsWith("sat") || s.startsWith("sun"))) {
    return { score: 40, why: profile.lang === "en" ? "Listed as evening/weekend/online feasible, but the exact slot does not match." : "標示為晚間／週末／線上可行，但精確時段未對上。" };
  }
  return { score: 0, why: profile.lang === "en" ? "Does not match the free-time slots you selected." : "與你勾選的空檔不符。" };
}
function costFit(item) {
  if (item.category === "job" || item.costBand === "n/a (job)") {
    return { score: 100, why: profile.lang === "en" ? "Jobs are not scored on course fees." : "職缺不以課程費用計分。" };
  }
  if (item.cost == null) return { score: 50, why: profile.lang === "en" ? "Fee not stated." : "費用未載明。" };
  if (item.cost === 0) return { score: 100, why: profile.lang === "en" ? "Free." : "免費。" };
  if (profile.budget == null) return { score: 70, why: (profile.lang === "en" ? "Fee €" : "費用 €") + item.cost + (profile.lang === "en" ? " (no budget cap set)." : "（未設預算上限）。") };
  if (item.cost <= profile.budget) return { score: 100, why: "€" + item.cost + " ≤ €" + profile.budget };
  if (item.cost <= profile.budget * 1.25) return { score: 40, why: "€" + item.cost + " (" + t("stretch") + ")" };
  return { score: 0, why: profile.lang === "en" ? ("€" + item.cost + " is over your €" + profile.budget + " cap.") : ("€" + item.cost + " 超過預算 €" + profile.budget + "。") };
}
function skillFit(item) {
  if (!profile.skills.length) return { score: 70, why: profile.lang === "en" ? "No skill filter set." : "尚未選擇感興趣的技能。" };
  if (profile.skills.includes(item.skill)) return { score: 100, why: item.skill };
  return { score: 20, why: profile.lang === "en" ? (item.skill + " is outside your selected skills.") : (item.skill + " 不在你選的技能內。") };
}
function portfolioFit(item) {
  const mapv = { high: 100, medium: 60, low: 30 };
  let score = mapv[item.portfolio] ?? 50;
  if (profile.goal === "job" && item.category === "job") score = Math.max(score, 90);
  return { score, why: item.portfolio || "n/a" };
}
function deadlineFit(item) {
  if (isExpired(item)) return { score: 0, why: t("expired") };
  const dl = deadlineDate(item);
  if (!dl) return { score: 50, why: profile.lang === "en" ? "No stated deadline." : "未載明截止日期。" };
  const days = Math.round((dl - TODAY) / 86400000);
  if (days <= 3) return { score: 100, why: t("deadlineSoon") + " (" + days + "d)" };
  if (days <= 7) return { score: 80, why: days + "d" };
  if (days <= 14) return { score: 60, why: days + "d" };
  return { score: 40, why: days + "d" };
}
function weightsFor() {
  if (profile.goal === "portfolio") return { travel: 0.18, time: 0.18, cost: 0.12, skill: 0.18, portfolio: 0.24, deadline: 0.10 };
  if (profile.goal === "job") return { travel: 0.20, time: 0.18, cost: 0.08, skill: 0.22, portfolio: 0.12, deadline: 0.10 };
  return { travel: 0.22, time: 0.20, cost: 0.15, skill: 0.18, portfolio: 0.15, deadline: 0.10 };
}
function hardExclusions(item, tr) {
  const reasons = [];
  if (isExpired(item)) reasons.push("deadline");
  if (tr.kind !== "online" && tr.minutes != null && tr.minutes > profile.maxMinutes) reasons.push("travel");
  const used = Object.keys(profile.slots).filter((k) => profile.slots[k]);
  if (used.length && timeFit(item).score === 0) reasons.push("time");
  if (profile.budget != null && item.category !== "job" && item.cost != null && item.cost > profile.budget) reasons.push("cost");
  return reasons;
}
function scoreItem(item) {
  const tr = travelOf(item);
  const parts = { travel: travelFit(item, tr), time: timeFit(item), cost: costFit(item), skill: skillFit(item), portfolio: portfolioFit(item), deadline: deadlineFit(item) };
  const w = weightsFor();
  let total = 0;
  Object.keys(w).forEach((k) => { total += parts[k].score * w[k]; });
  if (profile.goal === "job" && item.category === "job") total = Math.min(100, total + 8);
  if (isExpired(item)) total = Math.min(total, 15);
  return { total: Math.round(total), parts, travel: tr, hard: hardExclusions(item, tr), weights: w };
}
function reachBand(item) {
  const tr = travelOf(item);
  if (tr.kind === "online") return "online";
  if (tr.minutes == null) return "unknown";
  if (tr.minutes <= profile.maxMinutes) return "reachable";
  if (tr.minutes <= profile.maxMinutes * 1.25) return "stretch";
  return "far";
}
function passesFilters(item) {
  if (filters.hideExpired && isExpired(item)) return false;
  if (filters.category !== "all" && item.category !== filters.category) return false;
  if (filters.costBand !== "all" && item.costBand !== filters.costBand) return false;
  if (filters.format !== "all" && item.format !== filters.format) return false;
  if (filters.reach !== "all" && reachBand(item) !== filters.reach) return false;
  if (filters.q && !(item.title + " " + item.organiser + " " + (item.venue || "")).toLowerCase().includes(filters.q.toLowerCase())) return false;
  const only = document.getElementById("only-skills");
  if (only && only.checked && profile.skills.length && !profile.skills.includes(item.skill)) return false;
  if (window.DOA_V4 && typeof window.v4Passes === "function" && !window.v4Passes(item)) return false;
  return true;
}
function scoredList() {
  return itemsAll().map((item) => ({ item, s: scoreItem(item) }))
    .filter((x) => passesFilters(x.item))
    .sort((a, b) => b.s.total - a.s.total || a.item.id.localeCompare(b.item.id));
}
function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
}
function catLabel(c) { return (CAT[c] && CAT[c][profile.lang]) || c; }
function money(item) {
  if (item.category === "job") return "n/a";
  if (item.cost == null) return profile.lang === "en" ? "Fee not stated" : "費用未載明";
  if (item.cost === 0) return profile.lang === "en" ? "Free" : "免費";
  return "€" + item.cost;
}
function renderKpis() {
  const items = itemsAll();
  const active = items.filter((i) => !isExpired(i));
  const jobs = active.filter((i) => i.category === "job").length;
  const k = DATA.kpis || {};
  const cells = [
    [String(active.length), profile.lang === "en" ? "Active records" : "有效紀錄", (items.length - active.length) + " " + t("expired")],
    ["100%", profile.lang === "en" ? "Source traceability" : "來源可追溯", ""],
    [String(k.completenessPct ?? "") + "%", profile.lang === "en" ? "Completeness" : "資料完整度", (k.completenessFilled && k.completenessTotal) ? (k.completenessFilled + " / " + k.completenessTotal) : ""],
    [String(jobs), profile.lang === "en" ? "Jobs" : "職缺", active.filter((i) => i.category === "event").length + " / " + active.filter((i) => i.category === "training").length]
  ];
  document.getElementById("kpi-row").innerHTML = cells.map((c) => "<div class=\"kpi\"><b>" + escapeHtml(c[0]) + "</b><span>" + escapeHtml(c[1]) + (c[2] ? " · " + escapeHtml(c[2]) : "") + "</span></div>").join("");
}
function renderProfileSummary() {
  const o = origins().find((x) => x.id === profile.homeId);
  const home = profile.homeId === "custom" ? (profile.homeLabel || "Custom") : (profile.lang === "zh" && o ? (o.nameZh || o.name) : (o ? o.name : profile.homeLabel));
  const mode = profile.mode === "pt" ? t("modePt") : profile.mode === "walk" ? t("modeWalk") : t("modeCycle");
  const goal = profile.goal === "job" ? t("goalJob") : profile.goal === "portfolio" ? t("goalPortfolio") : t("goalExplore");
  const slotN = Object.keys(profile.slots).filter((k) => profile.slots[k]).length;
  document.getElementById("profile-blurb").textContent = profile.lang === "en"
    ? ("From " + home + ", " + mode + ", up to " + profile.maxMinutes + " minutes. Goal: " + goal + ".")
    : ("出發點：" + home + "，" + mode + "，最長 " + profile.maxMinutes + " 分鐘。目標：" + goal + "。");
  const chips = [home, mode + " · " + profile.maxMinutes + "′", profile.budget == null ? t("noBudget") : ("€" + profile.budget), slotN ? (slotN + " " + t("slots")) : t("slots"), goal].concat(profile.skills);
  document.getElementById("profile-chips").innerHTML = chips.map((c, i) => "<span class=\"chip " + (i === 0 ? "sky" : "plain") + "\">" + escapeHtml(c) + "</span>").join("");
}
function starBtn(id) {
  const on = shortlist.has(id);
  return "<button class=\"star\" type=\"button\" data-star=\"" + id + "\" aria-pressed=\"" + on + "\" title=\"" + (on ? t("unstar") : t("star")) + "\">" + (on ? "★" : "☆") + "</button>";
}
function renderPicks() {
  const list = scoredList().filter((x) => !x.s.hard.length).slice(0, 6);
  const box = document.getElementById("picks-grid");
  if (!list.length) { box.innerHTML = "<p class=\"lede\">" + t("noPicks") + "</p>"; return; }
  box.innerHTML = list.map(({ item, s }) => {
    const why = Object.values(s.parts).map((p) => "<li>" + escapeHtml(p.why) + "</li>").join("");
    const chipCls = item.category === "job" ? "rust" : item.category === "training" ? "" : "sky";
    return "<article class=\"pick card\" data-id=\"" + item.id + "\" data-open=\"" + item.id + "\"><div class=\"pick-top\"><div>" +
      "<span class=\"chip " + chipCls + "\">" + catLabel(item.category) + "</span> " +
      "<span class=\"chip plain\">" + escapeHtml(item.skill) + "</span> " +
      (deadlineSoon(item) ? "<span class=\"flag\">" + t("deadlineSoon") + "</span>" : "") +
      "</div><div class=\"score\" style=\"--p:" + s.total + "\"><span>" + s.total + "</span></div></div>" +
      "<h3>" + escapeHtml(item.title) + "</h3>" +
      "<p style=\"margin:0;color:var(--muted);font-size:13px\">" + escapeHtml(item.organiser) + " · " + escapeHtml(item.area) + "</p>" +
      "<p style=\"margin:0;font-size:13px\">" + money(item) + " · " + (s.travel.minutes == null ? "—" : s.travel.minutes + "′") + " " + escapeHtml(s.travel.label) + "</p>" +
      "<div style=\"font-size:13px;font-weight:650\">" + t("why") + "</div><ul class=\"why\">" + why + "</ul>" +
      "<div class=\"row-actions\">" + starBtn(item.id) +
      " <a class=\"btn small\" href=\"" + item.source + "\" target=\"_blank\" rel=\"noopener\">" + t("source") + "</a>" +
      " <button class=\"btn small\" type=\"button\" data-ics=\"" + item.id + "\">" + t("ics") + "</button></div></article>";
  }).join("");
}
function renderFilters() {
  const box = document.getElementById("filters");
  const costBands = ["all", "free", "≤€50", "€51–200", ">€200", "n/a (job)", "not stated"];
  const formats = ["all", "in-person", "online", "hybrid"];
  const reaches = ["all", "reachable", "stretch", "far", "unknown", "online"];
  function sel(id, label, opts, val, labFn) {
    return "<label>" + label + " <select id=\"" + id + "\">" + opts.map((o) => "<option value=\"" + o + "\"" + (o === val ? " selected" : "") + ">" + (labFn ? labFn(o) : o) + "</option>").join("") + "</select></label>";
  }
  box.innerHTML = [
    sel("f-cat", t("cat"), ["all", "event", "training", "job"], filters.category, (o) => o === "all" ? t("filterAll") : catLabel(o)),
    sel("f-cost", t("cost"), costBands, filters.costBand, (o) => o === "all" ? t("filterAll") : o),
    sel("f-format", t("format"), formats, filters.format, (o) => o === "all" ? t("filterAll") : o),
    sel("f-reach", t("reach"), reaches, filters.reach, (o) => o === "all" ? t("filterAll") : (t(o) || o)),
    "<input type=\"search\" id=\"f-q\" placeholder=\"" + t("search") + "\" value=\"" + escapeHtml(filters.q) + "\" />"
  ].join("");
  [["f-cat", "category"], ["f-cost", "costBand"], ["f-format", "format"], ["f-reach", "reach"]].forEach((pair) => {
    document.getElementById(pair[0]).onchange = function (e) { filters[pair[1]] = e.target.value; refreshViews(); };
  });
  document.getElementById("f-q").oninput = function (e) { filters.q = e.target.value; refreshViews(false); };
}
function renderLegend() {
  document.getElementById("map-legend").innerHTML =
    "<span><i class=\"dot event\"></i>" + catLabel("event") + "</span>" +
    "<span><i class=\"dot training\"></i>" + catLabel("training") + "</span>" +
    "<span><i class=\"dot job\"></i>" + catLabel("job") + "</span>" +
    "<span><i class=\"dot good\"></i>" + t("reachable") + "</span>" +
    "<span><i class=\"dot warn\"></i>" + t("stretch") + "</span>" +
    "<span><i class=\"dot bad\"></i>" + t("far") + "</span>" +
    "<span><i class=\"dot grey\"></i>" + t("unknown") + "</span>" +
    "<span>" + t("estimateNote") + "</span>";
}
function markerColor(item) {
  const b = reachBand(item);
  if (b === "reachable" || b === "online") return "#1b7a4a";
  if (b === "stretch") return "#b56a12";
  if (b === "far") return "#a33b2a";
  return "#9a9288";
}
function ensureMap() {
  if (map) return;
  if (L.Icon && L.Icon.Default) {
    L.Icon.Default.mergeOptions({
      iconUrl: "/vendor/leaflet/images/marker-icon.png",
      iconRetinaUrl: "/vendor/leaflet/images/marker-icon-2x.png",
      shadowUrl: "/vendor/leaflet/images/marker-shadow.png"
    });
  }
  map = L.map("map", { scrollWheelZoom: true });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
  }).addTo(map);
  cluster = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 48 });
  map.addLayer(cluster);
  map.setView([53.35, -6.26], 11);
}
function drawRings() {
  rings.forEach((r) => r.remove());
  rings = [];
  if (profile.lat == null) return;
  const speed = profile.mode === "walk" ? 4.8 : profile.mode === "cycle" ? 15 : 22;
  const note = profile.mode === "pt"
    ? (profile.lang === "en" ? "Schematic ring at 22 km/h, not a TFI isochrone." : "以 22 km/h 繪製的示意環，不是 TFI 等時圈。")
    : (profile.lang === "en" ? ("Schematic ring at " + speed + " km/h.") : ("以 " + speed + " km/h 繪製的示意環。"));
  [profile.maxMinutes, Math.round(profile.maxMinutes * 1.25)].forEach((mins, i) => {
    const km = speed * (mins / 60);
    const c = L.circle([profile.lat, profile.lng], {
      radius: km * 1000, color: i ? "#b56a12" : "#1c5844",
      weight: 1, fillOpacity: 0.05, dashArray: i ? "6 6" : null
    }).bindTooltip(mins + "′ · " + note, { sticky: true });
    c.addTo(map);
    rings.push(c);
  });
}
function renderMap() {
  ensureMap();
  cluster.clearLayers();
  if (homeMarker) { homeMarker.remove(); homeMarker = null; }
  homeMarker = L.circleMarker([profile.lat, profile.lng], {
    radius: 9, color: "#fff", weight: 2, fillColor: "#c24d1f", fillOpacity: 1
  }).bindPopup("<strong>" + escapeHtml(profile.homeLabel || "Home") + "</strong>").addTo(map);
  drawRings();
  const list = scoredList();
  const bounds = [[profile.lat, profile.lng]];
  list.forEach(({ item, s }) => {
    if (item.lat == null) return;
    const m = L.circleMarker([item.lat, item.lng], {
      radius: 8, color: "#fff", weight: 1.5, fillColor: markerColor(item), fillOpacity: 0.95
    });
    m._itemId = item.id;
    const mins = s.travel.minutes == null ? "—" : s.travel.minutes + "′";
    m.bindPopup(
      "<strong>" + escapeHtml(item.title) + "</strong><br>" + catLabel(item.category) + " · " + escapeHtml(item.area) +
      "<br>" + (profile.lang === "en" ? "Score " : "分數 ") + s.total + " · " + mins + " (" + escapeHtml(s.travel.label) + ")" +
      "<br><a href=\"" + item.source + "\" target=\"_blank\" rel=\"noopener\">" + t("source") + "</a>"
    );
    m.on("click", function () { selectItem(item.id, false); });
    cluster.addLayer(m);
    bounds.push([item.lat, item.lng]);
  });
  if (bounds.length > 1) map.fitBounds(bounds, { padding: [28, 28], maxZoom: 12 });
  else map.setView([profile.lat, profile.lng], 11);
}
function renderList() {
  const list = scoredList();
  const pane = document.getElementById("list-pane");
  pane.innerHTML = "<p style=\"margin:8px 10px;font-size:13px;color:var(--muted)\">" + list.length + " / " + itemsAll().length + "</p>" +
    list.map(({ item, s }) =>
      "<div class=\"opp-row" + (pickMarkerId === item.id ? " active" : "") + "\" data-open=\"" + item.id + "\">" +
      "<div class=\"score\" style=\"--p:" + s.total + ";width:44px;height:44px;font-size:16px\"><span style=\"width:34px;height:34px\">" + s.total + "</span></div>" +
      "<div><h3>" + escapeHtml(item.title) + "</h3><p>" + catLabel(item.category) + " · " + escapeHtml(item.area) + " · " +
      (s.travel.minutes == null ? "—" : s.travel.minutes + "′") + " · " + money(item) +
      (isExpired(item) ? " · " + t("expired") : "") + (deadlineSoon(item) ? " · " + t("deadlineSoon") : "") +
      "</p></div><div>" + starBtn(item.id) + "</div></div>"
    ).join("");
}
function selectItem(id, pan) {
  if (pan == null) pan = true;
  pickMarkerId = id;
  document.querySelectorAll(".opp-row").forEach((el) => el.classList.toggle("active", el.getAttribute("data-open") === id));
  const item = itemsAll().find((i) => i.id === id);
  if (pan && item && item.lat != null && map) {
    map.setView([item.lat, item.lng], Math.max(map.getZoom(), 13));
    cluster.eachLayer((ly) => { if (ly._itemId === id) ly.openPopup(); });
  }
  const row = document.querySelector(".opp-row[data-open=\"" + id + "\"]");
  if (row) row.scrollIntoView({ block: "nearest" });
}
function equityStats() {
  const inPerson = itemsAll().filter((i) => i.lat != null && i.format !== "online" && i.area !== "Online" && !isExpired(i));
  const rows = [];
  origins().forEach((o) => {
    const times = inPerson.map((item) => {
      const dest = destFor(item);
      const cell = dest && MATRIX.matrix[o.id] ? MATRIX.matrix[o.id][dest.id] : null;
      return { item: item, pt: cell ? cell.pt : null };
    });
    function within(m) { return times.filter((x) => x.pt != null && x.pt <= m); }
    function feeItems(arr) { return arr.map((x) => x.item).filter((i) => i.category !== "job" && i.cost != null); }
    function median(vals) {
      if (!vals.length) return null;
      const s = vals.slice().sort((a, b) => a - b);
      const mid = Math.floor(s.length / 2);
      return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
    }
    const w30 = within(30), w45 = within(45), w60 = within(60);
    const fees45 = feeItems(w45);
    const ev = w45.filter((x) => x.item.eveningFeasible === "yes").length;
    rows.push({
      id: o.id, name: o.name, nameZh: o.nameZh || o.name, n: inPerson.length,
      n30: w30.length, n45: w45.length, n60: w60.length,
      known: times.filter((x) => x.pt != null).length,
      medianCost: median(fees45.map((i) => i.cost)),
      freePct: fees45.length ? Math.round(100 * fees45.filter((i) => i.cost === 0).length / fees45.length) : null,
      eveningPct: w45.length ? Math.round(100 * ev / w45.length) : null
    });
  });
  return { inPerson: inPerson.length, rows: rows };
}
function renderEquity() {
  if (!MATRIX || !MATRIX.matrix) return;
  const stats = equityStats();
  const rows = stats.rows;
  const inPerson = stats.inPerson;
  const labels = rows.map((r) => profile.lang === "zh" ? r.nameZh : r.name);
  const ctx = document.getElementById("equity-chart");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        { label: "≤30 min", data: rows.map((r) => r.n30), backgroundColor: "#1c5844" },
        { label: "≤45 min", data: rows.map((r) => r.n45), backgroundColor: "#2b7a5c" },
        { label: "≤60 min", data: rows.map((r) => r.n60), backgroundColor: "#8fb9a6" }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: profile.lang === "en"
          ? ("In-person opportunities reachable by public transport (of " + inPerson + " with coordinates)")
          : ("大眾運輸可達的面對面機會（共 " + inPerson + " 筆有座標）") }
      },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });
  const cc = rows.find((r) => r.id === "city-centre");
  const me = rows.find((r) => r.id === profile.homeId) || cc;
  const least45 = rows.slice().sort((a, b) => a.n45 - b.n45)[0];
  const most45 = rows.slice().sort((a, b) => b.n45 - a.n45)[0];
  const sentences = [];
  if (me && cc && me.id !== "city-centre") {
    sentences.push(profile.lang === "en"
      ? ("From " + me.name + ", " + me.n45 + " of " + inPerson + " in-person opportunities are within 45 minutes by public transport, versus " + cc.n45 + " from City Centre. These are TFI estimates for a Thursday 12 Nov 2026 08:30 departure.")
      : ("從" + me.nameZh + "出發，" + inPerson + " 筆有座標的面對面機會中，有 " + me.n45 + " 筆可在 45 分鐘大眾運輸內到達；市中心則有 " + cc.n45 + " 筆。以上為 2026-11-12 08:30 出發的 TFI 估計。"));
  } else if (cc) {
    sentences.push(profile.lang === "en"
      ? ("From City Centre, " + cc.n45 + " of " + inPerson + " in-person opportunities with coordinates are within 45 minutes by public transport (TFI estimate, leave after 08:30 on Thu 12 Nov 2026).")
      : ("從市中心出發，" + inPerson + " 筆有座標的面對面機會中，有 " + cc.n45 + " 筆可在 45 分鐘大眾運輸內到達（TFI 估計，2026-11-12 08:30 出發）。"));
  }
  if (least45 && most45 && least45.id !== most45.id) {
    sentences.push(profile.lang === "en"
      ? ("The widest 45-minute reach is " + most45.name + " (" + most45.n45 + "). The narrowest is " + least45.name + " (" + least45.n45 + ").")
      : ("45 分鐘可達數最高的是" + most45.nameZh + "（" + most45.n45 + " 筆），最低的是" + least45.nameZh + "（" + least45.n45 + " 筆）。"));
  }
  const freeBest = rows.filter((r) => r.freePct != null).sort((a, b) => b.freePct - a.freePct)[0];
  if (freeBest) {
    sentences.push(profile.lang === "en"
      ? ("Among fee-stated items reachable within 45 minutes from " + freeBest.name + ", " + freeBest.freePct + "% are free. Median stated fee: " + (freeBest.medianCost == null ? "not available" : ("€" + freeBest.medianCost)) + ".")
      : ("從" + freeBest.nameZh + "在 45 分鐘內可達、且有載明費用的項目中，免費佔 " + freeBest.freePct + "%。費用中位數為 " + (freeBest.medianCost == null ? "無法計算" : ("€" + freeBest.medianCost)) + "。"));
  }
  const evBest = rows.filter((r) => r.eveningPct != null).sort((a, b) => a.eveningPct - b.eveningPct);
  if (evBest.length) {
    const low = evBest[0], high = evBest[evBest.length - 1];
    const small = [low, high].filter((r) => r.n45 < 5).map((r) => (profile.lang === "zh" ? r.nameZh : r.name) + " n=" + r.n45);
    const caveat = small.length
      ? (profile.lang === "en" ? " Percentages for very small reachable sets should be read with care (" + small.join("; ") + ")."
         : "可達筆數很少時，百分比請謹慎解讀（" + small.join("；") + "）。")
      : "";
    sentences.push(profile.lang === "en"
      ? ("Of opportunities within 45 minutes, the share marked evening/weekend/online-feasible ranges from " + low.eveningPct + "% (" + low.name + ", " + low.n45 + " items) to " + high.eveningPct + "% (" + high.name + ", " + high.n45 + " items)." + caveat)
      : ("在 45 分鐘可達的機會中，標示為晚間／週末／線上可行的比例介於 " + low.eveningPct + "%（" + low.nameZh + "，" + low.n45 + " 筆）與 " + high.eveningPct + "%（" + high.nameZh + "，" + high.n45 + " 筆）之間。" + caveat));
  }
  const noStreet = itemsAll().filter((i) => i.category === "job" && i.lat == null && i.format !== "online").length;
  if (noStreet) {
    sentences.push(profile.lang === "en"
      ? (noStreet + " job listings have no precise street, so they cannot enter the travel comparison. That is a data gap, not a judgement about the roles.")
      : ("有 " + noStreet + " 筆職缺未載明精確街道，因此無法進入通勤比較。這是資料缺口，不是對職缺本身的判斷。"));
  }
  document.getElementById("insight-list").innerHTML = sentences.map((s) => "<li>" + escapeHtml(s) + "</li>").join("");
}
function renderBarriers() {
  const counts = { travel: 0, time: 0, cost: 0, deadline: 0 };
  itemsAll().forEach((item) => { scoreItem(item).hard.forEach((k) => { counts[k] += 1; }); });
  const total = itemsAll().length || 1;
  const rows = [["travel", t("barriersTravel"), counts.travel], ["time", t("barriersTime"), counts.time], ["cost", t("barriersCost"), counts.cost], ["deadline", t("barriersDeadline"), counts.deadline]];
  document.getElementById("barrier-bars").innerHTML = rows.map((r) =>
    "<div class=\"bar-row\"><div>" + escapeHtml(r[1]) + "</div><div class=\"bar-track\"><div class=\"bar-fill\" style=\"width:" + Math.round(100 * r[2] / total) + "%\"></div></div><div>" + r[2] + "</div></div>"
  ).join("");
}
function expandCalendar() {
  const out = [];
  itemsAll().forEach((item) => {
    const dates = new Set(parseISODates(item.dates || ""));
    const text = (item.dates || "") + " " + (item.weekday || "");
    const until = text.match(/until\s+(20\d{2}-\d{2}-\d{2})/i);
    if (/weekly on wednesdays/i.test(text) && until) {
      const end = dateObj(until[1]);
      let d = new Date(2026, 10, 12);
      while (d.getDay() !== 3) d = addDays(d, 1);
      while (d <= end) { dates.add(isoFromDate(d)); d = addDays(d, 7); }
    }
    if (/every saturday/i.test(text)) {
      let d = new Date(2026, 10, 14);
      const end = new Date(2026, 11, 20);
      while (d <= end) { dates.add(isoFromDate(d)); d = addDays(d, 7); }
    }
    if (/weekly on wednesdays \(ongoing/i.test(item.dates || "")) {
      let d = new Date(2026, 10, 12);
      while (d.getDay() !== 3) d = addDays(d, 1);
      const end = new Date(2026, 11, 16);
      while (d <= end) { dates.add(isoFromDate(d)); d = addDays(d, 7); }
    }
    const startWeeks = (item.dates || "").match(/Starts\s+(20\d{2}-\d{2}-\d{2}),\s*4 weeks \(Wednesdays\)/i);
    if (startWeeks) {
      let d = dateObj(startWeeks[1]);
      for (let i = 0; i < 4; i++) { dates.add(isoFromDate(d)); d = addDays(d, 7); }
    }
    const startTue = (item.dates || "").match(/Starts\s+(20\d{2}-\d{2}-\d{2}),\s*10 weeks \(Tuesdays\)/i);
    if (startTue) {
      let d = dateObj(startTue[1]);
      for (let i = 0; i < 10; i++) { dates.add(isoFromDate(d)); d = addDays(d, 7); }
    }
    dates.forEach((iso) => {
      const d = dateObj(iso);
      if (d < TODAY) return;
      out.push({ type: "session", iso: iso, date: d, item: item, start: item.start || "", end: item.end || "" });
    });
    const dl = deadlineDate(item);
    if (dl && dl >= TODAY) out.push({ type: "deadline", iso: isoFromDate(dl), date: dl, item: item, start: "", end: "" });
  });
  out.sort((a, b) => a.date - b.date || a.item.id.localeCompare(b.item.id));
  return out;
}
function renderCalendar() {
  const evs = expandCalendar().slice(0, 60);
  document.getElementById("cal-list").innerHTML = evs.map((e) => {
    const soon = e.type === "deadline" && deadlineSoon(e.item);
    const lab = e.type === "deadline" ? (profile.lang === "en" ? "Deadline" : "截止") : (e.start || "—");
    return "<article class=\"cal-item card\"><div class=\"cal-date\">" + escapeHtml(e.iso) +
      "<div style=\"font-size:12px;color:var(--muted)\">" + lab + "</div></div><div><strong>" + escapeHtml(e.item.title) +
      "</strong><div style=\"font-size:12px;color:var(--muted)\">" + catLabel(e.item.category) + " · " + escapeHtml(e.item.area) +
      "</div></div><div>" + (soon ? "<span class=\"flag\">" + t("deadlineSoon") + "</span> " : "") +
      starBtn(e.item.id) + " <button class=\"btn small\" type=\"button\" data-ics=\"" + e.item.id + "\">.ics</button></div></article>";
  }).join("");
}
function icsEscape(s) { return String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;"); }
function icsStamp(d, time) {
  const z = (n) => String(n).padStart(2, "0");
  if (!time) return "" + d.getFullYear() + z(d.getMonth() + 1) + z(d.getDate());
  const parts = time.split(":").map(Number);
  return "" + d.getFullYear() + z(d.getMonth() + 1) + z(d.getDate()) + "T" + z(parts[0] || 0) + z(parts[1] || 0) + "00";
}
function icsForItems(itemList) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Dublin Opportunity Atlas//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
  itemList.forEach((item) => {
    const evs = expandCalendar().filter((e) => e.item.id === item.id);
    const use = evs.length ? evs : [{ type: "session", date: TODAY, iso: CHECK_DATE, item: item, start: item.start, end: item.end }];
    use.forEach((e, idx) => {
      lines.push("BEGIN:VEVENT");
      lines.push("UID:" + item.id + "-" + e.type + "-" + e.iso + "-" + idx + "@dublin-opportunity-atlas");
      lines.push("DTSTAMP:" + icsStamp(TODAY, "00:00") + "Z");
      if (e.start) {
        lines.push("DTSTART;TZID=Europe/Dublin:" + icsStamp(e.date, e.start));
        lines.push("DTEND;TZID=Europe/Dublin:" + icsStamp(e.date, e.end || e.start));
      } else {
        lines.push("DTSTART;VALUE=DATE:" + icsStamp(e.date));
      }
      const prefix = e.type === "deadline" ? (profile.lang === "en" ? "Deadline: " : "截止：") : "";
      lines.push("SUMMARY:" + icsEscape(prefix + item.title));
      lines.push("DESCRIPTION:" + icsEscape((item.organiser || "") + "\\n" + (item.source || "")));
      if (item.address) lines.push("LOCATION:" + icsEscape(item.address));
      if (item.source) lines.push("URL:" + item.source);
      lines.push("END:VEVENT");
    });
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
function downloadText(filename, text, mime) {
  const blob = new Blob([text], { type: mime || "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function renderShortlist() {
  const ids = Array.from(shortlist);
  const box = document.getElementById("shortlist-box");
  document.getElementById("btn-short-count").textContent = "★ " + ids.length;
  if (!ids.length) {
    box.innerHTML = "<p style=\"padding:8px\">" + t("emptyShort") + "</p>";
    document.getElementById("print-intro").innerHTML = "";
    return;
  }
  box.innerHTML = ids.map((id) => {
    const item = itemsAll().find((i) => i.id === id);
    if (!item) return "";
    const s = scoreItem(item);
    return "<div class=\"opp-row\" data-open=\"" + item.id + "\"><div class=\"score\" style=\"--p:" + s.total + ";width:44px;height:44px;font-size:16px\"><span style=\"width:34px;height:34px\">" + s.total + "</span></div><div><h3>" + escapeHtml(item.title) + "</h3><p>" + catLabel(item.category) + " · " + escapeHtml(item.area) + " · " + (s.travel.minutes == null ? "—" : s.travel.minutes + "′") + " · " + money(item) + "</p><ul class=\"why\">" + Object.values(s.parts).map((p) => "<li>" + escapeHtml(p.why) + "</li>").join("") + "</ul><p><a href=\"" + item.source + "\" target=\"_blank\" rel=\"noopener\">" + t("source") + "</a></p></div><div>" + starBtn(item.id) + "</div></div>";
  }).join("");
  document.getElementById("print-intro").innerHTML = "<h2>" + (profile.lang === "en" ? "Personal plan" : "個人計畫") + "</h2><p>" + escapeHtml(profile.homeLabel || profile.homeId) + " · " + profile.mode + " · " + profile.maxMinutes + "′ · " + CHECK_DATE + "</p>";
}
function exportCsv() {
  const header = ["id","title","category","organiser","area","skill","cost","deadline","source","score","travel_minutes"];
  const lines = [header.join(",")];
  Array.from(shortlist).forEach((id) => {
    const item = itemsAll().find((i) => i.id === id);
    if (!item) return;
    const s = scoreItem(item);
    const row = [item.id, item.title, item.category, item.organiser, item.area, item.skill, item.cost ?? "", item.deadline || "", item.source, s.total, s.travel.minutes ?? ""];
    lines.push(row.map((v) => "\"" + String(v).replace(/\"/g, "\"\"") + "\"").join(","));
  });
  downloadText("shortlist.csv", lines.join("\n"), "text/csv");
}
function renderMethod() {
  const k = DATA.kpis || {};
  const failN = (MATRIX && MATRIX.failures && MATRIX.failures.length) || 0;
  const zh = profile.lang !== "en";
  if (zh) {
    document.getElementById("method-body").innerHTML =
      "<p>核對日期 <strong>" + CHECK_DATE + "</strong>（Europe/Dublin）。有效紀錄 " + (k.validCount ?? 46) + " 筆，來源可追溯 " + (k.sourceTraceabilityPct ?? 100) + "%，資料完整度 " + (k.completenessPct ?? 90.1) + "%（1,326／1,472 格）。</p>" +
      "<details open><summary>方法</summary><ul>" +
      "<li>只收錄官方雇主頁或可靠職缺／活動頁上仍有效的項目；費用、薪資、截止日僅在頁面上載明時記錄，從不臆造。</li>" +
      "<li>大眾運輸時間來自 Transport for Ireland Journey Planner（最快行程，WALK+BUS+TRAM+RAIL+COACH+FERRY）。矩陣使用可比較的平日上午出發：<strong>2026-11-12 08:30</strong>（Europe/Dublin）。這是估計，不是即時時刻表；晚間或週末班次可能不同。</li>" +
      "<li>步行／騎行分鐘 = OSRM 路網距離分別除以 4.8 km/h 與 15 km/h。</li>" +
      "<li>自訂地圖點的通勤為直線距離估計，並清楚標示「非 TFI」。請改選預設地區以取得 TFI 時間。</li>" +
      "<li>地圖上的環圈是依平均速度繪製的示意距離，不是真正的交通等時圈。</li>" +
      "<li>媒合分數為加權平均：通勤、時段、費用、技能、作品集價值、截止日期急迫性。權重隨目標（探索／作品／求職）調整。卡片會列出各項原因。</li>" +
      "</ul></details><details><summary>已知缺口與偏差</summary><ul>" +
      "<li>部分職缺未載明街道，故無法估算通勤，也不進入各區可達性比較。</li>" +
      "<li>入門創意職缺在官方管道仍然稀少，職缺數不能代表整個勞動市場。</li>" +
      "<li>郊區（例如 Balbriggan、Swords、Rush）的面對面機會與班次較少，這會反映在 45 分鐘可達數上。</li>" +
      "<li>TFI 矩陣若有失敗的起訖對，會在 travel_matrix.json 的 failures 中列出（目前 " + failN + " 筆）。</li>" +
      "<li>週期性場次的行事曆日期，是依刊登文字（例如「every Saturday」「4 weeks (Wednesdays)」）在明示範圍內展開，並加以標示。</li>" +
      "<li>截至 " + CHECK_DATE + " 23:34，沒有項目因其所有日期或截止日期已早於當日而被標為過期；若有，預設會隱藏並可辨識。</li>" +
      "</ul></details><p>" + t("formula") + "：explore 權重 通勤 22%、時段 20%、費用 15%、技能 18%、作品集 15%、截止 10%。portfolio 提高作品集權重；job 提高技能權重，並對職缺類別略為加分。通勤在上限內得 100 分，1.25 倍以內 60 分，1.5 倍以內 30 分。</p>";
  } else {
    document.getElementById("method-body").innerHTML =
      "<p>Checked <strong>" + CHECK_DATE + "</strong> (Europe/Dublin). " + (k.validCount ?? 46) + " valid records, " + (k.sourceTraceabilityPct ?? 100) + "% source traceability, " + (k.completenessPct ?? 90.1) + "% completeness (1,326 / 1,472 cells).</p>" +
      "<details open><summary>Method</summary><ul>" +
      "<li>Only still-open items from official employer pages or reputable boards are included. Fees, salaries and deadlines are recorded only when stated; nothing is invented.</li>" +
      "<li>Public-transport minutes come from the Transport for Ireland Journey Planner (fastest itinerary, WALK+BUS+TRAM+RAIL+COACH+FERRY). The matrix uses a comparable weekday-morning departure: <strong>12 Nov 2026 08:30</strong> (Europe/Dublin). These are estimates, not a live timetable; evening and weekend services may differ.</li>" +
      "<li>Walk / cycle minutes use OSRM road-network distance at 4.8 km/h and 15 km/h.</li>" +
      "<li>Travel from a custom map click is a straight-line estimate, clearly labelled as not TFI. Choose a preset area for TFI times.</li>" +
      "<li>Map rings are schematic distance at an assumed speed, not true transit isochrones.</li>" +
      "<li>The match score is a weighted average of travel, time-slot, cost, skill, portfolio value and deadline urgency. Weights shift with your goal. Each card lists the reasons.</li>" +
      "</ul></details><details><summary>Known gaps and biases</summary><ul>" +
      "<li>Some jobs do not state a street, so travel cannot be estimated and they are omitted from area comparisons.</li>" +
      "<li>Entry-level creative vacancies are scarce on official channels; the job count is not a labour-market census.</li>" +
      "<li>Outer areas (for example Balbriggan, Swords, Rush) have fewer in-person opportunities and longer journeys, which shows up in the 45-minute counts.</li>" +
      "<li>Failed TFI origin–destination pairs are listed in travel_matrix.json (currently " + failN + ").</li>" +
      "<li>Recurring calendar dates are expanded only from wording on the listing (for example “every Saturday”, “4 weeks (Wednesdays)”) within a stated horizon.</li>" +
      "<li>As of " + CHECK_DATE + " 23:34, no item had all of its dates or its deadline already before that day; expired items would be hidden by default and labelled.</li>" +
      "</ul></details><p>" + t("formula") + ": explore weights travel 22%, time 20%, cost 15%, skill 18%, portfolio 15%, deadline 10%. The portfolio goal raises the portfolio weight; the job goal raises the skill weight and slightly boosts job listings. Travel scores 100 within your cap, 60 within 1.25× and 30 within 1.5×.</p>";
  }
}
function refreshViews(resetFiltersUi) {
  if (resetFiltersUi == null) resetFiltersUi = true;
  applyI18n();
  renderKpis();
  renderProfileSummary();
  if (resetFiltersUi) renderFilters();
  renderLegend();
  renderPicks();
  try { renderMap(); } catch (err) { console.error("map render failed", err); }
  renderList();
  renderEquity();
  renderBarriers();
  renderCalendar();
  renderShortlist();
  renderMethod();
  if (window.DOA_V4 && typeof window.DOA_V4.render === 'function') window.DOA_V4.render();
}
function openModal(step) {
  onboardStep = step == null ? 0 : step;
  document.getElementById("modal").hidden = false;
  renderModal();
}
function closeModal() {
  document.getElementById("modal").hidden = true;
  if (pickMap) { pickMap.remove(); pickMap = null; }
}
function renderModal() {
  const body = document.getElementById("modal-body");
  const lead = document.getElementById("modal-lead");
  document.getElementById("modal-steps").innerHTML = [0, 1, 2, 3].map((i) => "<span class=\"" + (i <= onboardStep ? "on" : "") + "\"></span>").join("");
  document.getElementById("modal-back-btn").disabled = onboardStep === 0;
  document.getElementById("modal-next").textContent = onboardStep === 3 ? t("done") : t("next");
  if (onboardStep === 0) {
    lead.textContent = profile.lang === "en" ? "Choose a home area, or click the small map. Coordinates come from OpenStreetMap Nominatim (O’Connell Bridge is the fixed study origin)." : "選擇住家地區，或在小地圖上點選。座標來自 OpenStreetMap Nominatim（市中心為固定研究起點 O’Connell Bridge）。";
    body.innerHTML = "<div class=\"preset-grid\" id=\"preset-grid\"></div><div id=\"mini-map-pick\"></div><p style=\"font-size:12px;color:var(--muted)\" id=\"home-chosen\"></p>";
    const grid = document.getElementById("preset-grid");
    origins().forEach((o) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "preset";
      b.setAttribute("aria-pressed", profile.homeId === o.id ? "true" : "false");
      b.textContent = profile.lang === "zh" ? (o.nameZh || o.name) : o.name;
      b.onclick = function () {
        profile.homeId = o.id; profile.lat = o.lat; profile.lng = o.lng; profile.homeLabel = o.name;
        saveProfile(); renderModal();
      };
      grid.appendChild(b);
    });
    setTimeout(function () {
      if (pickMap) { pickMap.remove(); pickMap = null; }
      pickMap = L.map("mini-map-pick").setView([profile.lat, profile.lng], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(pickMap);
      const mk = L.marker([profile.lat, profile.lng]).addTo(pickMap);
      pickMap.on("click", function (e) {
        profile.homeId = "custom"; profile.lat = e.latlng.lat; profile.lng = e.latlng.lng;
        profile.homeLabel = profile.lang === "en" ? "Custom pin" : "自訂地點";
        mk.setLatLng(e.latlng);
        document.getElementById("home-chosen").textContent = profile.homeLabel + ": " + profile.lat.toFixed(5) + ", " + profile.lng.toFixed(5) + " · " + t("customEst");
        saveProfile();
      });
    }, 50);
  } else if (onboardStep === 1) {
    lead.textContent = profile.lang === "en" ? "How do you usually travel, and what is the longest journey you will make?" : "你通常怎麼通勤，最多能接受幾分鐘？";
    body.innerHTML = "<div class=\"field\"><div class=\"preset-grid\">" +
      ["pt", "walk", "cycle"].map((m) => "<button type=\"button\" class=\"goal\" data-mode=\"" + m + "\" aria-pressed=\"" + (profile.mode === m) + "\">" + (m === "pt" ? t("modePt") : m === "walk" ? t("modeWalk") : t("modeCycle")) + "</button>").join("") +
      "</div></div><div class=\"field\"><label>" + t("maxMin") + ": <strong id=\"max-lab\">" + profile.maxMinutes + "</strong></label>" +
      "<input type=\"range\" id=\"max-range\" min=\"15\" max=\"90\" step=\"5\" value=\"" + profile.maxMinutes + "\" /></div>" +
      "<div class=\"field\"><label>" + t("goal") + "</label><div class=\"preset-grid\">" +
      [["explore", t("goalExplore")], ["portfolio", t("goalPortfolio")], ["job", t("goalJob")]].map((g) =>
        "<button type=\"button\" class=\"goal\" data-goal=\"" + g[0] + "\" aria-pressed=\"" + (profile.goal === g[0]) + "\">" + g[1] + "</button>"
      ).join("") + "</div></div>";
    body.querySelectorAll("[data-mode]").forEach((b) => { b.onclick = function () { profile.mode = b.getAttribute("data-mode"); saveProfile(); renderModal(); }; });
    body.querySelectorAll("[data-goal]").forEach((b) => { b.onclick = function () { profile.goal = b.getAttribute("data-goal"); saveProfile(); renderModal(); }; });
    document.getElementById("max-range").oninput = function (e) { profile.maxMinutes = Number(e.target.value); document.getElementById("max-lab").textContent = String(profile.maxMinutes); saveProfile(); };
  } else if (onboardStep === 2) {
    lead.textContent = profile.lang === "en" ? "Tick the weekly slots when you are free. Leave all blank if you do not want time to filter results." : "勾選你有空的時段。若全部留空，時段不會硬性篩選結果。";
    const head = "<tr><th></th>" + PERIODS.map((p) => "<th>" + t(p) + "</th>").join("") + "</tr>";
    const rows = DAYS.map((d) => "<tr><th>" + DAY_LABEL[profile.lang][d] + "</th>" + PERIODS.map((p) => {
      const k = d + "-" + p; const on = !!profile.slots[k];
      return "<td><button type=\"button\" data-slot=\"" + k + "\" aria-pressed=\"" + on + "\">" + (on ? "✓" : "") + "</button></td>";
    }).join("") + "</tr>").join("");
    body.innerHTML = "<table class=\"time-grid\">" + head + rows + "</table>";
    body.querySelectorAll("[data-slot]").forEach((b) => {
      b.onclick = function () {
        const k = b.getAttribute("data-slot");
        profile.slots[k] = !profile.slots[k];
        if (!profile.slots[k]) delete profile.slots[k];
        saveProfile(); renderModal();
      };
    });
  } else {
    lead.textContent = profile.lang === "en" ? "Set an optional fee cap and the skills you want to focus on." : "可選費用上限，以及你想專注的技能。";
    const caps = [null, 0, 50, 200];
    body.innerHTML = "<div class=\"field\"><label>" + t("budget") + "</label><div class=\"preset-grid\">" +
      caps.map((c) => "<button type=\"button\" class=\"goal\" data-budget=\"" + (c === null ? "none" : c) + "\" aria-pressed=\"" + ((profile.budget == null && c == null) || profile.budget === c) + "\">" + (c === null ? t("noBudget") : c === 0 ? (profile.lang === "en" ? "Free only" : "只看免費") : ("€" + c)) + "</button>").join("") +
      "</div></div><div class=\"field\"><label>" + t("skills") + "</label><div class=\"preset-grid\">" +
      SKILLS.map((s) => "<button type=\"button\" class=\"skill-btn\" data-skill=\"" + s + "\" aria-pressed=\"" + profile.skills.includes(s) + "\">" + s + "</button>").join("") +
      "</div></div>";
    body.querySelectorAll("[data-budget]").forEach((b) => {
      b.onclick = function () {
        const v = b.getAttribute("data-budget");
        profile.budget = v === "none" ? null : Number(v);
        saveProfile(); renderModal();
      };
    });
    body.querySelectorAll("[data-skill]").forEach((b) => {
      b.onclick = function () {
        const s = b.getAttribute("data-skill");
        if (profile.skills.includes(s)) profile.skills = profile.skills.filter((x) => x !== s);
        else profile.skills = profile.skills.concat([s]);
        saveProfile(); renderModal();
      };
    });
  }
}
function bindEvents() {
  document.getElementById("lang-zh").onclick = function () { profile.lang = "zh"; saveProfile(); refreshViews(); };
  document.getElementById("lang-en").onclick = function () { profile.lang = "en"; saveProfile(); refreshViews(); };
  document.getElementById("btn-profile").onclick = function () { openModal(0); };
  document.getElementById("btn-edit-profile").onclick = function () { openModal(0); };
  document.getElementById("btn-share").onclick = copyShare;
  document.getElementById("btn-share-2").onclick = copyShare;
  document.getElementById("btn-short-count").onclick = function () { document.getElementById("shortlist").scrollIntoView({ behavior: "smooth" }); };
  document.getElementById("only-skills").onchange = function () { refreshViews(false); };
  document.getElementById("btn-csv").onclick = exportCsv;
  document.getElementById("btn-print").onclick = function () { window.print(); };
  document.getElementById("btn-ics-short").onclick = function () {
    const items = Array.from(shortlist).map((id) => itemsAll().find((i) => i.id === id)).filter(Boolean);
    if (!items.length) return;
    downloadText("shortlist.ics", icsForItems(items), "text/calendar");
  };
  document.getElementById("modal-skip").onclick = function () { closeModal(); saveProfile(); refreshViews(); };
  document.getElementById("modal-back-btn").onclick = function () { onboardStep = Math.max(0, onboardStep - 1); renderModal(); };
  document.getElementById("modal-next").onclick = function () {
    if (onboardStep < 3) { onboardStep += 1; renderModal(); }
    else { closeModal(); saveProfile(); refreshViews(); history.replaceState(null, "", shareUrl()); }
  };
  document.getElementById("modal").addEventListener("click", function (e) { if (e.target.id === "modal") closeModal(); });
  document.body.addEventListener("click", function (e) {
    const star = e.target.closest("[data-star]");
    if (star) {
      const id = star.getAttribute("data-star");
      if (shortlist.has(id)) shortlist.delete(id); else shortlist.add(id);
      saveProfile(); renderPicks(); renderList(); renderShortlist(); renderCalendar();
      return;
    }
    const ics = e.target.closest("[data-ics]");
    if (ics) {
      const item = itemsAll().find((i) => i.id === ics.getAttribute("data-ics"));
      if (item) downloadText(item.id + ".ics", icsForItems([item]), "text/calendar");
      return;
    }
    const open = e.target.closest("[data-open]");
    if (open) selectItem(open.getAttribute("data-open"));
  });
}
function waitForLibs() {
  return new Promise(function (resolve, reject) {
    if (typeof L !== "undefined" && typeof Chart !== "undefined") return resolve();
    var n = 0;
    var tmr = setInterval(function () {
      n += 1;
      if (typeof L !== "undefined" && typeof Chart !== "undefined") { clearInterval(tmr); resolve(); }
      else if (n > 80) { clearInterval(tmr); reject(new Error("Leaflet or Chart.js did not load")); }
    }, 50);
  });
}
async function main() {
  await waitForLibs();
  const dataRes = await fetch("atlas_data.json");
  const matrixRes = await fetch("travel_matrix.json");
  if (!dataRes.ok) throw new Error("atlas_data.json missing");
  DATA = await dataRes.json();
  MATRIX = matrixRes.ok ? await matrixRes.json() : { origins: [], destinations: [], matrix: {}, failures: [] };
  if (!origins().length) {
    MATRIX.origins = [{ id: "city-centre", name: "City Centre", nameZh: "市中心", lat: 53.3473, lng: -6.2591 }];
  }
  loadProfile();
  const o = origins().find((x) => x.id === profile.homeId);
  if (o) { profile.lat = o.lat; profile.lng = o.lng; if (profile.homeId !== "custom") profile.homeLabel = o.name; }
  bindEvents();
  refreshViews();
  if (map) { setTimeout(function () { try { map.invalidateSize(); } catch (e) {} }, 300); }
  const first = !localStorage.getItem(STORAGE_PROFILE) && !location.search;
  if (first) openModal(0);
  window.addEventListener("resize", function () { if (map) map.invalidateSize(); });
}
main().catch(function (err) {
  console.error(err);
  var box = document.getElementById("picks-grid");
  if (box) box.innerHTML = "<p>Failed to start the dashboard: " + escapeHtml(err && err.message ? err.message : String(err)) + "</p>";
});
