"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { toggleStatusAction, type ActionState } from "@/app/actions";
import type { RequestWithWorkCenter } from "@/lib/repositories";

type Props = {
  request: RequestWithWorkCenter;
};

const initial: ActionState = {};

export function ToggleButton({ request }: Props) {
  const t = useTranslations("toggle");
  const [state, formAction, pending] = useActionState(toggleStatusAction, initial);

  const nextStatus = request.status === "open" ? "done" : "open";

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={request.id} />
      <button
        type="submit"
        disabled={pending}
        aria-label={t("ariaLabel", { title: request.title, status: t(nextStatus) })}
        style={{
          padding: "0.25rem 0.6rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          cursor: pending ? "wait" : "pointer",
          background: request.status === "open" ? "#e8f5e9" : "#f5f5f5",
          color: request.status === "open" ? "#2e7d32" : "#555",
          fontWeight: 500,
          fontSize: "0.8rem",
        }}
      >
        {t(request.status)}
      </button>
      {state.error && (
        <span role="alert" style={{ color: "red", fontSize: "0.8rem", marginLeft: "0.4rem" }}>
          {state.error}
        </span>
      )}
    </form>
  );
}
