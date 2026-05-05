import { z } from "zod";

type ValidationMessages = {
  workCenterRequired: string;
  titleRequired: string;
  titleTooLong: string;
  noteTooLong: string;
};

function buildSchema(msgs: ValidationMessages) {
  return z.object({
    work_center_id: z.coerce.number().int().positive(msgs.workCenterRequired),
    title: z
      .string()
      .min(1, msgs.titleRequired)
      .max(120, msgs.titleTooLong),
    note: z.string().max(1000, msgs.noteTooLong).optional(),
  });
}

export type CreateRequestData = z.infer<ReturnType<typeof buildSchema>>;

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> };

export function validateCreateRequest(
  raw: unknown,
  msgs: ValidationMessages
): ValidationResult<CreateRequestData> {
  const result = buildSchema(msgs).safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.flatten().fieldErrors as Record<string, string[]>,
  };
}
