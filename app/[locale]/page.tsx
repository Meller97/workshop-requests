import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDb } from "@/lib/db";
import { getRequests, getWorkCenters } from "@/lib/repositories";
import { filterRequests, parseStatusFilter } from "@/lib/logic";
import { RequestForm } from "@/components/RequestForm";
import { RequestList } from "@/components/RequestList";
import { FilterTabs } from "@/components/FilterTabs";
import Image from "next/image";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ filter?: string }>;
};

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { filter: rawFilter } = await searchParams;
  const filter = parseStatusFilter(rawFilter);

  const t = await getTranslations("page");

  const db = getDb();
  const allRequests = getRequests(db);
  const workCenters = getWorkCenters(db);
  const requests = filterRequests(allRequests, filter);

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Image src="/logoAnak.png" alt={t("logoAlt")} width={127} height={40} />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            {t("heading")}
          </Typography>
        </Box>

        <RequestForm workCenters={workCenters} />

        <Box component="section" aria-label={t("requestListLabel")}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }}>
              {t("requestsSection")}{" "}
              <Typography component="span" color="text.secondary" sx={{ fontWeight: 400 }}>
                ({requests.length})
              </Typography>
            </Typography>
          </Box>
          <Suspense fallback={null}>
            <FilterTabs />
          </Suspense>
          <RequestList requests={requests} />
        </Box>
      </Stack>
    </Container>
  );
}
