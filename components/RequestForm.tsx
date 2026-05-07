"use client";

import { useActionState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { createRequestAction, type ActionState } from "@/app/actions";
import type { WorkCenter } from "@/lib/repositories";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

type Props = {
  workCenters: WorkCenter[];
};

const initial: ActionState = {};

export function RequestForm({ workCenters }: Props) {
  const t = useTranslations("form");
  const [state, formAction, pending] = useActionState(createRequestAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error && !state.fieldErrors) {
      formRef.current?.reset();
    }
  }, [pending, state]);

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Box component="form" ref={formRef} action={formAction} noValidate>
        <Stack spacing={2}>
          <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>
            {t("heading")}
          </Typography>

          {state.error && (
            <Alert severity="error" role="alert">
              {state.error}
            </Alert>
          )}

          <TextField
            select
            slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
            id="work_center_id"
            name="work_center_id"
            label={t("workCenterLabel")}
            required
            defaultValue=""
            size="small"
            error={!!state.fieldErrors?.work_center_id?.length}
            helperText={<FieldErrors errors={state.fieldErrors?.work_center_id} />}
          >
            <option value="" disabled>
              {t("workCenterPlaceholder")}
            </option>
            {workCenters.map((wc) => (
              <option key={wc.id} value={wc.id}>
                {wc.name}
              </option>
            ))}
          </TextField>

          <TextField
            id="title"
            name="title"
            type="text"
            label={t("titleLabel")}
            placeholder={t("titlePlaceholder")}
            required
            slotProps={{ htmlInput: { maxLength: 120 } }}
            size="small"
            error={!!state.fieldErrors?.title?.length}
            helperText={<FieldErrors errors={state.fieldErrors?.title} />}
          />

          <TextField
            id="note"
            name="note"
            label={
              <>
                {t("noteLabel")}{" "}
                <Box component="span" sx={{ fontSize: "0.8em", color: "text.secondary", fontWeight: 400 }}>
                  {t("noteOptional")}
                </Box>
              </>
            }
            placeholder={t("notePlaceholder")}
            multiline
            rows={3}
            slotProps={{ htmlInput: { maxLength: 1000 } }}
            size="small"
            error={!!state.fieldErrors?.note?.length}
            helperText={<FieldErrors errors={state.fieldErrors?.note} />}
            sx={{ "& textarea": { resize: "vertical" } }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={pending}
            sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 600 }}
          >
            {pending ? t("submitting") : t("submit")}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

function FieldErrors({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <>
      {errors.map((e) => (
        <Box component="span" key={e} sx={{ display: "block" }}>
          {e}
        </Box>
      ))}
    </>
  );
}
