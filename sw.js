// Bump VERSION whenever the app shell changes so old caches are dropped.
const VERSION = "v2";
const SHELL = `shell-${VERSION}`;
const ASSETS = "assets-v1";

const SHELL_FILES = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
];

// Third-party files that never change for a given URL: fonts and flags.
const ASSET_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com", "flagcdn.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== ASSETS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // App shell: network first so updates show up immediately, cache when offline.
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(SHELL).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match("index.html")))
    );
    return;
  }

  // Fonts & flags: cache first. Time-sync requests fall through untouched.
  if (ASSET_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.open(ASSETS).then((c) =>
        c.match(req).then((hit) => hit || fetch(req).then((res) => {
          if (res.ok || res.type === "opaque") c.put(req, res.clone());
          return res;
        }))
      )
    );
  }
});
