import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ImageManifest } from '../core/models';
import { testImage } from '../core/fixtures.spec-helper';
import { verifyImagePayload } from './image-payload-verifier';
import type { ImagePayloadResult } from './image-payload-verifier';

const image = testImage();
const imageBytes = new Uint8Array([0x61, 0x62, 0x63]);

interface ImageIndex {
  schemaVersion: number;
  imageRef: string;
  files: Array<{ path: string; bytes: number; sha256: string }>;
  totalBytes: number;
}

async function sha256(bytes: Uint8Array): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes.slice().buffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function makeFixture(manifestBytes = new TextEncoder().encode(JSON.stringify(image))) {
  const index: ImageIndex = {
    schemaVersion: 1,
    imageRef: image.imageRef,
    files: [
      { path: 'data/manifest.json', bytes: manifestBytes.byteLength, sha256: await sha256(manifestBytes) },
      { path: image.assetPath, bytes: imageBytes.byteLength, sha256: await sha256(imageBytes) },
    ],
    totalBytes: manifestBytes.byteLength + imageBytes.byteLength,
  };
  const assets = new Map([
    ['data/manifest.json', manifestBytes],
    [image.assetPath, imageBytes],
  ]);
  return { index, assets };
}

function failingResult(result: ImagePayloadResult, expectedImageRef: string | null = image.imageRef): void {
  expect(result).toMatchObject({
    scope: 'image-payload',
    ok: false,
    imageRef: expectedImageRef,
    verifiedPaths: [],
    totalBytes: null,
  });
  expect(result.errors.length).toBeGreaterThan(0);
}

afterEach(() => vi.unstubAllGlobals());

