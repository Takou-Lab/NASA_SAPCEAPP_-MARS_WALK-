import type { ImageManifest } from '../core/models';
import { validManifest } from '../core/validation';

export type ReadAssetBytes = (path: string) => Promise<Uint8Array | null>;

export interface ImagePayloadResult {
  readonly scope: 'image-payload';
  readonly ok: boolean;
  readonly imageRef: string | null;
  readonly verifiedPaths: readonly string[];
  readonly totalBytes: number | null;
  readonly errors: readonly string[];
}

interface IndexedFile {
  readonly path: string;
  readonly bytes: number;
  readonly sha256: string;
}

interface ValidatedIndex {
  readonly files: readonly [IndexedFile, IndexedFile];
}

type Sha256Result = { readonly ok: true; readonly hex: string } | { readonly ok: false; readonly error: string };

const MANIFEST_PATH = 'data/manifest.json';
const ROOT_KEYS = ['schemaVersion', 'imageRef', 'files', 'totalBytes'];
const FILE_KEYS = ['path', 'bytes', 'sha256'];
const SHA256_PATTERN = /^[0-9a-f]{64}$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

function hasExactOwnKeys(value: object, expected: readonly string[]): boolean {
  const keys = Reflect.ownKeys(value);
  return keys.length === expected.length && keys.every((key) => typeof key === 'string' && expected.includes(key));
}

function failure(imageRef: string | null, ...errors: string[]): ImagePayloadResult {
  return {
    scope: 'image-payload',
    ok: false,
    imageRef,
    verifiedPaths: [],
    totalBytes: null,
    errors: errors.length > 0 ? errors : ['Image payload verification failed.'],
  };
}

function validateIndex(index: unknown, activeImage: ImageManifest): ValidatedIndex | string {
  if (!isRecord(index) || !hasExactOwnKeys(index, ROOT_KEYS)) {
    return 'Image index must contain exactly schemaVersion, imageRef, files, and totalBytes.';
  }
  if (index['schemaVersion'] !== 1) return 'Image index schemaVersion must be 1.';
  if (index['imageRef'] !== activeImage.imageRef) return 'Image index imageRef does not match the active image.';
  if (!Array.isArray(index['files']) || index['files'].length !== 2) {
    return 'Image index must list exactly the manifest and active image assets.';
  }

  const expectedPaths = [MANIFEST_PATH, activeImage.assetPath] as const;
  const files: IndexedFile[] = [];
  for (let position = 0; position < expectedPaths.length; position += 1) {
    const file: unknown = index['files'][position];
    if (!isRecord(file) || !hasExactOwnKeys(file, FILE_KEYS)) {
      return `Image index entry ${position + 1} must contain exactly path, bytes, and sha256.`;
    }
    if (file['path'] !== expectedPaths[position]) {
      return `Image index entry ${position + 1} has an unexpected path.`;
    }
    if (typeof file['bytes'] !== 'number' || !Number.isSafeInteger(file['bytes']) || file['bytes'] <= 0) {
      return `Image index entry ${position + 1} must have a positive safe-integer byte length.`;
    }
    if (typeof file['sha256'] !== 'string' || !SHA256_PATTERN.test(file['sha256'])) {
      return `Image index entry ${position + 1} must have a lowercase SHA-256 digest.`;
    }
    files.push({ path: file['path'], bytes: file['bytes'], sha256: file['sha256'] });
  }

  const summedBytes = files[0].bytes + files[1].bytes;
  if (!Number.isSafeInteger(summedBytes) || summedBytes <= 0) {
    return 'Image index byte lengths exceed the safe integer range.';
  }
  if (
    typeof index['totalBytes'] !== 'number' ||
    !Number.isSafeInteger(index['totalBytes']) ||
    index['totalBytes'] <= 0 ||
    index['totalBytes'] !== summedBytes
  ) {
    return 'Image index totalBytes must equal the safe sum of its file lengths.';
  }

  return { files: [files[0], files[1]] };
}

async function sha256(bytes: Uint8Array, path: string): Promise<Sha256Result> {
  try {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle || typeof subtle.digest !== 'function') {
      return { ok: false, error: 'Web Crypto SHA-256 is unavailable in this browser context.' };
    }
    // Copy the supplied view so digest receives only the intended bytes, even for a subarray.
    const digest = await subtle.digest('SHA-256', bytes.slice().buffer);
    return {
      ok: true,
      hex: Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join(''),
    };
  } catch {
    return { ok: false, error: `Web Crypto could not verify ${path}.` };
  }
}

function sameManifestIdentity(manifest: ImageManifest, activeImage: ImageManifest): boolean {
  return (
    manifest.imageRef === activeImage.imageRef &&
    manifest.assetPath === activeImage.assetPath &&
    manifest.coordinateSystem === activeImage.coordinateSystem &&
    manifest.width === activeImage.width &&
    manifest.height === activeImage.height
  );
}

export async function verifyImagePayload(
  index: unknown,
  activeImage: ImageManifest,
  readBytes: ReadAssetBytes,
): Promise<ImagePayloadResult> {
  let imageRef: string | null = null;
  try {
    if (!validManifest(activeImage)) return failure(null, 'The active image manifest is invalid.');
    imageRef = activeImage.imageRef;

    const validated = validateIndex(index, activeImage);
    if (typeof validated === 'string') return failure(imageRef, validated);
    if (typeof readBytes !== 'function') return failure(imageRef, 'A cache-only asset reader is required.');

    const verifiedBytes: Uint8Array[] = [];
    for (const entry of validated.files) {
      let bytes: Uint8Array | null;
      try {
        bytes = await readBytes(entry.path);
      } catch {
        return failure(imageRef, `Could not read ${entry.path} from the supplied asset reader.`);
      }
      if (!(bytes instanceof Uint8Array)) {
        return failure(imageRef, `The supplied asset reader did not return bytes for ${entry.path}.`);
      }
      if (bytes.byteLength !== entry.bytes) {
        return failure(imageRef, `Byte length for ${entry.path} does not match the image index.`);
      }

      const digest = await sha256(bytes, entry.path);
      if (!digest.ok) return failure(imageRef, digest.error);
      if (digest.hex !== entry.sha256) return failure(imageRef, `SHA-256 for ${entry.path} does not match the image index.`);
      verifiedBytes.push(bytes);

      if (entry.path === MANIFEST_PATH) {
        let manifestValue: unknown;
        try {
          const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
          manifestValue = JSON.parse(text);
        } catch {
          return failure(imageRef, 'Cached image manifest is not strict UTF-8 JSON.');
        }
        if (!validManifest(manifestValue)) {
          return failure(imageRef, 'Cached image manifest does not satisfy the current manifest contract.');
        }
        if (!sameManifestIdentity(manifestValue, activeImage)) {
          return failure(imageRef, 'Cached image manifest identity does not match the active image.');
        }
      }
    }

    const actualTotalBytes = verifiedBytes[0].byteLength + verifiedBytes[1].byteLength;
    if (!Number.isSafeInteger(actualTotalBytes)) {
      return failure(imageRef, 'Verified image payload exceeds the safe byte-count range.');
    }
    return {
      scope: 'image-payload',
      ok: true,
      imageRef,
      verifiedPaths: validated.files.map((file) => file.path),
      totalBytes: actualTotalBytes,
      errors: [],
    };
  } catch {
    return failure(imageRef, 'An unexpected error prevented image payload verification.');
  }
}
