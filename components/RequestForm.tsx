"use client";

import { useActionState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { createRequestAction, type ActionState } from "@/app/actions";
import type { WorkCenter } from "@/lib/repositories";

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
    <form
      ref={formRef}
      action={formAction}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "1.25rem",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        background: "#fff",
        marginBottom: "1.5rem",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{t("heading")}</h2>

      {state.error && (
        <p role="alert" style={{ margin: 0, color: "#c62828", fontSize: "0.875rem" }}>
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="work_center_id" style={labelStyle}>
          {t("workCenterLabel")} <span aria-hidden="true" style={{ color: "red" }}>*</span>
        </label>
        <select
          id="work_center_id"
          name="work_center_id"
          required
          defaultValue=""
          style={inputStyle}
        >
          <option value="" disabled>
            {t("workCenterPlaceholder")}
          </option>
          {workCenters.map((wc) => (
            <option key={wc.id} value={wc.id}>
              {wc.name}
            </option>
          ))}
        </select>
        <FieldError errors={state.fieldErrors?.work_center_id} />
      </div>

      <div>
        <label htmlFor="title" style={labelStyle}>
          {t("titleLabel")} <span aria-hidden="true" style={{ color: "red" }}>*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          placeholder={t("titlePlaceholder")}
          style={inputStyle}
        />
        <FieldError errors={state.fieldErrors?.title} />
      </div>

      <div>
        <label htmlFor="note" style={labelStyle}>
          {t("noteLabel")} <span style={{ color: "#999", fontWeight: 400 }}>{t("noteOptional")}</span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          maxLength={1000}
          placeholder={t("notePlaceholder")}
          style={{ ...inputStyle, resize: "vertical" }}
        />
        <FieldError errors={state.fieldErrors?.note} />
      </div>

      <button
        type="submit"
        disabled={pending}
        style={{
          alignSelf: "flex-start",
          padding: "0.5rem 1.2rem",
          background: "#1a1a1a",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: pending ? "wait" : "pointer",
          fontWeight: 600,
          fontSize: "0.9rem",
        }}
      >
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <ul role="alert" style={{ margin: "0.2rem 0 0", padding: 0, listStyle: "none" }}>
      {errors.map((e) => (
        <li key={e} style={{ color: "#c62828", fontSize: "0.8rem" }}>
          {e}
        </li>
      ))}
    </ul>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.25rem",
  fontWeight: 500,
  fontSize: "0.875rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.4rem 0.6rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  fontSize: "0.9rem",
  boxSizing: "border-box",
};
