import 'server-only';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import sharp from 'sharp';

export const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB pre-compression cap
const MAX_DIMENSION = 2000; // px, longest side after resize
const WEBP_QUALITY = 82;

const MAGIC_NUMBERS: Array<{ mime: string; check: (buf: Buffer) => boolean }> = [
  { mime: 'image/jpeg', check: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: 'image/png', check: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: 'image/webp', check: (b) => b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP' },
  { mime: 'image/gif', check: (b) => b.subarray(0, 4).toString('ascii') === 'GIF8' },
];

export class UploadError extends Error {}

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

/* Validates the file's actual bytes (not just its claimed MIME type),
   resizes/re-encodes it as compressed WebP via sharp, and writes it to
   disk under a randomly generated name — never the user-supplied
   filename — so there is no path traversal or overwrite vector, and no
   disguised-executable-as-image vector either. */
export async function processAndStoreImage(file: File): Promise<{ filename: string; mime: string; size: number; width: number; height: number; originalName: string }> {
  if (file.size === 0) throw new UploadError('The uploaded file is empty.');
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError(`File is too large (max ${MAX_UPLOAD_BYTES / 1024 / 1024}MB).`);

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = MAGIC_NUMBERS.find((m) => m.check(buffer));
  if (!detected) throw new UploadError('Unsupported or unrecognized file type. Only JPG, PNG, WEBP, and GIF images are allowed.');

  let pipeline = sharp(buffer, { animated: detected.mime === 'image/gif' });
  const metadata = await pipeline.metadata();
  if (!metadata.width || !metadata.height) throw new UploadError('Could not read image dimensions.');

  if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
    pipeline = pipeline.resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true });
  }

  const outputBuffer = detected.mime === 'image/gif'
    ? await pipeline.gif().toBuffer()
    : await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
  const outMime = detected.mime === 'image/gif' ? 'image/gif' : 'image/webp';
  const ext = detected.mime === 'image/gif' ? '.gif' : '.webp';

  await ensureUploadDir();
  const filename = `${crypto.randomUUID()}${ext}`;
  const destPath = path.join(UPLOAD_DIR, filename);
  if (!destPath.startsWith(UPLOAD_DIR + path.sep)) throw new UploadError('Invalid upload path.');

  await fs.writeFile(destPath, outputBuffer);
  const finalMeta = await sharp(outputBuffer).metadata();

  return {
    filename,
    mime: outMime,
    size: outputBuffer.length,
    width: finalMeta.width || metadata.width,
    height: finalMeta.height || metadata.height,
    originalName: (file.name || 'upload').slice(0, 200),
  };
}

export async function deleteStoredFile(filename: string): Promise<boolean> {
  // Filenames are always ones we generated (UUID + known extension);
  // reject anything else as defense in depth against path traversal.
  if (!/^[a-f0-9-]+\.(webp|gif)$/i.test(filename)) return false;
  const destPath = path.join(UPLOAD_DIR, filename);
  if (!destPath.startsWith(UPLOAD_DIR + path.sep)) return false;
  try {
    await fs.unlink(destPath);
    return true;
  } catch {
    return false;
  }
}
