/* Dublin Opportunity Atlas v4 */
"use strict";

const V4_CATS = "doa-categories-v4";
const V4_CORR = "doa-corrections-v4";
const V4_TRACK = "doa-tracker-v4";
const V4_PLAN = "doa-planner-v4";
const V4_SEARCH = "doa-searches-v4";
const V4_COMPARE = "doa-compare-v4";

const V4I = {
  zh: {
    banner: "資料最近更新：{date}（Europe/Dublin）。本週新增 {n} 筆。這是靜態資料集：完整更新需執行 python scripts/refresh.py 後發布。",
    close: "關閉", whyClass: "為什麼這樣分類", report: "回報分類錯誤",
    newBadge: "本週新增", changedBadge: "已變更", expiredBadge: "已過期", removedBadge: "已下架",
    evTitle: "分類依據（可查證）", evLead: "下列引用來自官方頁面，用來說明類型、技能、僱用形式或產業標籤。規則編號表示觸發的分類規則。",
    lastVer: "最近核對", source: "來源", rule: "規則",
    stampOk: "載明工時未超過學期 20 小時／週。",
    stampOver: "載明工時為每週 {h} 小時，超過學期上限 20 小時。假期（6–9 月，以及 12 月 15 日至 1 月 15 日）上限為 40 小時。",
    stampUnknown: "此職缺未載明每週工時，無法自動判斷是否符合 Stamp 2。請直接向雇主確認，並查核官方說明。",
    stampPart: "刊登標示為兼職（part-time），但未寫每週時數。請向雇主確認實際工時。",
    stampFreelance: "官方說明：持 Stamp 2 者「不得從事其他商業或貿易」（must not engage in any other business or trade），且規劃頁寫明學生不得自僱。自由工作／自僱請先查核官方指引，本工具不做法律判斷。",
    stampDisc: "這只是根據刊登上載明的工時，對照移民局公開說明所做的提示，不是法律或移民建議。請以 Immigration Service Delivery 的官方頁面為準。",
    stampLink: "官方 FAQ：我可以在讀書期間工作嗎？",
    plannerEmpty: "先把項目加入短名單，再拖到下面的週格子。",
    plannerTotals: "本週加總（只計來源有載明的數字，否則顯示「未載明」）",
    hours: "工時", travel: "通勤（分）", cost: "費用", clashes: "時段衝突",
    gapNone: "短名單裡還沒有職缺，或那些職缺沒有引用所需技能。",
    trackEmpty: "還沒有追蹤中的職缺。在職缺卡片上按「加入追蹤」。",
    interested: "有興趣", applied: "已申請", interview: "面試", offer: "錄取",
    catPreview: "符合 {n} 筆", catConflicts: "衝突／未分類",
    uncategorised: "未分類", conflict: "多個分類同時符合",
    savedSearches: "已儲存的搜尋", saveSearch: "儲存目前篩選",
    feedsLead: "以閱讀器訂閱這些 feed，即可在資料集更新並發布後看到新項目。",
    compareNeed: "請先在清單或精選中勾選最多 3 筆再比較。",
    correctionSaved: "已在本機儲存更正，可匯出 corrections 檔。",
    exportCorr: "匯出更正檔",
    hideRemoved: "隱藏已下架／已過期",
    emp: "僱用形式", sector: "產業", usercat: "我的分類",
    addTrack: "加入追蹤", stampFlag: "Stamp 2 工時提示",
    logAdded: "新增", logRemoved: "下架", logChanged: "變更", logExpired: "過期",
    noLog: "目前沒有更新紀錄，或 changelog.json 尚未載入。"
  },
  en: {
    banner: "Data last updated: {date} (Europe/Dublin). {n} record(s) are new this week. This is a static dataset: a full refresh means running python scripts/refresh.py and publishing the result.",
    close: "Close", whyClass: "Why classified this way", report: "Report misclassification",
    newBadge: "New this week", changedBadge: "Changed", expiredBadge: "Expired", removedBadge: "Removed",
    evTitle: "Why this was classified this way", evLead: "Quoted snippets from the official page that support the category, skill, employment type or sector tags. The rule id is the classification rule that fired.",
    lastVer: "Last verified", source: "Source", rule: "Rule",
    stampOk: "Stated hours do not exceed the term-time 20 hours/week limit.",
    stampOver: "Stated hours are {h} per week, above the term-time limit of 20. During June–September and 15 December–15 January the published limit is 40 hours/week.",
    stampUnknown: "This job does not state weekly hours, so Stamp 2 fit cannot be checked automatically. Confirm hours with the employer and read the official guidance.",
    stampPart: "The listing is marked part-time but does not state weekly hours. Confirm actual hours with the employer.",
    stampFreelance: "Official guidance says Stamp 2 holders 'must not engage in any other business or trade', and the planning page says students cannot be self-employed. Check official guidance before freelance work; this tool is not a legal assessment.",
    stampDisc: "This is a pointer based on hours stated on the listing, compared with published Immigration Service Delivery text. It is not legal or immigration advice. Rely on the official pages.",
    stampLink: "Official FAQ: Can I work while studying?",
    plannerEmpty: "Star items first, then drag them onto the week grid.",
    plannerTotals: "Weekly totals (only stated figures are summed; otherwise 'not stated')",
    hours: "Hours", travel: "Travel (min)", cost: "Cost", clashes: "Clashes",
    gapNone: "No shortlisted jobs, or those jobs do not quote required skills.",
    trackEmpty: "No jobs in the tracker yet. Use 'Add to tracker' on a job card.",
    interested: "Interested", applied: "Applied", interview: "Interview", offer: "Offer",
    catPreview: "{n} matches", catConflicts: "Conflicts / uncategorised",
    uncategorised: "Uncategorised", conflict: "Matches more than one category",
    savedSearches: "Saved searches", saveSearch: "Save current filters",
    feedsLead: "Subscribe to these feeds in a reader. New items appear after the dataset is refreshed and published.",
    compareNeed: "Select up to 3 items in the list or picks, then compare.",
    correctionSaved: "Correction saved locally. You can export a corrections file.",
    exportCorr: "Export corrections",
    hideRemoved: "Hide removed / expired",
    emp: "Employment type", sector: "Sector", usercat: "My categories",
    addTrack: "Add to tracker", stampFlag: "Stamp 2 hours flag",
    logAdded: "Added", logRemoved: "Removed", logChanged: "Changed", logExpired: "Expired",
    noLog: "No changelog loaded yet."
  }
};

