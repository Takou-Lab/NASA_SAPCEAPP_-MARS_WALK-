/* Generated only by the production build. No automatic update activation. */
const PACK = /* BUILD_PACK */ null;
const BASE = self.registration.scope;
const PREFIX = `marswalk-pack:${BASE}:`;
const VERSION_PREFIX = `${PREFIX}${PACK.version}:`;
const MARKER = new URL('__offline_complete__', BASE).href;
const urlFor = path => new URL(path, BASE).href;
let preparing = null;

async function checked(response, file) {
  if (!response || !response.ok || response.type === 'opaque') throw new Error(`Missing asset: ${file.path}`);
  const bytes = await response.clone().arrayBuffer();
  if (bytes.byteLength !== file.bytes) throw new Error(`Wrong size: ${file.path}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hex = [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, '0')).join('');
  if (hex !== file.sha256) throw new Error(`Wrong digest: ${file.path}`);
  return response;
}

async function preparedCache() {
  for (const name of await caches.keys()) {
    if (!name.startsWith(VERSION_PREFIX)) continue;
    const cache = await caches.open(name);
    if (await cache.match(MARKER)) return cache;
  }
  return null;
}

async function verify() {
  const cache = await preparedCache();
  if (!cache) return { ready: false, version: PACK.version, totalBytes: PACK.totalBytes };
  try {
    for (const file of PACK.files) await checked(await cache.match(urlFor(file.path)), file);
    return { ready: true, version: PACK.version, totalBytes: PACK.totalBytes };
  } catch (error) {
    return { ready: false, version: PACK.version, totalBytes: PACK.totalBytes, error: error.message };
  }
}

async function prepare(progress) {
  const current = await verify();
  if (current.ready) return current;
  const name = `${VERSION_PREFIX}${crypto.randomUUID()}`;
  try {
    const cache = await caches.open(name);
    let completed = 0;
    for (const file of PACK.files) {
      const response = await fetch(urlFor(file.path), { cache: 'no-store', credentials: 'same-origin', redirect: 'error' });
      await checked(response, file);
      await cache.put(urlFor(file.path), response);
      progress({ completed: ++completed, total: PACK.files.length });
    }
    // Read back every stored byte. A commit marker appears only after all pass.
    for (const file of PACK.files) await checked(await cache.match(urlFor(file.path)), file);
    await cache.put(MARKER, new Response(PACK.version));
    // Retain other versions for safe rollback. Remove same-version failed/stale
    // staging only after committing the replacement; never touch mission storage.
    for (const old of await caches.keys()) if (old.startsWith(VERSION_PREFIX) && old !== name) await caches.delete(old).catch(() => false);
    return { ready: true, version: PACK.version, totalBytes: PACK.totalBytes };
  } catch (error) {
    await caches.delete(name).catch(() => false);
    throw error;
  }
}

self.addEventListener('install', event => {
  // A waiting worker activates naturally once all older tabs close. Therefore
  // updates must already have a complete verified pack before installation can
  // succeed. Failed update installation leaves the previous worker/cache alive.
  // First installation remains opt-in via the Prepare offline action.
  if (self.registration.active) event.waitUntil(prepare(() => {}));
});
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('message', event => {
  const port = event.ports[0];
  if (!port) return;
  const reply = value => port.postMessage(value);
  event.waitUntil((async () => {
    try {
      if (event.data?.type === 'STATUS') reply({ done: true, ...await verify() });
      else if (event.data?.type === 'PREPARE') {
        if (!preparing) preparing = prepare(progress => reply({ progress })).finally(() => { preparing = null; });
        reply({ done: true, ...await preparing });
      } else if (event.data?.type === 'ACTIVATE') {
        const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        if (windows.filter(client => client.url.startsWith(BASE)).length > 1) throw new Error('Save work and close other MARSWALK tabs before applying this update.');
        if (!(await verify()).ready) throw new Error('Prepare and verify this update before applying it.');
        reply({ done: true, ready: true });
        await self.skipWaiting();
      } else throw new Error('Unknown offline operation.');
    } catch (error) { reply({ done: true, ready: false, error: error.message || 'Offline operation failed.' }); }
  })());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== new URL(BASE).origin || !url.href.startsWith(BASE)) return;
  const path = event.request.mode === 'navigate' ? 'index.html' : url.pathname.slice(new URL(BASE).pathname.length);
  const file = PACK.files.find(f => f.path === path);
  if (!file) return; // no external citations, archives or arbitrary runtime cache
  event.respondWith((async () => {
    const cache = await preparedCache();
    if (cache) {
      try { return await checked(await cache.match(urlFor(file.path)), file); }
      catch { /* never serve corrupt cached bytes; readiness check reports it */ }
    }
    return fetch(event.request);
  })());
});
