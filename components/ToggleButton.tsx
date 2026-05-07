"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { toggleStatusAction, type ActionState } from "@/app/actions";
import type { RequestWithWorkCenter } from "@/lib/repositories";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type Props = {
  request: RequestWithWorkCenter;
};

const initial: ActionState = {};

export function ToggleButton({ request }: Props) {
  const t = useTranslations("toggle");
  const [state, formAction, pending] = useActionState(toggleStatusAction, initial);

  const nextStatus = request.status === "open" ? "done" : "open";
  const isOpen = request.status === "open";

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={request.id} />
      <Button
        type="submit"
        variant="outlined"
        size="small"
        disabled={pending}
        aria-label={t("ariaLabel", { title: request.title, status: t(nextStatus) })}
        sx={{
          fontSize: "0.8rem",
          textTransform: "none",
          borderColor: isOpen ? "success.light" : "divider",
          color: isOpen ? "success.dark" : "text.secondary",
          backgroundColor: isOpen ? "success.50" : "grey.50",
          "&:hover": {
            borderColor: isOpen ? "success.main" : "text.secondary",
            backgroundColor: isOpen ? "success.100" : "grey.100",
          },
        }}
      >
        {t(request.status)}
      </Button>
      {state.error && (
        <Typography
          role="alert"
          variant="caption"
          color="error"
          sx={{ ml: 1 }}
        >
          {state.error}
        </Typography>
      )}
    </form>
  );
}