function vt(key) {
  const lang = (typeof profile !== "undefined" && profile.lang) || "zh";
  return (V4I[lang] || V4I.zh)[key] || (typeof t === "function" ? t(key) : key);
}

function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key) || "null"); return v == null ? fallback : v; }
  catch (e) { return fallback; }
}
function saveJSON(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

function stamp2() {
  return (DATA && (DATA.stamp2 || (DATA.kpis && DATA.kpis.stamp2))) || {
    term_hours: 20, holiday_hours: 40,
    faq_url: "https://www.irishimmigration.ie/coming-to-study-in-ireland/frequently-asked-questions-for-students/",
    planning_url: "https://www.irishimmigration.ie/coming-to-study-in-ireland/what-are-my-study-options/planning-to-study-in-ireland/",
    stamps_url: "https://www.irishimmigration.ie/registering-your-immigration-permission/information-on-registering/immigration-permission-stamps/"
  };
}

function changelog() { return window.DOA_CHANGELOG || { added: [], removed: [], changed: [], expired: [] }; }
function changedIds() { return new Set((changelog().changed || []).map((x) => x.id)); }

function badgesFor(item) {
  const bits = [];
  if (item.new_this_week) bits.push(`<span class="badge badge-new">${escapeHtml(vt("newBadge"))}</span>`);
  if (changedIds().has(item.id)) bits.push(`<span class="badge badge-changed">${escapeHtml(vt("changedBadge"))}</span>`);
  if (item.status === "expired") bits.push(`<span class="badge badge-expired">${escapeHtml(vt("expiredBadge"))}</span>`);
  if (item.status === "removed") bits.push(`<span class="badge badge-removed">${escapeHtml(vt("removedBadge"))}</span>`);
  if (typeof deadlineSoon === "function" && deadlineSoon(item)) bits.push(`<span class="badge badge-soon">${escapeHtml(vt("stampFlag") && t("deadlineSoon"))}</span>`);
  if (item.category === "job") {
    const fl = stampFlag(item);
    if (fl.level === "over") bits.push(`<span class="badge badge-stamp-warn">Stamp 2</span>`);
    else if (fl.level === "ok") bits.push(`<span class="badge badge-stamp">Stamp 2</span>`);
  }
  return bits.join(" ");
}

function stampFlag(item) {
  if (!item || item.category !== "job") return { level: "na", text: "" };
  const s = stamp2();
  const h = item.hours_per_week;
  if (item.employment_type === "freelance") {
    return { level: "info", text: vt("stampFreelance") };
  }
  if (h == null || h === "") {
    if (item.employment_type === "part-time") return { level: "info", text: vt("stampPart") };
    return { level: "unknown", text: vt("stampUnknown") };
  }
  if (Number(h) > s.term_hours) return { level: "over", text: vt("stampOver").replace("{h}", String(h)) };
  return { level: "ok", text: vt("stampOk") };
}

function defaultCats() {
  return (DATA && DATA.category_presets) ? JSON.parse(JSON.stringify(DATA.category_presets)) : [];
}

function userCats() {
  const saved = loadJSON(V4_CATS, null);
  if (Array.isArray(saved) && saved.length) return saved;
  return defaultCats();
}

function itemBlob(item, fields) {
  return (fields || ["title", "skill", "organiser", "sectors", "category", "employment_type", "portfolioWhy"])
    .map((f) => Array.isArray(item[f]) ? item[f].join(" ") : String(item[f] || ""))
    .join(" \n ")
    .toLowerCase();
}

function matchCat(item, cat, tags) {
  if (cat.custom === "stamp2_part_time") {
    if (item.category !== "job") return false;
    if (item.hours_per_week != null && Number(item.hours_per_week) <= 20) return true;
    if (item.employment_type === "part-time") return true;
    return false;
  }
  const manual = (tags || {})[item.id] || [];
  if (manual.includes(cat.id)) return true;
  const blob = itemBlob(item, cat.fields);
  const inc = (cat.include || []).map((x) => String(x).toLowerCase()).filter(Boolean);
  const exc = (cat.exclude || []).map((x) => String(x).toLowerCase()).filter(Boolean);
  if (!inc.length && !cat.custom) return false;
  const hit = cat.match === "AND" ? inc.every((k) => blob.includes(k)) : inc.some((k) => blob.includes(k));
  if (!hit) return false;
  if (exc.some((k) => blob.includes(k))) return false;
  return true;
}

function catsWithTags() {
  const cats = userCats();
  const tags = {};
  cats.forEach((c) => { (c.manual || []).forEach((id) => { (tags[id] || (tags[id] = [])).push(c.id); }); });
  return { cats, tags };
}

function openDrawer(title, html) {
  const d = document.getElementById("drawer");
  document.getElementById("drawer-title").textContent = title;
  document.getElementById("drawer-body").innerHTML = html;
  d.hidden = false;
}

function closeDrawer() {
  const d = document.getElementById("drawer");
  if (d) d.hidden = true;
}

function evidenceHtml(item) {
  const ev = item.classification_evidence || [];
  const rows = ev.map((e) => `
    <div class="evidence">
      <div><strong>${escapeHtml(e.field)}</strong> → ${escapeHtml(String(e.value))}
        <span class="badge">${escapeHtml(vt("rule"))} ${escapeHtml(e.rule_id || "")}</span></div>
      ${e.quote ? `<blockquote>“${escapeHtml(e.quote)}”</blockquote>` : ""}
      <div class="lede" style="font-size:12px">${escapeHtml(vt("source"))}: <a href="${escapeHtml(e.source || item.source)}" target="_blank" rel="noopener">${escapeHtml(e.source || item.source || "")}</a>
        · ${escapeHtml(vt("lastVer"))}: ${escapeHtml(item.last_checked || (DATA.kpis && DATA.kpis.dateChecked) || "")}</div>
    </div>`).join("") || "<p>No classification evidence recorded for this item.</p>";
  return `<p class="lede">${escapeHtml(vt("evLead"))}</p>${rows}
    <div class="row-actions" style="margin-top:12px">
      <button class="btn" type="button" data-report="${escapeHtml(item.id)}">${escapeHtml(vt("report"))}</button>
    </div>`;
}

function reportForm(id) {
  return `<form id="corr-form">
    <p>${escapeHtml(vt("report"))}: <strong>${escapeHtml(id)}</strong></p>
    <label>Field<br/><input name="field" value="category" style="width:100%"/></label>
    <label>Suggested value<br/><input name="value" style="width:100%"/></label>
    <label>Note<br/><textarea name="note" rows="3" style="width:100%"></textarea></label>
    <div class="row-actions" style="margin-top:8px"><button class="btn primary" type="submit">${escapeHtml(vt("correctionSaved").split("。")[0] || "Save")}</button></div>
  </form>`;
}

function renderBanner() {
  const el = document.getElementById("update-banner");
  if (!el || !DATA) return;
  const date = (DATA.kpis && (DATA.kpis.dateChecked || DATA.kpis.lastUpdated)) || "2026-11-12";
  const n = itemsAll().filter((i) => i.new_this_week && i.status === "active").length;
  el.hidden = false;
  el.innerHTML = escapeHtml(vt("banner")).replace("{date}", date).replace("{n}", String(n));
  const lab = document.getElementById("checked-label");
  if (lab) {
    lab.textContent = (profile.lang === "en" ? "Checked: " : "資料核對：") + date + "（Europe/Dublin）";
  }
}

function renderV4Filters() {
  const host = document.getElementById("filters-v4");
  if (!host) return;
  const emps = Array.from(new Set(itemsAll().map((i) => i.employment_type).filter(Boolean))).sort();
  const sectors = Array.from(new Set(itemsAll().flatMap((i) => i.sectors || []))).sort();
  const { cats } = catsWithTags();
  const empSel = ["all"].concat(emps).map((e) => `<option value="${escapeHtml(e)}">${escapeHtml(e)}</option>`).join("");
  const secSel = ["all"].concat(sectors).map((e) => `<option value="${escapeHtml(e)}">${escapeHtml(e)}</option>`).join("");
  const catSel = [`<option value="all">${escapeHtml(vt("usercat"))}</option>`].concat(cats.map((c) => {
    const name = (c.name && (c.name[profile.lang] || c.name.en || c.name.zh)) || c.id;
    return `<option value="${escapeHtml(c.id)}">${escapeHtml(name)}</option>`;
  })).join("");
  host.innerHTML = `
    <label class="chip plain">${escapeHtml(vt("emp"))}
      <select id="f-emp">${empSel}</select></label>
    <label class="chip plain">${escapeHtml(vt("sector"))}
      <select id="f-sector">${secSel}</select></label>
    <label class="chip plain">${escapeHtml(vt("usercat"))}
      <select id="f-usercat">${catSel}</select></label>
    <label class="chip plain"><input type="checkbox" id="f-hide-gone" checked/> ${escapeHtml(vt("hideRemoved"))}</label>`;
  const fe = document.getElementById("f-emp");
  const fs = document.getElementById("f-sector");
  const fc = document.getElementById("f-usercat");
  if (window._v4f) {
    if (fe) fe.value = window._v4f.emp || "all";
    if (fs) fs.value = window._v4f.sector || "all";
    if (fc) fc.value = window._v4f.usercat || "all";
  }
  ["f-emp", "f-sector", "f-usercat", "f-hide-gone"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el || el._bound) return;
    el._bound = true;
    el.addEventListener("change", () => {
      window._v4f = {
        emp: (document.getElementById("f-emp") || {}).value || "all",
        sector: (document.getElementById("f-sector") || {}).value || "all",
        usercat: (document.getElementById("f-usercat") || {}).value || "all",
        hideGone: (document.getElementById("f-hide-gone") || {}).checked !== false
      };
      if (typeof refreshViews === "function") refreshViews(false);
    });
  });
}

