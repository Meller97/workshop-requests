import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDb } from "@/lib/db";
import { getRequests, getWorkCenters } from "@/lib/repositories";
import { filterRequests, parseStatusFilter } from "@/lib/logic";
import { RequestForm } from "@/components/RequestForm";
import { RequestList } from "@/components/RequestList";
import { FilterTabs } from "@/components/FilterTabs";
import Image from "next/image";

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
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem 1rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "1.5rem",
        }}
      >
        <Image src="/logoAnak.png" alt={t("logoAlt")} width={127} height={40} />
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          {t("heading")}
        </h1>
      </div>

      <RequestForm workCenters={workCenters} />

      <section aria-label={t("requestListLabel")}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
            {t("requestsSection")}{" "}
            <span style={{ color: "#888", fontWeight: 400 }}>
              ({requests.length})
            </span>
          </h2>
        </div>
        <Suspense fallback={null}>
          <FilterTabs />
        </Suspense>
        <RequestList requests={requests} />
      </section>
    </main>
  );
}
