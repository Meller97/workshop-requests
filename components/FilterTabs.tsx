"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { StatusFilter } from "@/lib/logic";

const TABS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Done", value: "done" },
];

export function FilterTabs() {
  const searchParams = useSearchParams();
  const current = (searchParams.get("filter") ?? "all") as StatusFilter;

  return (
    <nav aria-label="Filter requests" style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
      {TABS.map(({ label, value }) => {
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
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