function v4Passes(item) {
  const f = window._v4f || { emp: "all", sector: "all", usercat: "all", hideGone: true };
  if (f.hideGone !== false && (item.status === "removed" || item.status === "expired")) return false;
  if (f.emp && f.emp !== "all" && item.employment_type !== f.emp) return false;
  if (f.sector && f.sector !== "all" && !(item.sectors || []).includes(f.sector)) return false;
  if (f.usercat && f.usercat !== "all") {
    const { cats, tags } = catsWithTags();
    const cat = cats.find((c) => c.id === f.usercat);
    if (cat && !matchCat(item, cat, tags)) return false;
  }
  return true;
}

function decorateCards() {
  const compare = new Set(loadJSON(V4_COMPARE, []));
  document.querySelectorAll(".pick, .opp-row, .cal-item, #shortlist-box li, #shortlist-box article").forEach((el) => {
    const id = el.dataset.id || el.getAttribute("data-id") || el.getAttribute("data-open") || el.getAttribute("data-star");
    if (!id) return;
    const item = itemsAll().find((x) => x.id === id);
    if (!item) return;
    if (!el.querySelector(".v4-badges")) {
      const wrap = document.createElement("div");
      wrap.className = "v4-badges";
      wrap.innerHTML = badgesFor(item);
      el.insertBefore(wrap, el.firstChild);
    }
    if (!el.querySelector(".v4-actions")) {
      const act = document.createElement("div");
      act.className = "v4-actions row-actions";
      act.innerHTML = `
        <button class="btn" type="button" data-why="${escapeHtml(id)}">${escapeHtml(vt("whyClass"))}</button>
        <label class="chip plain"><input type="checkbox" data-compare="${escapeHtml(id)}" ${compare.has(id) ? "checked" : ""}/> ${escapeHtml(profile.lang === "en" ? "Compare" : "比較")}</label>
        ${item.category === "job" ? `<button class="btn" type="button" data-track="${escapeHtml(id)}">${escapeHtml(vt("addTrack"))}</button>` : ""}`;
      el.appendChild(act);
    }
  });
  // If picks don't have data-id, try to infer from star buttons
  document.querySelectorAll("#picks-grid .pick").forEach((el) => {
    if (el.dataset.id) return;
    const star = el.querySelector("[data-star], button[data-id], .star");
    const id = (star && (star.dataset.star || star.dataset.id)) || (el.querySelector("[data-id]") || {}).dataset.id;
    if (id) el.dataset.id = id;
  });
}

