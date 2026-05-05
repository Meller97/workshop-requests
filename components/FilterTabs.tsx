"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { StatusFilter } from "@/lib/logic";

const TABS: StatusFilter[] = ["all", "open", "done"];

export function FilterTabs() {
  const t = useTranslations("filters");
  const searchParams = useSearchParams();
  const current = (searchParams.get("filter") ?? "all") as StatusFilter;

  return (
    <nav aria-label={t("navLabel")} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
      {TABS.map((value) => {
        const href = value === "all" ? "/" : `/?filter=${value}`;
        const isActive = current === value;
        return (
          <Link
            key={value}
            href={href}
            aria-current={isActive ? "page" : undefined}
            style={{
              padding: "0.35rem 0.9rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              textDecoration: "none",
              fontWeight: isActive ? 600 : 400,
              background: isActive ? "#1a1a1a" : "#fff",
              color: isActive ? "#fff" : "#333",
            }}
          >
            {t(value)}
          </Link>
        );
      })}
    </nav>
  );
}