describe('verifyImagePayload', () => {
  it('verifies ordered manifest and image bytes with exact reference and actual byte total', async () => {
    const { index, assets } = await makeFixture();
    const reader = vi.fn(async (path: string) => assets.get(path) ?? null);
    const indexBefore = structuredClone(index);
    const manifestBytesBefore = Array.from(assets.get('data/manifest.json') ?? []);
    const imageBytesBefore = Array.from(assets.get(image.assetPath) ?? []);

    const result = await verifyImagePayload(index, image, reader);

    expect(result).toEqual({
      scope: 'image-payload',
      ok: true,
      imageRef: image.imageRef,
      verifiedPaths: ['data/manifest.json', image.assetPath],
      totalBytes: index.totalBytes,
      errors: [],
    });
    expect(reader.mock.calls).toEqual([['data/manifest.json'], [image.assetPath]]);
    expect(index.files[1].sha256).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(index).toEqual(indexBefore);
    expect(Array.from(assets.get('data/manifest.json') ?? [])).toEqual(manifestBytesBefore);
    expect(Array.from(assets.get(image.assetPath) ?? [])).toEqual(imageBytesBefore);
  });

  it('verifies only the bytes in a same-realm Uint8Array subarray', async () => {
    const { index, assets } = await makeFixture();
    const manifestBytes = assets.get('data/manifest.json');
    if (!manifestBytes) throw new Error('Test fixture is missing manifest bytes.');
    const padded = new Uint8Array(manifestBytes.byteLength + 2);
    padded[0] = 0xfe;
    padded.set(manifestBytes, 1);
    padded[padded.length - 1] = 0xef;
    const view = padded.subarray(1, padded.length - 1);
    const reader = vi.fn(async (path: string) => path === 'data/manifest.json' ? view : assets.get(path) ?? null);

    const result = await verifyImagePayload(index, image, reader);

    expect(result.ok).toBe(true);
    expect(result.totalBytes).toBe(index.totalBytes);
    expect(result.errors).toEqual([]);
  });

  it.skipIf(typeof document === 'undefined')('accepts a cross-realm Uint8Array subarray without reading its sentinels', async () => {
    const { index, assets } = await makeFixture();
    const manifestBytes = assets.get('data/manifest.json');
    if (!manifestBytes) throw new Error('Test fixture is missing manifest bytes.');
    const foreignBytes = crossRealmSubarray(manifestBytes);
    expect(ArrayBuffer.isView(foreignBytes)).toBe(true);
    expect(foreignBytes instanceof Uint8Array).toBe(false);
    const reader = vi.fn(async (path: string) => path === 'data/manifest.json' ? foreignBytes : assets.get(path) ?? null);

    const result = await verifyImagePayload(index, image, reader);

    expect(result).toMatchObject({
      scope: 'image-payload',
      ok: true,
      imageRef: image.imageRef,
      verifiedPaths: ['data/manifest.json', image.assetPath],
      totalBytes: index.totalBytes,
      errors: [],
    });
    expect(reader.mock.calls).toEqual([['data/manifest.json'], [image.assetPath]]);
  });

  it('rejects an invalid active manifest without exposing its reference or reading assets', async () => {
    const { index } = await makeFixture();
    const reader = vi.fn(async () => null);

    const result = await verifyImagePayload({ ...index }, { ...image, assetPath: 'data/imagery/../escape.png' }, reader);

    failingResult(result, null);
    expect(reader).not.toHaveBeenCalled();
  });

  it.each([
    ['null root', () => null],
    ['array root', () => []],
    ['extra root key', (index: ImageIndex) => ({ ...index, unexpected: true })],
    ['missing root key', (index: ImageIndex) => ({ schemaVersion: index.schemaVersion, imageRef: index.imageRef, files: index.files })],
    ['wrong schema version', (index: ImageIndex) => ({ ...index, schemaVersion: 1.5 })],
    ['wrong image reference', (index: ImageIndex) => ({ ...index, imageRef: 'other-image' })],
    ['missing file entry', (index: ImageIndex) => ({ ...index, files: index.files.slice(0, 1) })],
    ['extra file entry', (index: ImageIndex) => ({ ...index, files: [...index.files, index.files[1]] })],
    ['wrong file order', (index: ImageIndex) => ({ ...index, files: [...index.files].reverse() })],
    ['wrong manifest path', (index: ImageIndex) => changeFile(index, 0, { path: 'https://example.org/manifest.json' })],
    ['absolute image path', (index: ImageIndex) => changeFile(index, 1, { path: '/data/imagery/test.png' })],
    ['traversal image path', (index: ImageIndex) => changeFile(index, 1, { path: 'data/imagery/../test.png' })],
    ['percent encoded image path', (index: ImageIndex) => changeFile(index, 1, { path: 'data/imagery/%74est.png' })],
    ['whitespace image path', (index: ImageIndex) => changeFile(index, 1, { path: ' data/imagery/test.png' })],
    ['extra file key', (index: ImageIndex) => changeFile(index, 0, { extra: true })],
    ['missing file key', (index: ImageIndex) => removeFileKey(index, 0, 'sha256')],
    ['uppercase digest', (index: ImageIndex) => changeFile(index, 0, { sha256: 'A'.repeat(64) })],
    ['wrong total', (index: ImageIndex) => ({ ...index, totalBytes: index.totalBytes + 1 })],
    ['boolean byte length', (index: ImageIndex) => changeFile(index, 0, { bytes: true })],
    ['fraction byte length', (index: ImageIndex) => changeFile(index, 0, { bytes: 1.25 })],
    ['NaN byte length', (index: ImageIndex) => changeFile(index, 0, { bytes: Number.NaN })],
    ['infinite byte length', (index: ImageIndex) => changeFile(index, 0, { bytes: Number.POSITIVE_INFINITY })],
    ['unsafe byte length', (index: ImageIndex) => changeFile(index, 0, { bytes: Number.MAX_SAFE_INTEGER + 1 })],
    ['zero byte length', (index: ImageIndex) => changeFile(index, 0, { bytes: 0 })],
    [
      'unsafe sum of safe file lengths',
      (index: ImageIndex) => ({
        ...index,
        files: index.files.map((file) => ({ ...file, bytes: Number.MAX_SAFE_INTEGER - 10 })),
        totalBytes: Number.MAX_SAFE_INTEGER,
      }),
    ],
  ])('rejects malformed index before any reader call (%s)', async (_name, makeInvalid) => {
    const { index } = await makeFixture();
    const reader = vi.fn(async () => null);

    const result = await verifyImagePayload(makeInvalid(index), image, reader);

    failingResult(result);
    expect(reader).not.toHaveBeenCalled();
  });

  it.each([
    ['missing manifest asset', async () => null],
    ['reader rejection', async () => { throw new Error('cache read failed'); }],
    ['reader returns non-bytes', async () => 'not bytes' as unknown as Uint8Array],
  ])('returns a useful failure for %s', async (_name, firstRead) => {
    const { index, assets } = await makeFixture();
    const reader = vi.fn(async (path: string) => path === 'data/manifest.json' ? firstRead() : assets.get(path) ?? null);

    const result = await verifyImagePayload(index, image, reader);

    failingResult(result);
    expect(reader).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['DataView', new DataView(new ArrayBuffer(4))],
    ['Int8Array', new Int8Array([1, 2, 3, 4])],
    ['Uint16Array', new Uint16Array([1, 2])],
    ['Uint8ClampedArray', new Uint8ClampedArray([1, 2, 3, 4])],
  ] as const)('rejects a reader value that is not Uint8Array (%s)', async (_name, invalidValue) => {
    const { index, assets } = await makeFixture();
    const reader = vi.fn(async (path: string): Promise<Uint8Array | null> =>
      path === 'data/manifest.json' ? invalidValue as unknown as Uint8Array : assets.get(path) ?? null,
    );

    const result = await verifyImagePayload(index, image, reader);

    failingResult(result);
    expect(result.errors[0]).toContain('did not return bytes');
    expect(reader).toHaveBeenCalledTimes(1);
  });

  it('rejects an asset with the wrong byte length', async () => {
    const { index, assets } = await makeFixture();
    const reader = vi.fn(async (path: string) => path === image.assetPath ? new Uint8Array([1]) : assets.get(path) ?? null);

    const result = await verifyImagePayload(index, image, reader);

    failingResult(result);
    expect(reader.mock.calls).toEqual([['data/manifest.json'], [image.assetPath]]);
  });

  it('rejects corrupt bytes even when the declared length is unchanged', async () => {
    const { index, assets } = await makeFixture();
    const reader = vi.fn(async (path: string) => path === image.assetPath ? new Uint8Array([0x61, 0x62, 0x64]) : assets.get(path) ?? null);

    const result = await verifyImagePayload(index, image, reader);

    failingResult(result);
    expect(result.errors[0]).toContain('SHA-256');
  });

  it('fails closed when Web Crypto is unavailable or rejects digest', async () => {
    const { index, assets } = await makeFixture();
    const reader = vi.fn(async (path: string) => assets.get(path) ?? null);

    vi.stubGlobal('crypto', { subtle: undefined } as unknown as Crypto);
    const unavailable = await verifyImagePayload(index, image, reader);
    failingResult(unavailable);
    expect(unavailable.errors[0]).toContain('unavailable');

    vi.stubGlobal('crypto', {
      subtle: { digest: vi.fn().mockRejectedValue(new Error('crypto failed')) },
    } as unknown as Crypto);
    const rejected = await verifyImagePayload(index, image, reader);
    failingResult(rejected);
    expect(rejected.errors[0]).toContain('Web Crypto could not verify');
  });

  it.each([
    ['invalid JSON', new TextEncoder().encode('{not json}')],
    ['invalid UTF-8', new Uint8Array([0x7b, 0x22, 0x78, 0x22, 0x3a, 0xff, 0x7d])],
    ['UTF-8 BOM', new Uint8Array([0xef, 0xbb, 0xbf, ...new TextEncoder().encode(JSON.stringify(image))])],
  ])('rejects hash-matching manifest bytes with %s', async (_name, manifestBytes) => {
    const { index, assets } = await makeFixture(manifestBytes);
    const reader = vi.fn(async (path: string) => assets.get(path) ?? null);

    const result = await verifyImagePayload(index, image, reader);

    failingResult(result);
    expect(reader.mock.calls).toEqual([['data/manifest.json']]);
  });

  it.each([
    ['reference', { ...image, imageRef: 'different-valid-reference' }, true],
    ['path', { ...image, assetPath: 'data/imagery/other.png' }, true],
    ['coordinate system', { ...image, coordinateSystem: 'image-pixels-top-left' as ImageManifest['coordinateSystem'] }, false],
    ['width', { ...image, width: image.width + 1 }, true],
    ['height', { ...image, height: image.height + 1 }, true],
  ])('rejects a hash-matching cached manifest with mismatched %s', async (_name, cachedManifest, validRuntimeManifest) => {
    const manifestBytes = new TextEncoder().encode(JSON.stringify(cachedManifest));
    const { index, assets } = await makeFixture(manifestBytes);
    const reader = vi.fn(async (path: string) => assets.get(path) ?? null);

    const result = await verifyImagePayload(index, image, reader);

    failingResult(result);
    expect(result.errors[0]).toContain(validRuntimeManifest ? 'identity' : 'current manifest contract');
    expect(reader.mock.calls).toEqual([['data/manifest.json']]);
  });

  it('requires a reader and does not mutate frozen index or active manifest inputs', async () => {
    const { index, assets } = await makeFixture();
    const frozenIndex = deepFreeze(structuredClone(index));
    const frozenImage = deepFreeze(structuredClone(image));
    const bytesBefore = Array.from(assets.get('data/manifest.json') ?? []);

    const noReader = await verifyImagePayload(frozenIndex, frozenImage, null as never);
    failingResult(noReader);
    expect(noReader.errors[0]).toContain('reader');

    const success = await verifyImagePayload(frozenIndex, frozenImage, async (path) => assets.get(path) ?? null);
    expect(success.ok).toBe(true);
    expect(frozenIndex).toEqual(index);
    expect(frozenImage).toEqual(image);
    expect(Array.from(assets.get('data/manifest.json') ?? [])).toEqual(bytesBefore);
  });

  it('does not fetch assets or write browser storage', async () => {
    const { index, assets } = await makeFixture();
    const fetchMock = vi.fn();
    const storage = {
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('localStorage', storage);

    const result = await verifyImagePayload(index, image, async (path) => assets.get(path) ?? null);

    expect(result.ok).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(storage.removeItem).not.toHaveBeenCalled();
    expect(storage.clear).not.toHaveBeenCalled();
  });
});

function changeFile(index: ImageIndex, position: number, changes: Record<string, unknown>): unknown {
  const files = index.files.map((file) => ({ ...file })) as Array<Record<string, unknown>>;
  files[position] = { ...files[position], ...changes };
  return { ...index, files };
}

function removeFileKey(index: ImageIndex, position: number, key: string): unknown {
  const files = index.files.map((file) => ({ ...file })) as Array<Record<string, unknown>>;
  delete files[position][key];
  return { ...index, files };
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function crossRealmSubarray(bytes: Uint8Array): Uint8Array {
  const frame = document.createElement('iframe');
  document.body.appendChild(frame);
  try {
    const foreignWindow = frame.contentWindow;
    if (!foreignWindow) throw new Error('Unable to create the test iframe realm.');
    const ForeignUint8Array = (foreignWindow as Window & typeof globalThis).Uint8Array;
    const padded = new ForeignUint8Array(bytes.byteLength + 2);
    padded[0] = 0xfe;
    padded.set(bytes, 1);
    padded[padded.length - 1] = 0xef;
    return padded.subarray(1, padded.length - 1) as unknown as Uint8Array;
  } finally {
    frame.remove();
  }
}