function bindV4Clicks() {
  document.body.addEventListener("click", (ev) => {
    const why = ev.target.closest("[data-why]");
    if (why) {
      const item = itemsAll().find((x) => x.id === why.getAttribute("data-why"));
      if (item) openDrawer(vt("evTitle") + " · " + item.title, evidenceHtml(item));
    }
    const track = ev.target.closest("[data-track]");
    if (track) addTracker(track.getAttribute("data-track"));
    const report = ev.target.closest("[data-report]");
    if (report) openDrawer(vt("report"), reportForm(report.getAttribute("data-report")));
    const rm = ev.target.closest("[data-track-del]");
    if (rm) {
      const all = loadJSON(V4_TRACK, {});
      delete all[rm.getAttribute("data-track-del")];
      saveJSON(V4_TRACK, all);
      renderTracker();
    }
  });
  document.body.addEventListener("change", (ev) => {
    const c = ev.target.closest("[data-compare]");
    if (c) {
      const id = c.getAttribute("data-compare");
      const set = new Set(loadJSON(V4_COMPARE, []));
      if (c.checked) {
        if (set.size >= 3) { c.checked = false; return; }
        set.add(id);
      } else set.delete(id);
      saveJSON(V4_COMPARE, [...set]);
    }
    const st = ev.target.closest("[data-track-status]");
    if (st) {
      const all = loadJSON(V4_TRACK, {});
      const id = st.getAttribute("data-track-status");
      all[id] = Object.assign({}, all[id] || { id }, { status: st.value });
      saveJSON(V4_TRACK, all);
    }
  });
  const close = document.getElementById("drawer-close");
  if (close) close.addEventListener("click", closeDrawer);
  const formHost = document.getElementById("drawer");
  if (formHost) formHost.addEventListener("submit", (ev) => {
    if (ev.target.id !== "corr-form") return;
    ev.preventDefault();
    const fd = new FormData(ev.target);
    const title = (document.getElementById("drawer-title").textContent || "").split(":")[0];
    // id is in the form heading text like OPP-01
    const idMatch = ev.target.innerHTML.match(/OPP-\d+/);
    const rec = {
      id: idMatch ? idMatch[0] : "",
      field: fd.get("field"),
      value: fd.get("value"),
      note: fd.get("note"),
      at: new Date().toISOString()
    };
    const all = loadJSON(V4_CORR, []);
    all.push(rec);
    saveJSON(V4_CORR, all);
    ev.target.insertAdjacentHTML("beforeend", `<p>${escapeHtml(vt("correctionSaved"))}</p>`);
  });
}

function renderStamp2() {
  const host = document.getElementById("stamp2-box");
  if (!host) return;
  const s = stamp2();
  const jobs = itemsAll().filter((i) => i.category === "job" && i.status !== "removed" && i.status !== "expired");
  const over = jobs.filter((i) => stampFlag(i).level === "over");
  const unknown = jobs.filter((i) => stampFlag(i).level === "unknown" || stampFlag(i).level === "info");
  const ok = jobs.filter((i) => stampFlag(i).level === "ok");
  host.innerHTML = `
    <p>${escapeHtml((s.quote_hours) || "")}</p>
    <p><a href="${escapeHtml(s.faq_url)}" target="_blank" rel="noopener">${escapeHtml(vt("stampLink"))}</a>
      · <a href="${escapeHtml(s.stamps_url)}" target="_blank" rel="noopener">Stamp conditions</a>
      · <a href="${escapeHtml(s.planning_url)}" target="_blank" rel="noopener">Planning to study / work placements</a></p>
    <p class="disclaimer">${escapeHtml(vt("stampDisc"))}</p>
    <ul>
      <li>${escapeHtml(profile.lang === "en" ? "Jobs with stated hours over 20/week (term)" : "載明工時超過學期 20 小時／週")}： <strong>${over.length}</strong>
        ${over.map((i) => `<div>${escapeHtml(i.title)} — ${escapeHtml(stampFlag(i).text)}</div>`).join("")}</li>
      <li>${escapeHtml(profile.lang === "en" ? "Within stated 20-hour term cap" : "載明工時未超過 20 小時")}： ${ok.length}
        ${ok.map((i) => ` · ${escapeHtml(i.title)} (${i.hours_per_week}h)`).join("")}</li>
      <li>${escapeHtml(profile.lang === "en" ? "Hours not stated or only marked part-time" : "未載明工時或僅標示兼職")}： ${unknown.length}</li>
    </ul>
    <p class="disclaimer">${escapeHtml(vt("stampFreelance"))}</p>`;
}

