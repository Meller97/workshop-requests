"use client";

import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { TypographyProps } from "@mui/material/Typography";

interface Props extends TypographyProps {
  text: string;
  lines?: number;
}

export function TruncatedText({ text, lines = 1, sx, ...props }: Props) {
  return (
    <Tooltip title={text} placement="top-start" enterDelay={500}>
      <Typography
        noWrap={lines === 1}
        sx={[
          lines > 1 && {
            display: "-webkit-box",
            WebkitLineClamp: lines,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          },
          ...(Array.isArray(sx) ? sx : [sx ?? {}]),
        ]}
        {...props}
      >
        {text}
      </Typography>
    </Tooltip>
  );
}
