"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { getDb } from "@/lib/db";
import { createRequest, toggleRequestStatus } from "@/lib/repositories";
import { validateCreateRequest } from "@/lib/validation";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createRequestAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const tV = await getTranslations("validation");
  const tE = await getTranslations("errors");

  const raw = {
    work_center_id: formData.get("work_center_id"),
    title: formData.get("title"),
    note: formData.get("note") || undefined,
  };

  const validation = validateCreateRequest(raw, {
    workCenterRequired: tV("workCenterRequired"),
    titleRequired: tV("titleRequired"),
    titleTooLong: tV("titleTooLong"),
    noteTooLong: tV("noteTooLong"),
  });

  if (!validation.success) {
    return { fieldErrors: validation.errors };
  }

  try {
    const db = getDb();
    createRequest(db, {
      work_center_id: validation.data.work_center_id,
      title: validation.data.title,
      note: validation.data.note ?? null,
    });
  } catch (err) {
    console.error("createRequestAction error:", err);
    return { error: tE("saveFailed") };
  }

  revalidatePath("/");
  return {};
}

export async function toggleStatusAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const tE = await getTranslations("errors");

  const rawId = formData.get("id");
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    return { error: tE("invalidId") };
  }

  try {
    const db = getDb();
    const updated = toggleRequestStatus(db, id);
    if (!updated) {
      return { error: tE("notFound") };
    }
  } catch (err) {
    console.error("toggleStatusAction error:", err);
    return { error: tE("updateFailed") };
  }

  revalidatePath("/");
  return {};
}