function plannerState() { return loadJSON(V4_PLAN, {}); }
function renderPlanner() {
  const host = document.getElementById("planner-box");
  if (!host) return;
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const periods = ["morning", "afternoon", "evening"];
  const dayLab = (typeof DAY_LABEL !== "undefined" ? DAY_LABEL[profile.lang] : null) || {};
  const short = [...shortlist].map((id) => itemsAll().find((x) => x.id === id)).filter(Boolean);
  const plan = plannerState();
  const used = new Set(Object.values(plan).flat());
  const pool = short.filter((i) => !used.has(i.id));
  let html = `<div class="planner-pool" id="planner-pool">`;
  if (!short.length) html += `<span class="lede">${escapeHtml(vt("plannerEmpty"))}</span>`;
  pool.forEach((i) => { html += `<span class="planner-chip" draggable="true" data-pid="${i.id}">${escapeHtml(i.title)}</span>`; });
  html += `</div><div class="planner-grid"><div></div>`;
  days.forEach((d) => { html += `<div class="planner-head">${escapeHtml(dayLab[d] || d)}</div>`; });
  periods.forEach((p) => {
    html += `<div class="planner-lab">${escapeHtml(t(p))}</div>`;
    days.forEach((d) => {
      const key = d + "-" + p;
      const ids = plan[key] || [];
      html += `<div class="planner-cell" data-slot="${key}">`;
      ids.forEach((id) => {
        const it = itemsAll().find((x) => x.id === id);
        if (it) html += `<span class="planner-chip" draggable="true" data-pid="${id}">${escapeHtml(it.title)}</span>`;
      });
      html += `</div>`;
    });
  });
  html += `</div>`;
  // totals
  const allIds = Object.values(plan).flat();
  let hoursKnown = 0, hoursMissing = 0, travel = 0, travelMissing = 0, cost = 0, costMissing = 0;
  allIds.forEach((id) => {
    const it = itemsAll().find((x) => x.id === id);
    if (!it) return;
    if (it.hours_per_week != null) hoursKnown += Number(it.hours_per_week);
    else if (it.category === "job") hoursMissing += 1;
    const tr = typeof travelOf === "function" ? travelOf(it) : null;
    const mins = tr && (tr.minutes || tr.min || tr.pt);
    if (typeof mins === "number") travel += mins;
    else if (it.format !== "online") travelMissing += 1;
    if (typeof it.cost === "number") cost += it.cost;
    else if (it.category !== "job") costMissing += 1;
  });
  // clashes: same item in overlapping slots, or two jobs in same slot
  const clashes = [];
  Object.keys(plan).forEach((k) => {
    if ((plan[k] || []).length > 1) clashes.push(k);
  });
  const stampWarn = hoursKnown > 20 ? vt("stampOver").replace("{h}", String(hoursKnown)) : "";
  html += `<p><strong>${escapeHtml(vt("plannerTotals"))}</strong> —
    ${escapeHtml(vt("hours"))}: ${hoursKnown}${hoursMissing ? " + " + hoursMissing + "× not stated" : ""} ·
    ${escapeHtml(vt("travel"))}: ${travel}${travelMissing ? " + " + travelMissing + "× not stated" : ""} ·
    ${escapeHtml(vt("cost"))}: €${cost}${costMissing ? " + " + costMissing + "× not stated" : ""}</p>`;
  if (clashes.length) html += `<p class="planner-warn">${escapeHtml(vt("clashes"))}: ${escapeHtml(clashes.join(", "))}</p>`;
  if (stampWarn) html += `<p class="planner-warn">${escapeHtml(stampWarn)}</p>`;
  host.innerHTML = html;
  bindPlannerDnD();
}

function bindPlannerDnD() {
  const host = document.getElementById("planner-box");
  if (!host) return;
  host.querySelectorAll("[data-pid]").forEach((el) => {
    el.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/plain", el.getAttribute("data-pid")); });
  });
  host.querySelectorAll("[data-slot], #planner-pool").forEach((cell) => {
    cell.addEventListener("dragover", (e) => { e.preventDefault(); cell.classList.add("over"); });
    cell.addEventListener("dragleave", () => cell.classList.remove("over"));
    cell.addEventListener("drop", (e) => {
      e.preventDefault(); cell.classList.remove("over");
      const id = e.dataTransfer.getData("text/plain");
      const plan = plannerState();
      Object.keys(plan).forEach((k) => { plan[k] = (plan[k] || []).filter((x) => x !== id); });
      if (cell.id !== "planner-pool") {
        const key = cell.getAttribute("data-slot");
        plan[key] = (plan[key] || []).concat([id]);
      }
      saveJSON(V4_PLAN, plan);
      renderPlanner();
    });
  });
}

