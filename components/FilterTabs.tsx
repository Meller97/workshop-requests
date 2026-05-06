"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import type { StatusFilter } from "@/lib/logic";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const TABS: StatusFilter[] = ["all", "open", "done"];

export function FilterTabs() {
  const t = useTranslations("filters");
  const searchParams = useSearchParams();
  const current = (searchParams.get("filter") ?? "all") as StatusFilter;

  return (
    <Tabs
      component="nav"
      aria-label={t("navLabel")}
      value={current}
      sx={{ mb: 1.5, minHeight: "unset" }}
    >
      {TABS.map((value) => {
        const href = value === "all" ? "/" : `/?filter=${value}`;
        return (
          <Tab
            key={value}
            value={value}
            label={t(value)}
            component={Link}
            href={href}
            aria-current={current === value ? "page" : undefined}
            sx={{ minHeight: "unset", py: 0.75, textTransform: "none" }}
          />
        );
      })}
    </Tabs>
  );
}
