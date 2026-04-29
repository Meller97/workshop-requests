import type { RequestWithWorkCenter } from "./repositories";

export type StatusFilter = "all" | "open" | "done";

export function parseStatusFilter(value: unknown): StatusFilter {
  if (value === "open" || value === "done") return value;
  return "all";
}

export function filterRequests(
  requests: RequestWithWorkCenter[],
  filter: StatusFilter
): RequestWithWorkCenter[] {
  if (filter === "all") return requests;
  return requests.filter((r) => r.status === filter);
}