function addTracker(id) {
  const all = loadJSON(V4_TRACK, {});
  if (!all[id]) all[id] = { id, status: "interested", note: "", at: new Date().toISOString() };
  saveJSON(V4_TRACK, all);
  renderTracker();
  const el = document.getElementById("tracker");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function renderTracker() {
  const host = document.getElementById("tracker-box");
  if (!host) return;
  const all = loadJSON(V4_TRACK, {});
  const ids = Object.keys(all);
  if (!ids.length) { host.innerHTML = `<p class="lede">${escapeHtml(vt("trackEmpty"))}</p>`; return; }
  const opts = ["interested", "applied", "interview", "offer"];
  let html = `<table class="tracker-table"><thead><tr><th>Job</th><th>Status</th><th>Deadline</th><th>Notes</th><th></th></tr></thead><tbody>`;
  ids.forEach((id) => {
    const it = itemsAll().find((x) => x.id === id) || { title: id, deadline: "" };
    const rec = all[id];
    html += `<tr>
      <td>${escapeHtml(it.title)}<br/><a href="${escapeHtml(it.source || "#")}" target="_blank" rel="noopener">source</a></td>
      <td><select data-track-status="${id}">${opts.map((o) => `<option value="${o}" ${rec.status === o ? "selected" : ""}>${escapeHtml(vt(o))}</option>`).join("")}</select></td>
      <td>${escapeHtml(it.deadline || "not stated")}${typeof deadlineSoon === "function" && deadlineSoon(it) ? " · " + escapeHtml(t("deadlineSoon")) : ""}</td>
      <td><input data-track-note="${id}" value="${escapeHtml(rec.note || "")}" style="width:100%"/></td>
      <td><button class="btn" type="button" data-track-del="${id}">×</button></td>
    </tr>`;
  });
  html += `</tbody></table>`;
  host.innerHTML = html;
  host.querySelectorAll("[data-track-note]").forEach((inp) => {
    inp.addEventListener("change", () => {
      const all2 = loadJSON(V4_TRACK, {});
      const id = inp.getAttribute("data-track-note");
      all2[id] = Object.assign({}, all2[id], { note: inp.value });
      saveJSON(V4_TRACK, all2);
    });
  });
}

function renderSkillGap() {
  const host = document.getElementById("skillgap-box");
  if (!host) return;
  const jobs = [...shortlist].map((id) => itemsAll().find((x) => x.id === id)).filter((i) => i && i.category === "job");
  const have = new Set((profile.skills || []).map((s) => String(s).toLowerCase()));
  const needed = [];
  jobs.forEach((j) => {
    (j.required_skills || []).forEach((r) => {
      needed.push({ job: j, skill: r.skill, quote: r.quote, have: [...have].some((h) => String(r.skill).toLowerCase().includes(h) || h.includes(String(r.skill).toLowerCase())) });
    });
  });
  const gaps = needed.filter((n) => !n.have);
  if (!jobs.length || !needed.length) { host.innerHTML = `<p class="lede">${escapeHtml(vt("gapNone"))}</p>`; return; }
  let html = `<ul>`;
  needed.forEach((n) => {
    html += `<li>${escapeHtml(n.skill)} — ${escapeHtml(n.job.title)} ${n.have ? "✓" : "△"}
      ${n.quote ? `<blockquote>“${escapeHtml(n.quote)}”</blockquote>` : ""}</li>`;
  });
  html += `</ul>`;
  if (gaps.length) {
    html += `<h3>${escapeHtml(profile.lang === "en" ? "Training in this dataset that may help" : "資料集中可能補上缺口的訓練")}</h3><ul>`;
    const training = itemsAll().filter((i) => i.category === "training" && i.status === "active");
    gaps.forEach((g) => {
      const key = String(g.skill).toLowerCase();
      const matches = training.filter((tr) => (tr.skill || "").toLowerCase().includes(key) || (tr.title || "").toLowerCase().includes(key) || (tr.required_skills || []).some((r) => String(r.skill).toLowerCase().includes(key)));
      html += `<li>${escapeHtml(g.skill)}: ${matches.length ? matches.slice(0, 5).map((m) => `<a href="${escapeHtml(m.source)}">${escapeHtml(m.title)}</a>`).join(" · ") : (profile.lang === "en" ? "No matching training item in this dataset." : "本資料集沒有對應的訓練項目。")}</li>`;
    });
    html += `</ul>`;
  }
  host.innerHTML = html;
}

function renderCategories() {
  const host = document.getElementById("cat-manager");
  if (!host) return;
  const cats = userCats();
  const tags = {};
  cats.forEach((c) => (c.manual || []).forEach((id) => { (tags[id] || (tags[id] = [])).push(c.id); }));
  const items = itemsAll().filter((i) => i.status === "active");
  let html = "";
  cats.forEach((c, idx) => {
    const name = (c.name && (c.name[profile.lang] || c.name.en || c.name.zh)) || c.id;
    const n = items.filter((i) => matchCat(i, c, tags)).length;
    html += `<div class="card cat-card">
      <strong>${escapeHtml(name)}</strong> <span class="badge badge-new">${escapeHtml(vt("catPreview")).replace("{n}", String(n))}</span>
      <div class="lede" style="font-size:13px">include: ${escapeHtml((c.include || []).join(", ") || "—")} · match: ${escapeHtml(c.match || "OR")}${c.custom ? " · custom: " + escapeHtml(c.custom) : ""}</div>
      <div class="row-actions">
        <button class="btn" type="button" data-cat-edit="${idx}">Edit</button>
        <button class="btn" type="button" data-cat-del="${idx}">Delete</button>
      </div>
    </div>`;
  });
  // conflicts / uncategorised
  const membership = {};
  items.forEach((i) => {
    membership[i.id] = cats.filter((c) => matchCat(i, c, tags)).map((c) => c.id);
  });
  const uncat = items.filter((i) => !(membership[i.id] || []).length);
  const conf = items.filter((i) => (membership[i.id] || []).length > 1);
  html += `<div class="card cat-card"><h3>${escapeHtml(vt("catConflicts"))}</h3>
    <p>${escapeHtml(vt("uncategorised"))}: ${uncat.length} — ${uncat.slice(0, 12).map((i) => escapeHtml(i.title)).join(" · ")}${uncat.length > 12 ? "…" : ""}</p>
    <p>${escapeHtml(vt("conflict"))}: ${conf.length} — ${conf.slice(0, 8).map((i) => escapeHtml(i.title) + " (" + membership[i.id].join(", ") + ")").join(" · ")}</p>
    <button class="btn" type="button" id="btn-corr-export">${escapeHtml(vt("exportCorr"))}</button>
  </div>`;
  host.innerHTML = html;
}

function editCat(idx) {
  const cats = userCats();
  const c = idx == null ? { id: "custom-" + Date.now(), name: { zh: "新分類", en: "New category" }, include: [], exclude: [], fields: ["title", "skill", "organiser", "sectors"], match: "OR", manual: [] } : cats[idx];
  openDrawer("Category", `<form id="cat-edit">
    <label>id<br/><input name="id" value="${escapeHtml(c.id)}" ${idx != null ? "readonly" : ""}/></label>
    <label>Name (ZH)<br/><input name="name_zh" value="${escapeHtml((c.name && c.name.zh) || "")}"/></label>
    <label>Name (EN)<br/><input name="name_en" value="${escapeHtml((c.name && c.name.en) || "")}"/></label>
    <label>Include keywords (comma)<br/><input name="include" value="${escapeHtml((c.include || []).join(", "))}" style="width:100%"/></label>
    <label>Exclude keywords (comma)<br/><input name="exclude" value="${escapeHtml((c.exclude || []).join(", "))}" style="width:100%"/></label>
    <label>Fields<br/><input name="fields" value="${escapeHtml((c.fields || []).join(", "))}"/></label>
    <label>Match <select name="match"><option ${c.match !== "AND" ? "selected" : ""}>OR</option><option ${c.match === "AND" ? "selected" : ""}>AND</option></select></label>
    <label>Manual item ids (comma)<br/><input name="manual" value="${escapeHtml((c.manual || []).join(", "))}" style="width:100%"/></label>
    <div id="cat-live" class="lede" style="margin:8px 0"></div>
    <button class="btn primary" type="submit">Save</button>
  </form>`);
  const form = document.getElementById("cat-edit");
  const preview = () => {
    const draft = readCatForm(form, c);
    const tags = {};
    (draft.manual || []).forEach((id) => { (tags[id] || (tags[id] = [])).push(draft.id); });
    const n2 = itemsAll().filter((i) => i.status === "active" && matchCat(i, draft, tags)).length;
    document.getElementById("cat-live").textContent = vt("catPreview").replace("{n}", String(n2));
  };
  form.addEventListener("input", preview);
  preview();
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const draft = readCatForm(form, c);
    const all = userCats();
    if (idx == null) all.push(draft); else all[idx] = draft;
    saveJSON(V4_CATS, all);
    closeDrawer();
    renderCategories();
  });
}

