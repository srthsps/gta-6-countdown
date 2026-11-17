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

  // Minutes between the unlock instant and local midnight Nov 19 in `tz`.
  function minutesFromLocalMidnight(tz, t) {
    return Math.round((t - midnightIn(tz)) / 60000);
  }

  // "3h early" / "1h 30m later", or compact "−3h" / "+1h30m".
  function shiftLabel(mins, compact) {
    if (!mins) return "";
    const a = Math.abs(mins);
    const h = Math.floor(a / 60), m = a % 60;
    if (compact) return `${mins < 0 ? "−" : "+"}${h ? h + "h" : ""}${m ? m + "m" : ""}`;
    const txt = `${h ? h + "h" : ""}${m ? " " + m + "m" : ""}`.trim();
    return mins < 0 ? `${txt} early` : `${txt} later`;
  }

  const fmt = {
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
  }).sort((a, b) => a.t - b.t || a.name.localeCompare(b.name));
  const byCode = Object.fromEntries(countries.map((c) => [c.code, c]));

  let userCity = null;
  for (const c of countries) {
    const hit = c.cities.find((x) => x.tz === userTz);
    if (hit) { userCity = { country: c, city: hit }; break; }
  }

  const tMin = countries[0].t;
  const tMax = countries[countries.length - 1].t;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s) => document.querySelector(s);
  const pad = (n) => String(n).padStart(2, "0");
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (_) { /* storage unavailable */ } },
  };
  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ESC[c]);

  // ---------------------------------------------------------------------------
  // Hero
  // ---------------------------------------------------------------------------
  const heroDigits = { d: $('[data-u="d"]'), h: $('[data-u="h"]'), m: $('[data-u="m"]'), s: $('[data-u="s"]') };
  const zonePick = $("#zonePick");
  let heroTarget = null; // { country, city } or { custom: tz }
  let heroWasLive = null;

  // Only the changed digits get a short transform/opacity roll.
  function setDigits(el, str, animate) {
    if (el.childElementCount !== str.length) {
      el.textContent = "";
      for (let i = 0; i < str.length; i++) el.appendChild(document.createElement("span")).className = "dg";
    }
    for (let i = 0; i < str.length; i++) {
      const s = el.children[i];
      if (s.textContent === str[i]) continue;
      const first = s.textContent === "";
      s.textContent = str[i];
      if (animate && !first && !reduced) {
        s.animate([{ transform: "translateY(-30%)", opacity: 0 }, { transform: "none", opacity: 1 }],
          { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" });
      }
    }
  }

  function buildPicker() {
    const auto = document.createElement("option");
    auto.value = "auto";
    auto.textContent = "📍 " + (userCity ? userCity.city.name : userTz.split("/").pop().replace(/_/g, " "));
    zonePick.appendChild(auto);
    [...countries].sort((a, b) => a.name.localeCompare(b.name)).forEach((c) => {
      const g = document.createElement("optgroup");
      g.label = c.name;
      c.cities.forEach((city) => {
        const o = document.createElement("option");
        o.value = `${c.code}|${city.i}`;
        o.textContent = c.cities.length > 1 ? `${c.name} · ${city.name}` : c.name;
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
    if (heroTarget.country) cards.get(heroTarget.country.code).el.classList.add("mine");

    // The one extra line worth showing: this city unlocks before local midnight.
    const early = $("#heroEarly");
    const shift = heroTarget.city ? heroTarget.city.shift : 0;
    early.hidden = shift >= 0;
    if (shift < 0) early.textContent = `Unlocks ${fmt.day(heroTarget.country.t, heroTarget.city.tz)} · ${shiftLabel(shift)}`;
  }

  function heroTime() {
    return heroTarget.custom ? midnightIn(heroTarget.custom) : heroTarget.country.t;
  }

  function renderHero(n) {
    const left = heroTime() - n;
    const live = left <= 0;
    $("#heroCd").hidden = live;
    $("#heroLive").hidden = !live;
    if (!live) {
      const p = split(left);
      setDigits(heroDigits.d, pad(p.d), true);
      setDigits(heroDigits.h, pad(p.h), true);
      setDigits(heroDigits.m, pad(p.m), true);
      setDigits(heroDigits.s, pad(p.s), true);
      document.title = `${p.d}d ${pad(p.h)}:${pad(p.m)}:${pad(p.s)} · GTA VI`;
    } else {
      document.title = "GTA VI · Out now";
    }
    if (live && heroWasLive === false) confetti(240);
    if (live && heroWasLive === null) setTimeout(() => confetti(140), 600);
    heroWasLive = live;
  }

  // ---------------------------------------------------------------------------
  // Cards
  // ---------------------------------------------------------------------------
  const grid = $("#grid");
  const cards = new Map();

  function buildCards() {
    countries.forEach((c, idx) => {
      const el = document.createElement("article");
      el.className = "card";
      el.id = "c-" + c.code;
      const zones = c.cities.length > 1
        ? `<details class="zones"><summary>${c.cities.length} time zones</summary><ul>${c.cities.map((x) => `
            <li><span>${esc(x.name)}</span><b>${fmt.day(c.t, x.tz)}</b><em class="${x.shift < 0 ? "early" : x.shift > 0 ? "late" : ""}">${shiftLabel(x.shift, true)}</em></li>`).join("")}
          </ul></details>`
        : "";
      el.innerHTML = `
        <div class="card-head">
          <img class="flag" src="https://flagcdn.com/w80/${c.code}.png" alt="" width="32" height="22" loading="lazy" decoding="async">
          <h3>${esc(c.name)}</h3>
        </div>
        <div class="left"></div>
        <div class="bar"><i></i></div>
        ${zones}`;
      el.title = `${fmt.when(c.t, userTz)} your time`;
      el.querySelector(".flag").addEventListener("error", (e) => { e.target.style.visibility = "hidden"; }, { once: true });
      el.style.transitionDelay = `${(idx % 8) * 30}ms`;
      grid.appendChild(el);
      cards.set(c.code, {
        el, c, visible: false, state: "", text: "",
        left: el.querySelector(".left"), bar: el.querySelector(".bar i"),
      });
    });
  }

  const WEEK = 7 * 86400000;
  function renderCard(ref, n) {
    const left = ref.c.t - n;
    const state = left <= 0 ? "live" : left <= 3600000 ? "soon" : "upcoming";
    if (state !== ref.state) {
      ref.el.classList.toggle("live", state === "live");
      ref.el.classList.toggle("soon", state === "soon");
      if (ref.state && state === "live" && ref.visible) burstAt(ref.el);
      ref.state = state;
      ref.text = "";
    }
    if (!ref.visible && ref.text) return; // offscreen: skip work
    let html;
    if (state === "live") {
      html = "Out now";
      ref.bar.style.transform = "none";
    } else {
      const p = split(left);
      html = `${p.d ? `${p.d}<small>d</small>` : ""}${pad(p.h)}:${pad(p.m)}:${pad(p.s)}`;
      ref.bar.style.transform = `scaleX(${Math.max(0, Math.min(1, 1 - left / WEEK)).toFixed(4)})`;
    }
    if (html !== ref.text) { ref.left.innerHTML = html; ref.text = html; }
  }

  let filterQ = "";
  let filterRegion = store.get("vi-region") || "all";

  function applyFilters() {
    cards.forEach((ref) => {
      ref.el.hidden = !((!filterQ || ref.c.search.includes(filterQ))
        && (filterRegion === "all" || ref.c.region === filterRegion));
    });
  }

  function syncChips() {
    $("#regionChips").querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.region === filterRegion));
  }

  function bindControls() {
    $("#search").addEventListener("input", (e) => { filterQ = e.target.value.trim().toLowerCase(); applyFilters(); });
    $("#regionChips").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      filterRegion = b.dataset.region;
      store.set("vi-region", filterRegion);
      syncChips();
      applyFilters();
    });
    syncChips();
    $("#heroLive").addEventListener("click", () => confetti(200));
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
    groups.forEach((list, t) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tl-dot";
      b.style.left = `${((t - tMin) / (tMax - tMin)) * 100}%`;
      b.dataset.label = `${list.map((c) => c.name).join(", ")}\n${fmt.short(t, userTz)}`;
      b.setAttribute("aria-label", b.dataset.label.replace("\n", ", "));
      b.addEventListener("click", () => focusCard(list[0].code));
      box.appendChild(b);
      tlGroups.push({ t, el: b });
    });
  }

  function focusCard(code) {
    const ref = cards.get(code);
    if (ref.el.hidden) {
      filterQ = "";
      filterRegion = "all";
      $("#search").value = "";
      syncChips();
      applyFilters();
    }
    ref.el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    ref.el.classList.remove("flash");
    void ref.el.offsetWidth;
    ref.el.classList.add("flash");
  }

  const tlFill = $("#tlFill");
  const tlNow = $("#tlNow");
  function renderTimeline(n) {
    const frac = Math.max(0, Math.min(1, (n - tMin) / (tMax - tMin)));
    tlFill.style.transform = `scaleX(${frac.toFixed(5)})`;
    tlNow.style.left = `${frac * 100}%`;
    tlGroups.forEach((g) => g.el.classList.toggle("live", g.t <= n));
  }

  // ---------------------------------------------------------------------------
  // Clock sync indicator (details live in the tooltip)
  // ---------------------------------------------------------------------------
  function renderSync() {
    const el = $("#syncDot");
    el.className = "sync " + clock.status;
    let label;
    if (clock.status === "sim") label = `Simulated time (${params.get("now")})`;
    else if (clock.status === "pending") label = "Syncing clock…";
    else if (clock.status === "device") label = "Using device clock";
    else {
      const off = clock.offset / 1000;
      label = `Synced to ${clock.source} (±${Math.max(1, Math.round(clock.error))}ms)` +
        (Math.abs(off) >= 0.05 ? ` · device clock ${Math.abs(off).toFixed(2)}s ${off > 0 ? "slow" : "fast"}, corrected` : "");
    }
    el.title = label;
    el.setAttribute("aria-label", label);
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
  }
  function schedule() {
    clearTimeout(timer);
    if (document.hidden) return;
    const n = now();
    timer = setTimeout(() => { tick(); schedule(); }, 1000 - (((n % 1000) + 1000) % 1000) + 4);
  }

  // ---------------------------------------------------------------------------
  // Reveal & confetti
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
    }, { rootMargin: "100px 0px" });
    cards.forEach((ref) => io.observe(ref.el));
  }

  const confettiCv = $("#confetti");
  let confettiCtx = null;
  const bits = [];
  let confettiRunning = false;
  function fitCanvas(cv) {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    const ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }
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
    confetti(50, r.left + r.width / 2, r.top + r.height / 3);
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
  syncClock().then(schedule);

  // ---------------------------------------------------------------------------
  // PWA: offline support + install button (shown only when the browser offers it)
  // ---------------------------------------------------------------------------
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => { /* offline support is optional */ });
  }
  let installPrompt = null;
  const installBtn = $("#installBtn");
  addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installPrompt = e;
    installBtn.hidden = false;
  });
  installBtn.addEventListener("click", async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installBtn.hidden = true;
  });
  addEventListener("appinstalled", () => { installBtn.hidden = true; });

  setInterval(() => syncClock().then(schedule), 10 * 60 * 1000);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearTimeout(timer);
    else { tick(); schedule(); }
  });
})();
