/**
 * Shared utility: delete uploaded files from disk when records are deleted.
 * Only deletes files that live under /assets/academics/uploads/ (our upload dir).
 * Safe to call with any URL — non-upload URLs are silently skipped.
 */

import { unlink } from 'fs/promises';
import path from 'path';

const UPLOAD_PREFIX = '/assets/academics/uploads/';
const PUBLIC_DIR = path.join(process.cwd(), 'public');

/**
 * Delete a single uploaded file by its public URL.
 * Silently ignores errors (missing file, permissions, non-upload paths).
 */
export async function deleteUploadedFile(url: string | null | undefined): Promise<void> {
    if (!url || !url.startsWith(UPLOAD_PREFIX)) return;
    try {
        const filepath = path.join(PUBLIC_DIR, ...url.split('/').filter(Boolean));
        await unlink(filepath);
    } catch {
        // Ignore: file may already be deleted or not exist
    }
}

/**
 * Delete multiple uploaded files by their public URLs.
 * All deletions run in parallel; errors are silently ignored.
 */
export async function deleteUploadedFiles(urls: (string | null | undefined)[]): Promise<void> {
    await Promise.all(urls.map(deleteUploadedFile));
}

/**
 * Collect all image/file URLs from a record's JSON fields and delete them.
 * Handles: faculty profile_data.tabs content is HTML (no direct image paths to extract).
 * 
 * @param imageUrls  Top-level image URLs from the record
 * @param jsonFields  Optional parsed JSON arrays/objects that may contain image fields
 */
export async function deleteRecordFiles(
    imageUrls: (string | null | undefined)[],
    jsonFields?: Array<any[] | null | undefined>
): Promise<void> {
    const allUrls: (string | null | undefined)[] = [...imageUrls];

    if (jsonFields) {
        for (const field of jsonFields) {
            if (!field || !Array.isArray(field)) continue;
            for (const item of field) {
                if (item && typeof item === 'object') {
                    // Collect any property that looks like an uploaded file URL
                    for (const value of Object.values(item)) {
                        if (typeof value === 'string' && value.startsWith(UPLOAD_PREFIX)) {
                            allUrls.push(value);
                        }
                    }
                }
            }
        }
    }

    await deleteUploadedFiles(allUrls);
}
