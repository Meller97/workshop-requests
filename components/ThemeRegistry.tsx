"use client";

import { useMemo } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import rtlPlugin from "stylis-plugin-rtl";
import { buildTheme } from "@/app/theme";
import type { Direction } from "@mui/material/styles";

interface Props {
  children: React.ReactNode;
  direction?: Direction;
}

export default function ThemeRegistry({ children, direction = "ltr" }: Props) {
  const theme = useMemo(() => buildTheme(direction), [direction]);

  return (
    <AppRouterCacheProvider
      options={{
        key: direction === "rtl" ? "muirtl" : "muiltr",
        stylisPlugins: direction === "rtl" ? [rtlPlugin] : [],
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
