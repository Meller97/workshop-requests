import { getTranslations } from "next-intl/server";
import type { RequestWithWorkCenter } from "@/lib/repositories";
import { ToggleButton } from "./ToggleButton";
import { TruncatedText } from "./TruncatedText";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

type Props = {
  requests: RequestWithWorkCenter[];
};

export async function RequestList({ requests }: Props) {
  const t = await getTranslations("list");

  if (requests.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {t("empty")}
      </Typography>
    );
  }

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: "none", p: 0, m: 0 }}>
      {requests.map((req) => (
        <Card component="li" key={req.id} variant="outlined" sx={{ background: "grey.50" }}>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              "&:last-child": { pb: 2 },
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.5 }}>
                <TruncatedText text={req.title} variant="body1" sx={{ fontWeight: 600 }} />
                <Chip label={req.work_center_name} size="small" variant="outlined" />
              </Box>
              {req.note && (
                <TruncatedText text={req.note} lines={2} variant="body2" color="text.secondary" />
              )}
              <Typography
                component="time"
                dateTime={req.created_at}
                variant="caption"
                color="text.disabled"
                sx={{ display: "block", mt: 0.5 }}
              >
                {new Date(req.created_at).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ flexShrink: 0 }}>
              <ToggleButton request={req} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
