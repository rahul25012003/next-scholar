"use server";

import { getCase, listConsents } from "@/data/store";
import { demoCounselor } from "@/domain/demo-actors";
import { checkUpload } from "@/domain/uploads";
import type { DocumentCategory } from "@/domain/consent";
import { record as recordAudit } from "@/domain/audit";

export type UploadResult =
  | { status: "idle" }
  | { status: "accepted"; message: string }
  | { status: "refused"; blocker: string; reason: string }
  | { status: "error"; message: string };

/**
 * The upload path, which currently refuses everything.
 *
 * That is not a stub. It is the pipeline running: a category with no live
 * consent is refused, a file type outside the allowlist is refused, an
 * oversized file is refused, and while no malware scanner is connected every
 * file is refused on that basis too. Nothing is stored on the promise that it
 * is probably fine.
 */
export async function attemptUpload(
  _previous: UploadResult,
  formData: FormData,
): Promise<UploadResult> {
  const caseId = String(formData.get("caseId") ?? "");
  const category = String(formData.get("category") ?? "") as DocumentCategory;
  const file = formData.get("file");

  if (!category) return { status: "error", message: "Choose what the document is." };
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose a file." };
  }

  const record = await getCase(caseId, demoCounselor);
  if (!record) {
    return { status: "error", message: "That case is not readable by this account." };
  }

  const consents = await listConsents(caseId, demoCounselor);
  const check = checkUpload(
    { name: file.name, type: file.type, size: file.size },
    category,
    caseId,
    consents,
  );

  if (!check.ok) {
    recordAudit({
      actorId: demoCounselor.id,
      actorName: demoCounselor.name,
      actorRole: demoCounselor.role,
      action: "reject-upload",
      subjectType: "document",
      subjectId: `${caseId}:${category}`,
      note: `${check.blocker}: ${check.reason}`,
    });

    return { status: "refused", blocker: check.blocker, reason: check.reason };
  }

  // Unreachable until storage exists. Left as the single place a stored
  // document and its first version get created.
  return {
    status: "accepted",
    message:
      "Every precondition passed. Storing it needs the document store, which is not connected yet.",
  };
}
