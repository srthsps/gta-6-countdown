(() => {
  "use strict";

  // ---------------------------------------------------------------------------
  // Release data
  // ---------------------------------------------------------------------------
  // GTA VI launches November 19, 2026. Each country unlocks once, at midnight
  // in its *store* time zone (the first city listed). Countries spanning several
  // zones unlock everywhere at that same instant, so e.g. Los Angeles gets it at
  // 9:00 PM on Nov 18. Edit `store` / `cities` here if official times change.
  const RELEASE = { y: 2026, m: 11, d: 19 };

  const COUNTRIES = [
    { code: "nz", name: "New Zealand", region: "apac", cities: [["Auckland", "Pacific/Auckland"]] },
    { code: "au", name: "Australia", region: "apac", cities: [
      ["Sydney / Melbourne", "Australia/Sydney"], ["Brisbane", "Australia/Brisbane"],
      ["Adelaide", "Australia/Adelaide"], ["Darwin", "Australia/Darwin"], ["Perth", "Australia/Perth"]] },
    { code: "jp", name: "Japan", region: "apac", cities: [["Tokyo", "Asia/Tokyo"]] },
    { code: "kr", name: "South Korea", region: "apac", cities: [["Seoul", "Asia/Seoul"]] },
    { code: "tw", name: "Taiwan", region: "apac", cities: [["Taipei", "Asia/Taipei"]] },
    { code: "hk", name: "Hong Kong", region: "apac", cities: [["Hong Kong", "Asia/Hong_Kong"]] },
    { code: "ph", name: "Philippines", region: "apac", cities: [["Manila", "Asia/Manila"]] },
    { code: "sg", name: "Singapore", region: "apac", cities: [["Singapore", "Asia/Singapore"]] },
    { code: "my", name: "Malaysia", region: "apac", cities: [["Kuala Lumpur", "Asia/Kuala_Lumpur"]] },
    { code: "id", name: "Indonesia", region: "apac", cities: [
      ["Jakarta", "Asia/Jakarta"], ["Bali / Makassar", "Asia/Makassar"], ["Jayapura", "Asia/Jayapura"]] },
    { code: "th", name: "Thailand", region: "apac", cities: [["Bangkok", "Asia/Bangkok"]] },
    { code: "in", name: "India", region: "apac", cities: [["New Delhi / Mumbai", "Asia/Kolkata"]] },
    { code: "ae", name: "United Arab Emirates", region: "mea", cities: [["Dubai", "Asia/Dubai"]] },
    { code: "sa", name: "Saudi Arabia", region: "mea", cities: [["Riyadh", "Asia/Riyadh"]] },
    { code: "tr", name: "Türkiye", region: "europe", cities: [["Istanbul", "Europe/Istanbul"]] },
    { code: "za", name: "South Africa", region: "mea", cities: [["Johannesburg", "Africa/Johannesburg"]] },
    { code: "gr", name: "Greece", region: "europe", cities: [["Athens", "Europe/Athens"]] },
    { code: "fi", name: "Finland", region: "europe", cities: [["Helsinki", "Europe/Helsinki"]] },
    { code: "pl", name: "Poland", region: "europe", cities: [["Warsaw", "Europe/Warsaw"]] },
    { code: "se", name: "Sweden", region: "europe", cities: [["Stockholm", "Europe/Stockholm"]] },
    { code: "no", name: "Norway", region: "europe", cities: [["Oslo", "Europe/Oslo"]] },
    { code: "dk", name: "Denmark", region: "europe", cities: [["Copenhagen", "Europe/Copenhagen"]] },
    { code: "de", name: "Germany", region: "europe", cities: [["Berlin", "Europe/Berlin"]] },
    { code: "at", name: "Austria", region: "europe", cities: [["Vienna", "Europe/Vienna"]] },
    { code: "ch", name: "Switzerland", region: "europe", cities: [["Zurich", "Europe/Zurich"]] },
    { code: "it", name: "Italy", region: "europe", cities: [["Rome", "Europe/Rome"]] },
    { code: "fr", name: "France", region: "europe", cities: [["Paris", "Europe/Paris"]] },
    { code: "be", name: "Belgium", region: "europe", cities: [["Brussels", "Europe/Brussels"]] },
    { code: "nl", name: "Netherlands", region: "europe", cities: [["Amsterdam", "Europe/Amsterdam"]] },
    { code: "es", name: "Spain", region: "europe", cities: [["Madrid", "Europe/Madrid"]] },
    { code: "gb", name: "United Kingdom", region: "europe", cities: [["London", "Europe/London"]] },
    { code: "ie", name: "Ireland", region: "europe", cities: [["Dublin", "Europe/Dublin"]] },
    { code: "pt", name: "Portugal", region: "europe", cities: [["Lisbon", "Europe/Lisbon"]] },
    { code: "br", name: "Brazil", region: "americas", cities: [
      ["São Paulo / Brasília", "America/Sao_Paulo"], ["Manaus", "America/Manaus"], ["Rio Branco", "America/Rio_Branco"]] },
    { code: "ar", name: "Argentina", region: "americas", cities: [["Buenos Aires", "America/Argentina/Buenos_Aires"]] },
    { code: "cl", name: "Chile", region: "americas", cities: [["Santiago", "America/Santiago"]] },
    { code: "bo", name: "Bolivia", region: "americas", cities: [["La Paz", "America/La_Paz"]] },
    { code: "us", name: "United States", region: "americas", cities: [
      ["New York / Miami", "America/New_York"], ["Chicago / Dallas", "America/Chicago"],
      ["Denver", "America/Denver"], ["Phoenix", "America/Phoenix"],
      ["Los Angeles / Seattle", "America/Los_Angeles"], ["Anchorage", "America/Anchorage"],
      ["Honolulu", "Pacific/Honolulu"]] },
    { code: "ca", name: "Canada", region: "americas", cities: [
      ["Toronto / Montréal", "America/Toronto"], ["St. John's", "America/St_Johns"], ["Halifax", "America/Halifax"],
      ["Winnipeg", "America/Winnipeg"], ["Edmonton / Calgary", "America/Edmonton"], ["Vancouver", "America/Vancouver"]] },
    { code: "co", name: "Colombia", region: "americas", cities: [["Bogotá", "America/Bogota"]] },
    { code: "pe", name: "Peru", region: "americas", cities: [["Lima", "America/Lima"]] },
    { code: "mx", name: "Mexico", region: "americas", cities: [
      ["Mexico City", "America/Mexico_City"], ["Cancún", "America/Cancun"], ["Tijuana", "America/Tijuana"]] },
  ];

  const TZ_ALIASES = {
    "Asia/Calcutta": "Asia/Kolkata", "America/Buenos_Aires": "America/Argentina/Buenos_Aires",
    "Asia/Saigon": "Asia/Ho_Chi_Minh", "Australia/Melbourne": "Australia/Sydney",
    "Australia/Canberra": "Australia/Sydney", "America/Montreal": "America/Toronto",
    "America/Calgary": "America/Edmonton", "Asia/Ujung_Pandang": "Asia/Makassar",
    "US/Eastern": "America/New_York", "US/Central": "America/Chicago", "US/Mountain": "America/Denver",
    "US/Pacific": "America/Los_Angeles", "US/Hawaii": "Pacific/Honolulu", "Europe/Kiev": "Europe/Kyiv",
  };

  // ---------------------------------------------------------------------------
  // Clock: synced to an internet time server so the countdown is exact to the
  // second regardless of how far off the device clock is.
  // ---------------------------------------------------------------------------
  const params = new URLSearchParams(location.search);
  const simulated = params.get("now") ? Date.parse(params.get("now")) : NaN;
  const clock = {
    offset: Number.isFinite(simulated) ? simulated - Date.now() : 0,
    status: Number.isFinite(simulated) ? "sim" : "pending",
    source: "",
    error: 0,
  };
  const now = () => Date.now() + clock.offset;

  const TIME_SOURCES = [
    {
      name: "Akamai time server",
      async read() {
        const r = await fetch("https://time.akamai.com/?iso&ms&_=" + Math.random(), { cache: "no-store" });
        const ms = Date.parse((await r.text()).trim());
        if (!Number.isFinite(ms)) throw new Error("bad time");
        return ms;
      },
    },
    {
      name: "timeapi.io",
      async read() {
        const r = await fetch("https://timeapi.io/api/time/current/zone?timeZone=UTC", { cache: "no-store" });
        const j = await r.json();
        return Date.UTC(j.year, j.month - 1, j.day, j.hour, j.minute, j.seconds, j.milliSeconds);
      },
    },
  ];

  async function sample(source) {
    const t0 = performance.now();
    const server = await source.read();
    const t1 = performance.now();
    const rtt = t1 - t0;
    // Server stamped roughly mid-flight; compare to local clock at that moment.
    const localMid = Date.now() - (performance.now() - t1) - rtt / 2;
    return { offset: server - localMid, rtt };
  }

  async function syncClock() {
    if (clock.status === "sim") return renderSync();
    for (const source of TIME_SOURCES) {
      try {
        const samples = [];
        for (let i = 0; i < 4; i++) {
          try { samples.push(await withTimeout(sample(source), 4000)); } catch (_) { /* try next sample */ }
        }
        if (!samples.length) continue;
        samples.sort((a, b) => a.rtt - b.rtt);
        const best = samples[0];
        clock.offset = best.offset;
        clock.error = best.rtt / 2;
        clock.status = "synced";
        clock.source = source.name;
        renderSync();
        tick();
        return;
      } catch (_) { /* fall through to next source */ }
    }
    if (clock.status !== "synced") clock.status = "device";
    renderSync();
  }

  function withTimeout(p, ms) {
    return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
  }

  // ---------------------------------------------------------------------------
  // Time-zone math
  // ---------------------------------------------------------------------------
  const dtfCache = new Map();
  function dtf(tz, opts) {
    const key = tz + JSON.stringify(opts);
    let f = dtfCache.get(key);
    if (!f) {
      f = new Intl.DateTimeFormat("en-US", { timeZone: tz, ...opts });
      dtfCache.set(key, f);
    }
    return f;
  }

  const PARTS = { hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" };
  function tzOffset(tz, ts) {
    const p = {};
    for (const { type, value } of dtf(tz, PARTS).formatToParts(ts)) p[type] = value;
    const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
    return asUTC - (ts - (((ts % 1000) + 1000) % 1000));
  }

  function midnightIn(tz) {
    const wall = Date.UTC(RELEASE.y, RELEASE.m - 1, RELEASE.d);
    let t = wall - tzOffset(tz, wall);
    t = wall - tzOffset(tz, t); // second pass settles DST edges
    return t;
  }

  function gmtLabel(tz, ts) {
    const mins = Math.round(tzOffset(tz, ts) / 60000);
    const sign = mins < 0 ? "−" : "+";
    const a = Math.abs(mins);
    return `GMT${sign}${Math.floor(a / 60)}${a % 60 ? ":" + String(a % 60).padStart(2, "0") : ""}`;
  }

  // Minutes between the unlock instant and local midnight Nov 19 in `tz`.
  function minutesFromLocalMidnight(tz, t) {
    return Math.round((t - midnightIn(tz)) / 60000);
  }

  function shiftLabel(mins) {
    if (!mins) return "";
    const a = Math.abs(mins);
    const txt = `${Math.floor(a / 60) ? Math.floor(a / 60) + "h" : ""}${a % 60 ? " " + (a % 60) + "m" : ""}`.trim();
    return mins < 0 ? `${txt} early` : `${txt} later`;
  }

  const fmt = {
    clock: (ts, tz) => dtf(tz, { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).format(ts),
    when: (ts, tz) => dtf(tz, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit" }).format(ts),
    short: (ts, tz) => dtf(tz, { weekday: "short", hour: "numeric", minute: "2-digit" }).format(ts),
    day: (ts, tz) => dtf(tz, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(ts),
  };

  function split(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    return {
      total,
      d: Math.floor(total / 86400),
      h: Math.floor((total % 86400) / 3600),
      m: Math.floor((total % 3600) / 60),
      s: total % 60,
    };
  }

  function elapsedLabel(ms) {
    const mins = Math.floor(ms / 60000);
    const d = Math.floor(mins / 1440), h = Math.floor((mins % 1440) / 60), m = mins % 60;
    if (d) return `${d}d ${h}h`;
    if (h) return `${h}h ${m}m`;
    return `${m}m ${Math.floor((ms % 60000) / 1000)}s`;
  }

  // ---------------------------------------------------------------------------
  // Model
  // ---------------------------------------------------------------------------
  const userTzRaw = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const userTz = TZ_ALIASES[userTzRaw] || userTzRaw;

  const countries = COUNTRIES.map((c) => {
    const storeTz = c.cities[0][1];
    const t = midnightIn(storeTz);
    const cities = c.cities.map(([name, tz], i) => ({ name, tz, i, shift: minutesFromLocalMidnight(tz, t) }));
    return {
      ...c, storeTz, t, cities,
      search: (c.name + " " + c.code + " " + c.cities.map((x) => x[0]).join(" ")).toLowerCase(),
    };
  });
  const byCode = Object.fromEntries(countries.map((c) => [c.code, c]));

  let userCity = null;
  for (const c of countries) {
    const hit = c.cities.find((x) => x.tz === userTz);
    if (hit) { userCity = { country: c, city: hit }; break; }
  }

  const tMin = Math.min(...countries.map((c) => c.t));
  const tMax = Math.max(...countries.map((c) => c.t));

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s) => document.querySelector(s);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (_) { /* storage unavailable */ } },
  };

  // ---------------------------------------------------------------------------
  // Digits
  // ---------------------------------------------------------------------------
  function setDigits(el, str, animate, big) {
    if (el.childElementCount !== str.length) {
      el.textContent = "";
      for (let i = 0; i < str.length; i++) {
        const s = document.createElement("span");
        s.className = "dg";
        el.appendChild(s);
      }
    }
    for (let i = 0; i < str.length; i++) {
      const s = el.children[i];
      if (s.textContent === str[i]) continue;
      const first = s.textContent === "";
      s.textContent = str[i];
      if (animate && !first && !reduced) {
        s.animate(
          big
            ? [{ transform: "translateY(-45%) rotateX(75deg)", opacity: 0, filter: "blur(4px)" }, { transform: "none", opacity: 1, filter: "none" }]
            : [{ transform: "translateY(-70%)", opacity: 0 }, { transform: "none", opacity: 1 }],
          { duration: big ? 480 : 320, easing: "cubic-bezier(.2,.8,.2,1)" }
        );
      }
    }
  }
  const pad = (n) => String(n).padStart(2, "0");

  // ---------------------------------------------------------------------------
  // Hero
  // ---------------------------------------------------------------------------
  const heroDigits = { d: $('[data-u="d"]'), h: $('[data-u="h"]'), m: $('[data-u="m"]'), s: $('[data-u="s"]') };
  const zonePick = $("#zonePick");
  let heroTarget = null; // { country, city } or { custom: tz }
  let heroWasLive = null;

  function buildPicker() {
    const auto = document.createElement("option");
    auto.value = "auto";
    auto.textContent = userCity
      ? `My location (${userCity.city.name}, ${userCity.country.name})`
      : `My location (${userTz.replace(/_/g, " ")})`;
    zonePick.appendChild(auto);
    [...countries].sort((a, b) => a.name.localeCompare(b.name)).forEach((c) => {
      const g = document.createElement("optgroup");
      g.label = c.name;
      c.cities.forEach((city) => {
        const o = document.createElement("option");
        o.value = `${c.code}|${city.i}`;
        o.textContent = c.cities.length > 1 ? `${c.name} — ${city.name}` : `${c.name} (${city.name})`;
        g.appendChild(o);
      });
      zonePick.appendChild(g);
    });
    const saved = store.get("vi-zone");
    zonePick.value = saved && [...zonePick.options].some((o) => o.value === saved) ? saved : "auto";
    zonePick.addEventListener("change", () => {
      store.set("vi-zone", zonePick.value);
      applyPick();
      heroWasLive = null;
      tick();
    });
    applyPick();
  }

  function applyPick() {
    const v = zonePick.value;
    if (v === "auto") {
      heroTarget = userCity || { custom: userTz };
    } else {
      const [code, i] = v.split("|");
      heroTarget = { country: byCode[code], city: byCode[code].cities[+i] };
    }
    document.querySelectorAll(".card.mine").forEach((el) => el.classList.remove("mine"));
    if (heroTarget.country) cards.get(heroTarget.country.code)?.el.classList.add("mine");
    renderHeroSub();
  }

  function heroInfo() {
    if (heroTarget.custom) {
      const tz = heroTarget.custom;
      return { t: midnightIn(tz), tz, label: tz.replace(/_/g, " "), custom: true };
    }
    const { country, city } = heroTarget;
    return { t: country.t, tz: city.tz, label: `${city.name}, ${country.name}`, country, city };
  }

  function renderHeroSub() {
    const info = heroInfo();
    const parts = [];
    parts.push(`Unlocks <strong>${fmt.when(info.t, info.tz)}</strong> in ${esc(info.label)}`);
    if (info.city && info.city.shift < 0) {
      parts.push(`<span class="pill early">${shiftLabel(info.city.shift)}: ${esc(info.country.name)} unlocks on ${esc(info.country.cities[0].name)} time</span>`);
    } else if (info.city && info.city.shift > 0) {
      parts.push(`<span class="pill late">${shiftLabel(info.city.shift)} than local midnight</span>`);
    }
    if (info.tz !== userTz) parts.push(`Your clock: <strong>${fmt.when(info.t, userTz)}</strong>`);
    parts.push(`<span class="utc">${new Date(info.t).toISOString().replace("T", " ").replace(".000Z", " UTC")}</span>`);
    if (info.custom) parts.push(`<em>Your time zone isn't in our list, so we're assuming local midnight.</em>`);
    $("#heroSub").innerHTML = parts.join("<br>");
  }

  function renderHero(n) {
    const info = heroInfo();
    const left = info.t - n;
    const live = left <= 0;
    $("#heroCd").hidden = live;
    $("#heroLive").hidden = !live;
    if (!live) {
      const p = split(left);
      setDigits(heroDigits.d, pad(p.d), true, true);
      setDigits(heroDigits.h, pad(p.h), true, true);
      setDigits(heroDigits.m, pad(p.m), true, true);
      setDigits(heroDigits.s, pad(p.s), true, true);
      document.title = `${p.d}d ${pad(p.h)}:${pad(p.m)}:${pad(p.s)} · GTA VI Countdown`;
    } else {
      document.title = "GTA VI is OUT NOW";
    }
    if (live && heroWasLive === false) confetti(260);
    if (live && heroWasLive === null) setTimeout(() => confetti(160), 600);
    heroWasLive = live;
  }

  // ---------------------------------------------------------------------------
  // Cards
  // ---------------------------------------------------------------------------
  const grid = $("#grid");
  const cards = new Map();

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function buildCards() {
    countries.forEach((c) => {
      const el = document.createElement("article");
      el.className = "card";
      el.id = "c-" + c.code;
      el.dataset.region = c.region;
      const cityRows = c.cities.length > 1
        ? `<ul class="cities">${c.cities.map((x) => `
            <li><span>${esc(x.name)}</span><b>${fmt.day(c.t, x.tz)}</b>${x.shift ? `<em class="${x.shift < 0 ? "early" : "late"}">${shiftLabel(x.shift)}</em>` : `<em class="store">Store clock</em>`}</li>`).join("")}
          </ul>`
        : "";
      el.innerHTML = `
        <div class="card-head">
          <img class="flag" src="https://flagcdn.com/w80/${c.code}.png" alt="" width="40" height="28" loading="lazy" decoding="async">
          <div class="card-title">
            <h3>${esc(c.name)}</h3>
            <p>${esc(c.cities[0].name)} · ${gmtLabel(c.storeTz, c.t)}</p>
          </div>
          <span class="badge">Soon</span>
        </div>
        <div class="cd">
          <div><span class="digits" data-u="d"></span><span>Days</span></div>
          <div><span class="digits" data-u="h"></span><span>Hrs</span></div>
          <div><span class="digits" data-u="m"></span><span>Min</span></div>
          <div><span class="digits" data-u="s"></span><span>Sec</span></div>
        </div>
        <div class="live-msg"><b>Out now</b><small></small></div>
        <div class="bar"><i></i></div>
        <div class="card-foot">
          <span>Local now <b class="clock"></b></span>
          <span>Your time <b>${fmt.short(c.t, userTz)}</b></span>
        </div>
        ${cityRows}`;
      el.querySelector(".flag").addEventListener("error", (e) => { e.target.style.visibility = "hidden"; }, { once: true });
      const ref = {
        el, c, visible: false, state: "",
        d: el.querySelector('[data-u="d"]'), h: el.querySelector('[data-u="h"]'),
        m: el.querySelector('[data-u="m"]'), s: el.querySelector('[data-u="s"]'),
        clock: el.querySelector(".clock"), bar: el.querySelector(".bar i"),
        badge: el.querySelector(".badge"), liveMsg: el.querySelector(".live-msg small"),
      };
      cards.set(c.code, ref);
      bindTilt(el);
    });
  }

  const WEEK = 7 * 86400000;
  function renderCard(ref, n) {
    const left = ref.c.t - n;
    const state = left <= 0 ? "live" : left <= 3600000 ? "soon" : "upcoming";
    if (state !== ref.state) {
      ref.el.classList.toggle("live", state === "live");
      ref.el.classList.toggle("soon", state === "soon");
      ref.badge.textContent = state === "live" ? "Out now" : state === "soon" ? "< 1 hour" : "Upcoming";
      if (ref.state && state === "live" && ref.visible) burstAt(ref.el);
      ref.state = state;
    }
    if (!ref.visible && ref.d.childElementCount) return; // offscreen: skip work
    ref.clock.textContent = fmt.clock(n, ref.c.storeTz);
    if (state === "live") {
      ref.liveMsg.textContent = `Unlocked ${elapsedLabel(-left)} ago`;
      ref.bar.style.width = "100%";
      return;
    }
    const p = split(left);
    setDigits(ref.d, pad(p.d), ref.visible);
    setDigits(ref.h, pad(p.h), ref.visible);
    setDigits(ref.m, pad(p.m), ref.visible);
    setDigits(ref.s, pad(p.s), ref.visible);
    ref.bar.style.width = `${Math.max(0, Math.min(100, (1 - left / WEEK) * 100)).toFixed(3)}%`;
  }

  // Filtering & sorting
  const filters = { q: "", region: store.get("vi-region") || "all", status: "all", sort: "launch" };

  function applyFilters() {
    const n = now();
    const list = [...cards.values()].sort((a, b) =>
      filters.sort === "name" ? a.c.name.localeCompare(b.c.name) : a.c.t - b.c.t || a.c.name.localeCompare(b.c.name));
    let shown = 0;
    list.forEach((ref) => {
      const live = ref.c.t <= n;
      const ok = (!filters.q || ref.c.search.includes(filters.q))
        && (filters.region === "all" || ref.c.region === filters.region)
        && (filters.status === "all" || (filters.status === "live") === live);
      ref.el.hidden = !ok;
      if (ok) ref.el.style.setProperty("--i", shown++ % 12);
      grid.appendChild(ref.el);
    });
    $("#empty").hidden = shown > 0;
  }

  function bindControls() {
    $("#search").addEventListener("input", (e) => { filters.q = e.target.value.trim().toLowerCase(); applyFilters(); });
    $("#sort").addEventListener("change", (e) => { filters.sort = e.target.value; applyFilters(); });
    const chipGroup = (sel, key, persist) => {
      const box = $(sel);
      const sync = () => box.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset[key] === filters[key]));
      box.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        filters[key] = b.dataset[key];
        if (persist) store.set(persist, filters[key]);
        sync();
        applyFilters();
      });
      sync();
    };
    chipGroup("#regionChips", "region", "vi-region");
    chipGroup("#statusChips", "status");
    $("#heroLive").addEventListener("click", () => confetti(220));
  }

  // ---------------------------------------------------------------------------
  // Timeline
  // ---------------------------------------------------------------------------
  const tlGroups = [];
  function buildTimeline() {
    const groups = new Map();
    countries.forEach((c) => {
      if (!groups.has(c.t)) groups.set(c.t, []);
      groups.get(c.t).push(c);
    });
    const box = $("#tlDots");
    [...groups.entries()].sort((a, b) => a[0] - b[0]).forEach(([t, list]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tl-dot";
      b.style.left = `${((t - tMin) / (tMax - tMin)) * 100}%`;
      b.dataset.label = `${list.map((c) => c.name).join(", ")}\n${fmt.when(t, userTz)} your time`;
      b.setAttribute("aria-label", b.dataset.label.replace("\n", ", "));
      b.addEventListener("click", () => focusCard(list[0].code));
      box.appendChild(b);
      tlGroups.push({ t, list, el: b });
    });
    $("#tlStart").textContent = `First: ${countries.find((c) => c.t === tMin).name} · ${fmt.when(tMin, userTz)}`;
    $("#tlEnd").textContent = `Last: ${countries.find((c) => c.t === tMax).name} · ${fmt.when(tMax, userTz)}`;
  }

  function focusCard(code) {
    const ref = cards.get(code);
    if (ref.el.hidden) {
      filters.q = ""; filters.region = "all"; filters.status = "all";
      $("#search").value = "";
      document.querySelectorAll("#regionChips button, #statusChips button").forEach((b) => b.classList.toggle("on", (b.dataset.region || b.dataset.status) === "all"));
      applyFilters();
    }
    ref.el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    ref.el.classList.remove("flash");
    void ref.el.offsetWidth;
    ref.el.classList.add("flash");
  }

  function renderTimeline(n) {
    const frac = (n - tMin) / (tMax - tMin);
    const pct = Math.max(0, Math.min(1, frac)) * 100;
    $("#tlFill").style.width = pct + "%";
    const nowEl = $("#tlNow");
    nowEl.style.left = pct + "%";
    nowEl.querySelector("span").textContent = frac < 0 ? "Now ◂" : frac > 1 ? "▸ Now" : "Now";
    let live = 0;
    tlGroups.forEach((g) => { const on = g.t <= n; g.el.classList.toggle("live", on); if (on) live += g.list.length; });
    const sum = $("#tlSummary");
    if (live === 0) {
      const p = split(tMin - n);
      sum.textContent = `The rollout starts in ${p.d}d ${pad(p.h)}:${pad(p.m)}:${pad(p.s)} with New Zealand, then follows midnight west across ${countries.length} countries over ${Math.round((tMax - tMin) / 3600000)} hours.`;
    } else if (live === countries.length) {
      sum.textContent = `Every one of the ${countries.length} countries is live. Welcome to Leonida.`;
    } else {
      sum.textContent = `${live} of ${countries.length} countries are live, and midnight keeps moving west.`;
    }

    const next = countries.filter((c) => c.t > n).sort((a, b) => a.t - b.t)[0];
    const nu = $("#nextUp");
    if (next) {
      const p = split(next.t - n);
      const html = `<span class="dot"></span>Next unlock: <img src="https://flagcdn.com/w40/${next.code}.png" alt=""> <strong>${esc(next.name)}</strong> in <span class="mono">${p.d ? p.d + "d " : ""}${pad(p.h)}:${pad(p.m)}:${pad(p.s)}</span>`;
      if (nu.dataset.code !== next.code) { nu.innerHTML = html; nu.dataset.code = next.code; }
      else nu.querySelector(".mono").textContent = `${p.d ? p.d + "d " : ""}${pad(p.h)}:${pad(p.m)}:${pad(p.s)}`;
    } else {
      nu.innerHTML = `<span class="dot"></span>GTA VI is live worldwide`;
      nu.dataset.code = "";
    }
  }

  // ---------------------------------------------------------------------------
  // Clock sync status
  // ---------------------------------------------------------------------------
  function renderSync() {
    const el = $("#syncStatus");
    el.className = "sync " + clock.status;
    if (clock.status === "sim") {
      el.textContent = `Simulated time (?now=${params.get("now")})`;
    } else if (clock.status === "pending") {
      el.textContent = "Syncing with atomic time…";
    } else if (clock.status === "device") {
      el.textContent = "Couldn't reach a time server, so this uses your device clock";
    } else {
      const off = clock.offset / 1000;
      const drift = Math.abs(off) < 0.05 ? "your device clock is spot on"
        : `your device clock is ${Math.abs(off).toFixed(2)}s ${off > 0 ? "slow" : "fast"} (corrected)`;
      el.textContent = `Synced to ${clock.source} ±${Math.max(1, Math.round(clock.error))}ms · ${drift}`;
    }
  }

  // ---------------------------------------------------------------------------
  // Tick loop — fires right after each true second boundary
  // ---------------------------------------------------------------------------
  let timer = 0;
  function tick() {
    const n = now();
    renderHero(n);
    cards.forEach((ref) => renderCard(ref, n));
    renderTimeline(n);
    if (filters.status !== "all") {
      const wantLive = filters.status === "live";
      if ([...cards.values()].some((r) => !r.el.hidden && (r.c.t <= n) !== wantLive)) applyFilters();
    }
  }
  function schedule() {
    clearTimeout(timer);
    const n = now();
    timer = setTimeout(() => { tick(); schedule(); }, 1000 - (((n % 1000) + 1000) % 1000) + 4);
  }

  // ---------------------------------------------------------------------------
  // Motion: reveal, tilt, scroll parallax, dust, confetti
  // ---------------------------------------------------------------------------
  function bindReveal() {
    document.querySelectorAll(".reveal").forEach((el, i) => el.style.setProperty("--d", i));
    requestAnimationFrame(() => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in")));

    const io = new IntersectionObserver((entries) => {
      const n = now();
      entries.forEach((e) => {
        const ref = cards.get(e.target.id.slice(2));
        ref.visible = e.isIntersecting;
        if (e.isIntersecting) { e.target.classList.add("in"); renderCard(ref, n); }
      });
    }, { rootMargin: "80px 0px" });
    cards.forEach((ref) => io.observe(ref.el));
  }

  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  function bindTilt(el) {
    if (!canHover || reduced) return;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
      el.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  }

  function bindScroll() {
    let pending = false;
    addEventListener("scroll", () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--scroll", Math.min(scrollY, 1200));
        pending = false;
      });
    }, { passive: true });
  }

  function fitCanvas(cv) {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    const ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  function startDust() {
    if (reduced) return;
    const cv = $("#dust");
    let ctx = fitCanvas(cv);
    const colors = ["255,79,163", "5,217,232", "255,209,102", "255,255,255"];
    const count = innerWidth < 640 ? 34 : 70;
    const ps = Array.from({ length: count }, () => spawn(true));
    function spawn(anywhere) {
      return {
        x: Math.random() * innerWidth,
        y: anywhere ? Math.random() * innerHeight : innerHeight + 10,
        r: Math.random() * 1.8 + 0.4,
        vy: Math.random() * 0.35 + 0.1,
        vx: (Math.random() - 0.5) * 0.15,
        c: colors[(Math.random() * colors.length) | 0],
        p: Math.random() * Math.PI * 2,
      };
    }
    addEventListener("resize", () => { ctx = fitCanvas(cv); });
    (function frame() {
      if (!document.hidden) {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < ps.length; i++) {
          const p = ps[i];
          p.y -= p.vy; p.x += p.vx; p.p += 0.03;
          if (p.y < -10) ps[i] = spawn(false);
          const a = 0.35 + Math.sin(p.p) * 0.3;
          ctx.beginPath();
          ctx.fillStyle = `rgba(${p.c},${a})`;
          ctx.shadowColor = `rgba(${p.c},0.9)`;
          ctx.shadowBlur = 8;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(frame);
    })();
  }

  const confettiCv = $("#confetti");
  let confettiCtx = null;
  const bits = [];
  let confettiRunning = false;
  function confetti(n, ox, oy) {
    if (reduced) return;
    if (!confettiCtx) {
      confettiCtx = fitCanvas(confettiCv);
      addEventListener("resize", () => { confettiCtx = fitCanvas(confettiCv); });
    }
    const colors = ["#ff2a6d", "#ff9a3c", "#ffd166", "#05d9e8", "#3dffa2", "#b06bff"];
    for (let i = 0; i < n; i++) {
      const fromPoint = ox !== undefined;
      bits.push({
        x: fromPoint ? ox : Math.random() * innerWidth,
        y: fromPoint ? oy : -20 - Math.random() * innerHeight * 0.3,
        vx: fromPoint ? (Math.random() - 0.5) * 10 : (Math.random() - 0.5) * 3,
        vy: fromPoint ? -Math.random() * 9 - 2 : Math.random() * 3 + 2,
        w: Math.random() * 8 + 4, h: Math.random() * 5 + 3,
        rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
        c: colors[(Math.random() * colors.length) | 0], life: 0,
      });
    }
    if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(drawConfetti); }
  }
  function drawConfetti() {
    const ctx = confettiCtx;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = bits.length - 1; i >= 0; i--) {
      const b = bits[i];
      b.vy += 0.18; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.rot += b.vr; b.life++;
      if (b.y > innerHeight + 30 || b.life > 600) { bits.splice(i, 1); continue; }
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.fillStyle = b.c;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h * Math.cos(b.life * 0.1));
      ctx.restore();
    }
    if (bits.length) requestAnimationFrame(drawConfetti);
    else { confettiRunning = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  function burstAt(el) {
    const r = el.getBoundingClientRect();
    confetti(60, r.left + r.width / 2, r.top + r.height / 3);
  }

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------
  buildCards();
  buildPicker();
  buildTimeline();
  bindControls();
  applyFilters();
  renderSync();
  tick();
  schedule();
  bindReveal();
  bindScroll();
  startDust();
  syncClock().then(schedule);

  setInterval(() => syncClock().then(schedule), 10 * 60 * 1000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) { tick(); schedule(); }
  });
})();
