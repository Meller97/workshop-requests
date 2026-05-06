"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function switchLocale(next: string) {
    const query = searchParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { locale: next });
  }

  return (
    <ToggleButtonGroup value={locale} exclusive size="small" dir="ltr">
      {routing.locales.map((l, i) => (
        <ToggleButton
          key={l}
          value={l}
          onClick={() => switchLocale(l)}
          sx={{ px: 1.5, py: 0.5, fontSize: "0.8rem", fontWeight: 600 }}
          style={{
            borderRadius:
              i === 0 ? "8px 0 0 8px" : "0 8px 8px 0",
          }}
        >
          {l.toUpperCase()}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
