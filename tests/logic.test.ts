import { describe, it, expect } from "vitest";
import { filterRequests, parseStatusFilter } from "@/lib/logic";
import type { RequestWithWorkCenter } from "@/lib/repositories";

function makeRequest(overrides: Partial<RequestWithWorkCenter> = {}): RequestWithWorkCenter {
  return {
    id: 1,
    work_center_id: 1,
    title: "Test request",
    note: null,
    status: "open",
    created_at: new Date().toISOString(),
    work_center_name: "CNC Area",
    ...overrides,
  };
}

describe("parseStatusFilter", () => {
  it("returns 'all' for undefined", () => {
    expect(parseStatusFilter(undefined)).toBe("all");
  });

  it("returns 'all' for unexpected values", () => {
    expect(parseStatusFilter("closed")).toBe("all");
    expect(parseStatusFilter(42)).toBe("all");
    expect(parseStatusFilter(null)).toBe("all");
  });

  it("returns 'open' for 'open'", () => {
    expect(parseStatusFilter("open")).toBe("open");
  });

  it("returns 'done' for 'done'", () => {
    expect(parseStatusFilter("done")).toBe("done");
  });
});

describe("filterRequests", () => {
  const open1 = makeRequest({ id: 1, status: "open" });
  const open2 = makeRequest({ id: 2, status: "open" });
  const done1 = makeRequest({ id: 3, status: "done" });
  const all = [open1, open2, done1];

  it("returns all requests when filter is 'all'", () => {
    expect(filterRequests(all, "all")).toHaveLength(3);
  });

  it("returns only open requests when filter is 'open'", () => {
    const result = filterRequests(all, "open");
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.status === "open")).toBe(true);
  });

  it("returns only done requests when filter is 'done'", () => {
    const result = filterRequests(all, "done");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(3);
  });

  it("returns empty array when list is empty", () => {
    expect(filterRequests([], "open")).toHaveLength(0);
  });

  it("returns empty array when no requests match the filter", () => {
    const onlyOpen = [open1, open2];
    expect(filterRequests(onlyOpen, "done")).toHaveLength(0);
  });
});