function readCatForm(form, base) {
  const fd = new FormData(form);
  const split = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);
  return {
    id: fd.get("id") || base.id,
    name: { zh: fd.get("name_zh") || "", en: fd.get("name_en") || "" },
    include: split(fd.get("include")),
    exclude: split(fd.get("exclude")),
    fields: split(fd.get("fields")),
    match: fd.get("match") || "OR",
    manual: split(fd.get("manual")),
    custom: base.custom || undefined
  };
}

function renderChangelog() {
  const host = document.getElementById("changelog-box");
  if (!host) return;
  const log = changelog();
  const block = (title, rows, key) => {
    if (!rows || !rows.length) return "";
    return `<h3>${escapeHtml(title)} (${rows.length})</h3><ul>${rows.map((r) => `<li><strong>${escapeHtml(r.id || "")}</strong> ${escapeHtml(r.title || "")} ${r.reason || r.detail ? "— " + escapeHtml(r.reason || r.detail) : ""}</li>`).join("")}</ul>`;
  };
  const html = block(vt("logAdded"), log.added) + block(vt("logRemoved"), log.removed) + block(vt("logChanged"), log.changed) + block(vt("logExpired"), log.expired);
  host.innerHTML = html || `<p class="lede">${escapeHtml(vt("noLog"))}</p>`;
}

function renderFeeds() {
  const host = document.getElementById("feeds-box");
  if (!host) return;
  const saved = loadJSON(V4_SEARCH, []);
  host.innerHTML = `
    <p>${escapeHtml(vt("feedsLead"))}</p>
    <div class="feed-list">
      <a class="btn" href="feeds/jobs.xml">RSS · jobs</a>
      <a class="btn" href="feeds/events.xml">RSS · events</a>
      <a class="btn" href="feeds/training.xml">RSS · training</a>
      <a class="btn" href="feeds/all.json">JSON · all</a>
    </div>
    <h3>${escapeHtml(vt("savedSearches"))}</h3>
    <button class="btn" type="button" id="btn-save-search">${escapeHtml(vt("saveSearch"))}</button>
    <ul id="saved-search-list">${saved.map((s, i) => `<li><a href="${escapeHtml(s.url)}">${escapeHtml(s.name)}</a> <button class="btn" data-search-del="${i}" type="button">×</button></li>`).join("")}</ul>`;
  const btn = document.getElementById("btn-save-search");
  if (btn && !btn._bound) {
    btn._bound = true;
    btn.addEventListener("click", () => {
      const name = prompt(profile.lang === "en" ? "Name this search" : "為這個搜尋命名") || "Search";
      const all = loadJSON(V4_SEARCH, []);
      all.push({ name, url: location.href });
      saveJSON(V4_SEARCH, all);
      renderFeeds();
    });
  }
}

