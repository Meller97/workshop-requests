import { z } from "zod";

export const createRequestSchema = z.object({
  work_center_id: z.coerce.number().int().positive("Work center is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or fewer"),
  note: z.string().max(1000, "Note must be 1000 characters or fewer").optional(),
});

export type CreateRequestData = z.infer<typeof createRequestSchema>;

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> };

export function validateCreateRequest(
  raw: unknown
): ValidationResult<CreateRequestData> {
  const result = createRequestSchema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.flatten().fieldErrors as Record<string, string[]>,
  };
}
