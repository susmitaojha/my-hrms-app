import fs from 'fs';
import path from 'path';

/**
 * Validates the image MIME type based on its binary magic numbers (signatures)
 * rather than relying solely on file extension.
 * Rejects GIFs, PDFs, SVGs, executables, etc.
 */
export function isValidImageMimeType(buffer: Buffer): { isValid: boolean; ext?: string } {
  if (buffer.length < 12) {
    return { isValid: false };
  }

  // 1. Check PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, ext: 'png' };
  }

  // 2. Check JPEG/JPG signature: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, ext: 'jpg' };
  }

  // 3. Check WEBP signature: "RIFF" (52 49 46 46) at offset 0 and "WEBP" (57 45 42 50) at offset 8
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { isValid: true, ext: 'webp' };
  }

  return { isValid: false };
}

/**
 * Safely deletes a file from local storage, resolving whether the saved path is
 * a full relative path (e.g. `uploads/employees/...`) or a plain filename.
 */
export function deleteFileSafely(photoPath: string | null | undefined): void {
  if (!photoPath) return;

  let targetPath = '';
  if (photoPath.startsWith('uploads/employees/')) {
    targetPath = path.join(process.cwd(), 'public', photoPath);
  } else if (photoPath.startsWith('public/uploads/employees/')) {
    targetPath = path.join(process.cwd(), photoPath);
  } else {
    // Legacy support for plain filename
    targetPath = path.join(process.cwd(), 'public', 'uploads', 'employees', photoPath);
  }

  try {
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      console.log(`Deleted file: ${targetPath}`);
    }
  } catch (err) {
    console.error(`Error deleting photo file at ${targetPath}:`, err);
  }
}