function renderCompare() {
  const ids = loadJSON(V4_COMPARE, []);
  return ids;
}

function openCompare() {
  const ids = loadJSON(V4_COMPARE, []);
  if (!ids.length) { openDrawer(vt("compareBtn") || "Compare", `<p>${escapeHtml(vt("compareNeed"))}</p>`); return; }
  const cols = ids.slice(0, 3).map((id) => itemsAll().find((x) => x.id === id)).filter(Boolean);
  const fields = ["title", "category", "employment_type", "hours_per_week", "paid", "sectors", "skill", "cost", "deadline", "dates", "format", "organiser", "venue", "status"];
  let html = `<div class="compare-grid">`;
  cols.forEach((it) => {
    html += `<div class="compare-col"><h3>${escapeHtml(it.title)}</h3><p>${badgesFor(it)}</p><ul>`;
    fields.forEach((f) => {
      let v = it[f];
      if (Array.isArray(v)) v = v.join(", ");
      html += `<li><strong>${escapeHtml(f)}</strong>: ${escapeHtml(String(v == null || v === "" ? "not stated" : v))}</li>`;
    });
    const tr = typeof travelOf === "function" ? travelOf(it) : null;
    html += `<li><strong>travel</strong>: ${tr && tr.minutes != null ? escapeHtml(String(tr.minutes) + " min (" + (tr.source || "estimate") + ")") : "not stated / n/a"}</li>`;
    html += `<li><a href="${escapeHtml(it.source)}" target="_blank" rel="noopener">source</a></li></ul></div>`;
  });
  html += `</div>`;
  openDrawer(profile.lang === "en" ? "Compare" : "比較", html);
}

function exportCorrections() {
  const all = loadJSON(V4_CORR, []);
  downloadText("doa-corrections.json", JSON.stringify(all, null, 2), "application/json");
}

function exportTracker() {
  const all = loadJSON(V4_TRACK, {});
  const rows = [["id", "title", "status", "deadline", "note", "source"]];
  Object.keys(all).forEach((id) => {
    const it = itemsAll().find((x) => x.id === id) || {};
    const r = all[id];
    rows.push([id, it.title || "", r.status || "", it.deadline || "", r.note || "", it.source || ""]);
  });
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  downloadText("doa-application-tracker.csv", csv, "text/csv");
}

function hookPassesFilters() {
  if (window._v4PassHooked) return;
  window._v4PassHooked = true;
  if (typeof passesFilters !== "function") return;
  const orig = passesFilters;
  window.passesFilters = function (item) {
    return orig(item) && v4Passes(item);
  };
}

function bindStatic() {
  if (window._v4Static) return;
  window._v4Static = true;
  bindV4Clicks();
  const bNew = document.getElementById("btn-cat-new");
  if (bNew) bNew.addEventListener("click", () => editCat(null));
  const bEx = document.getElementById("btn-cat-export");
  if (bEx) bEx.addEventListener("click", () => downloadText("doa-categories.json", JSON.stringify(userCats(), null, 2), "application/json"));
  const bIm = document.getElementById("cat-import");
  if (bIm) bIm.addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { const j = JSON.parse(reader.result); if (Array.isArray(j)) { saveJSON(V4_CATS, j); renderCategories(); } } catch (err) {}
    };
    reader.readAsText(f);
  });
  const cmp = document.getElementById("btn-compare-open");
  if (cmp) cmp.addEventListener("click", openCompare);
  const trc = document.getElementById("btn-track-csv");
  if (trc) trc.addEventListener("click", exportTracker);
  document.body.addEventListener("click", (ev) => {
    const ed = ev.target.closest("[data-cat-edit]");
    if (ed) editCat(Number(ed.getAttribute("data-cat-edit")));
    const del = ev.target.closest("[data-cat-del]");
    if (del) {
      const all = userCats();
      all.splice(Number(del.getAttribute("data-cat-del")), 1);
      saveJSON(V4_CATS, all);
      renderCategories();
    }
    if (ev.target.id === "btn-corr-export") exportCorrections();
    const sd = ev.target.closest("[data-search-del]");
    if (sd) {
      const all = loadJSON(V4_SEARCH, []);
      all.splice(Number(sd.getAttribute("data-search-del")), 1);
      saveJSON(V4_SEARCH, all);
      renderFeeds();
    }
  });
}

window.v4Passes = v4Passes;

window.DOA_V4 = {
  render() {
    hookPassesFilters();
    bindStatic();
    renderBanner();
    renderV4Filters();
    decorateCards();
    renderStamp2();
    renderPlanner();
    renderTracker();
    renderSkillGap();
    renderCategories();
    renderChangelog();
    renderFeeds();
  }
};

// Load changelog.json (optional)
fetch("changelog.json").then((r) => r.ok ? r.json() : null).then((j) => {
  if (j) { window.DOA_CHANGELOG = j; if (window.DOA_V4 && DATA) window.DOA_V4.render(); }
}).catch(() => {});

// Share cats via URL param `cats` (base64 json)
try {
  const u = new URL(location.href);
  const raw = u.searchParams.get("cats");
  if (raw) {
    const json = JSON.parse(decodeURIComponent(escape(atob(raw))));
    if (Array.isArray(json)) saveJSON(V4_CATS, json);
  }
} catch (e) {}
