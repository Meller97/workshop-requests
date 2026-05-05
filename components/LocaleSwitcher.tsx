"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next });
  }

  return (
    <div style={{ display: "flex", gap: "0.4rem", direction: "ltr" }}>
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          disabled={l === locale}
          style={{
            padding: "0.25rem 0.6rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            cursor: l === locale ? "default" : "pointer",
            background: l === locale ? "#1a1a1a" : "#fff",
            color: l === locale ? "#fff" : "#333",
            fontWeight: l === locale ? 600 : 400,
            fontSize: "0.85rem",
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
