import { createTheme, type Direction } from "@mui/material/styles";

export function buildTheme(direction: Direction = "ltr") {
  return createTheme({
    direction,
    palette: {
      primary: {
        main: "#f97316",
        dark: "#ea580c",
        contrastText: "#ffffff",
      },
      background: {
        default: "#f9fafb",
        paper: "#ffffff",
      },
      text: {
        primary: "#1f2937",
        secondary: "#6b7280",
      },
      divider: "#e5e7eb",
      error: {
        main: "#c62828",
      },
    },
    typography: {
      fontFamily: "Arial, Helvetica, sans-serif",
    },
    shape: {
      borderRadius: 8,
    },
  });
}
