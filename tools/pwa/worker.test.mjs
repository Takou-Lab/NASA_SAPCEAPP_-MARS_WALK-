import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash, webcrypto } from 'node:crypto';
import vm from 'node:vm';

const source = await readFile(new URL('./worker.js', import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
function harness({ base = 'https://example.test/mars/', version = 'one', storage = new Map(), fail = null, corrupt = null, storedCorrupt = null, offline = false, windows = 1, updating = false } = {}) {
  const bodies = { 'index.html': `<h1>${version}</h1>`, 'main.js': 'script', 'data/manifest.json': '{"imageRef":"test"}', 'data/image.jpg': 'image', 'data/markers.json': '[]' };
  const files = Object.entries(bodies).map(([path, body]) => ({ path, bytes: Buffer.byteLength(body), sha256: digest(body) }));
  const pack = { version, files, totalBytes: files.reduce((s,f) => s+f.bytes,0) };
  const handlers = {};
  let requests = 0, activations = 0;
  const cacheApi = {
    async keys() { return [...storage.keys()]; },
    async delete(name) { return storage.delete(name); },
    async open(name) {
      if (!storage.has(name)) storage.set(name, new Map());
      const map = storage.get(name);
      return {
        async match(url) { return map.get(typeof url === 'string' ? url : url.url)?.clone(); },
        async put(url, response) {
          if (fail && url.endsWith(fail)) throw new Error('QuotaExceededError');
          map.set(url, storedCorrupt && url.endsWith(storedCorrupt) ? new Response('bad') : response.clone());
        },
      };
    },
  };
  const context = vm.createContext({ URL, Response, Uint8Array, crypto: webcrypto, caches: cacheApi,
    fetch: async request => {
      requests++;
      if (offline) throw new Error('Disconnected');
      const url = typeof request === 'string' ? request : request.url;
      const path = url.slice(base.length);
      return new Response(path === corrupt ? 'corrupted' : bodies[path], { status: path in bodies ? 200 : 404 });
    },
    self: { registration: { scope: base, active: updating ? {} : null }, clients: { claim: async () => {}, matchAll: async () => Array.from({length:windows},()=>({url:base})) }, skipWaiting: async () => { activations++; }, addEventListener(type, handler) { handlers[type] = handler; } },
  });
  vm.runInContext(source.replace('/* BUILD_PACK */ null', JSON.stringify(pack)) + '\nglobalThis.api = { verify, prepare };', context);
  return { ...context.api, storage, base, pack, get requests() { return requests; }, get activations() { return activations; },
    async install() { let work;handlers.install({waitUntil(value){work=value;}});await work; },
    async command(type) {
      const replies = []; let work;
      handlers.message({ data: { type }, ports: [{ postMessage(value) { replies.push(value); } }], waitUntil(value) { work = value; } });
      await work;return replies.at(-1);
    },
    async load(path, mode = 'cors') {
      let response;
      handlers.fetch({ request: { url: base + path, method: 'GET', mode }, respondWith(value) { response = value; } });
      return response ? await response : null;
    },
  };
}

test('no ready claim before preparation; success verifies every cached byte and serves navigation offline', async () => {
  const h = harness();assert.equal((await h.verify()).ready,false);
  const progress=[];assert.equal((await h.prepare(p => progress.push(p))).ready,true);
  assert.equal(progress.at(-1).completed,h.pack.files.length);
  const off = harness({ storage:h.storage, offline:true });
  assert.equal((await off.verify()).ready,true);
  assert.equal(await (await off.load('', 'navigate')).text(),'<h1>one</h1>');
  assert.equal(await (await off.load('data/markers.json')).text(),'[]');
  assert.equal(off.requests,0);
  assert.equal(await off.load('data/archival.jpg'),null);
});

test('wrong downloaded bytes fail without committing or overwriting another prepared version', async () => {
  const first=harness();await first.prepare(()=>{});
  const next=harness({ storage:first.storage,version:'two',corrupt:'main.js' });
  await assert.rejects(next.prepare(()=>{}),/Wrong/);
  assert.equal((await next.verify()).ready,false);
  assert.equal((await first.verify()).ready,true);
  assert.equal(first.storage.size,1);
});

test('storage quota failure removes incomplete staging and retains last usable version', async () => {
  const first=harness();await first.prepare(()=>{});
  const next=harness({ storage:first.storage,version:'two',fail:'data/image.jpg' });
  await assert.rejects(next.prepare(()=>{}),/QuotaExceeded/);
  assert.equal((await first.verify()).ready,true);assert.equal(first.storage.size,1);
});

test('missing/corrupt cached bytes revoke readiness and are never served offline', async () => {
  const h=harness();await h.prepare(()=>{});
  const entries=[...h.storage.values()][0];entries.delete(h.base+'main.js');
  assert.equal((await h.verify()).ready,false);
  entries.set(h.base+'main.js',new Response('xxxxxx'));
  assert.equal((await h.verify()).ready,false);
  const off=harness({storage:h.storage,offline:true});
  await assert.rejects(off.load('main.js'),/Disconnected/);
});

test('explicit verified update activation only; previous version stays available', async () => {
  const first=harness();await first.prepare(()=>{});
  const next=harness({storage:first.storage,version:'two'});
  assert.equal((await next.command('ACTIVATE')).ready,false);assert.equal(next.activations,0);
  assert.equal((await next.command('PREPARE')).ready,true);assert.equal(next.activations,0);
  assert.equal((await next.command('ACTIVATE')).ready,true);assert.equal(next.activations,1);
  assert.equal((await first.verify()).ready,true);assert.equal(first.storage.size,2);
});

test('cache namespace isolates two deployments on the same origin', async () => {
  const first=harness();await first.prepare(()=>{});
  const other=harness({storage:first.storage,base:'https://example.test/other/'});
  assert.equal((await other.verify()).ready,false);
  await other.prepare(()=>{});assert.equal((await first.verify()).ready,true);
  assert.equal(first.storage.size,2);
});

test('interrupted/network-failed preparation never marks offline ready', async () => {
  const h=harness({offline:true});
  assert.equal((await h.command('PREPARE')).ready,false);
  assert.equal((await h.verify()).ready,false);assert.equal(h.storage.size,0);
});

test('stored bytes must pass read-back verification before a completion marker is committed', async () => {
  const h=harness({storedCorrupt:'main.js'});
  await assert.rejects(h.prepare(()=>{}),/Wrong/);
  assert.equal((await h.verify()).ready,false);assert.equal(h.storage.size,0);
});

test('activation refuses multiple app windows even after the update pack is prepared', async () => {
  const h=harness({windows:2});await h.prepare(()=>{});
  assert.match((await h.command('ACTIVATE')).error,/close other/);assert.equal(h.activations,0);
});

test('an update must prepare before installation so natural activation after tabs close is safe', async () => {
  const first=harness();await first.install();assert.equal(first.requests,0);await first.prepare(()=>{});
  const next=harness({storage:first.storage,version:'two',updating:true});await next.install();
  assert.equal((await next.verify()).ready,true);assert.equal(next.activations,0);
  assert.equal((await first.verify()).ready,true);
});

test('failed update installation retains the previous worker pack', async () => {
  const first=harness();await first.prepare(()=>{});
  const next=harness({storage:first.storage,version:'two',updating:true,offline:true});
  await assert.rejects(next.install(),/Disconnected/);
  assert.equal((await first.verify()).ready,true);assert.equal((await next.verify()).ready,false);
});
