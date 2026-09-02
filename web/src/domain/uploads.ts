import { hasConsent, type ConsentRecord, type DocumentCategory } from "./consent";

/**
 * The secure upload pipeline, as a set of preconditions rather than a promise.
 *
 * It fails closed. A file with no live consent for its category, an unlisted
 * file type, an oversized file, or a file that cannot be scanned for malware is
 * refused with a stated reason. Refusing an upload is recoverable. Accepting an
 * unscanned passport scan into a system whose entire pitch is trustworthiness
 * is not.
 */

export const allowedTypes: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

export const MAX_BYTES = 10 * 1024 * 1024;

export type UploadCheck =
  | { ok: true; category: DocumentCategory }
  | { ok: false; reason: string; blocker: "consent" | "type" | "size" | "scanner" };

export function scannerConfigured(): boolean {
  return Boolean(process.env.MALWARE_SCAN_ENDPOINT);
}

export function checkUpload(
  file: { name: string; type: string; size: number },
  category: DocumentCategory,
  caseId: string,
  consents: ConsentRecord[],
): UploadCheck {
  if (!hasConsent(consents, caseId, category)) {
    return {
      ok: false,
      blocker: "consent",
      reason:
        "There is no live consent on file for this document category. Consent is taken before collection, not after.",
    };
  }

  const extensions = allowedTypes[file.type];
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!extensions || !extensions.includes(extension)) {
    return {
      ok: false,
      blocker: "type",
      reason: `Only PDF, JPG and PNG files are accepted. This one is ${file.type || "of an unknown type"}.`,
    };
  }

  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      blocker: "size",
      reason: `Files are limited to ${MAX_BYTES / (1024 * 1024)} MB. This one is ${(file.size / (1024 * 1024)).toFixed(1)} MB.`,
    };
  }

  if (!scannerConfigured()) {
    return {
      ok: false,
      blocker: "scanner",
      reason:
        "Malware scanning is not connected, so nothing is accepted into storage. This is deliberate. An unscanned document is not stored here on the promise that it is probably fine.",
    };
  }

  return { ok: true, category };
}

/**
 * Extraction cannot run on a document the platform never stored. Both halves
 * have to exist before the Document Intelligence agent has anything to read.
 */
export function documentPipelineReady(): boolean {
  return scannerConfigured() && Boolean(process.env.DOCUMENT_STORAGE_BUCKET);
}
