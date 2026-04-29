import { describe, it, expect, beforeEach } from "vitest";
import Database from "better-sqlite3";
import {
  getWorkCenters,
  getRequests,
  createRequest,
  toggleRequestStatus,
} from "@/lib/repositories";

function createTestDb(): Database.Database {
  const db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE work_centers (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE requests (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      work_center_id INTEGER NOT NULL REFERENCES work_centers(id),
      title          TEXT NOT NULL CHECK(length(title) <= 120),
      note           TEXT,
      status         TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'done')),
      created_at     TEXT NOT NULL
    );
  `);

  db.prepare("INSERT INTO work_centers (name) VALUES (?)").run("CNC Area");
  db.prepare("INSERT INTO work_centers (name) VALUES (?)").run("Assembly");

  return db;
}

describe("repository — data persistence", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it("getWorkCenters returns seeded work centers", () => {
    const wcs = getWorkCenters(db);
    expect(wcs.length).toBe(2);
    expect(wcs.map((w) => w.name)).toContain("CNC Area");
  });

  it("create → list: new request appears in list with correct data", () => {
    createRequest(db, { work_center_id: 1, title: "Fix machine", note: null });
    const requests = getRequests(db);

    expect(requests).toHaveLength(1);
    expect(requests[0].title).toBe("Fix machine");
    expect(requests[0].status).toBe("open");
    expect(requests[0].work_center_name).toBe("CNC Area");
  });

  it("create → toggle → list: status flips from open to done", () => {
    const created = createRequest(db, {
      work_center_id: 1,
      title: "Replace belt",
      note: "Urgent",
    });

    expect(created.status).toBe("open");

    toggleRequestStatus(db, created.id);
    const after = getRequests(db);

    expect(after[0].status).toBe("done");
  });

  it("toggle twice returns request to open", () => {
    const created = createRequest(db, {
      work_center_id: 1,
      title: "Calibrate sensor",
      note: null,
    });

    toggleRequestStatus(db, created.id);
    toggleRequestStatus(db, created.id);

    const requests = getRequests(db);
    expect(requests[0].status).toBe("open");
  });

  it("getRequests returns results newest first", () => {
    createRequest(db, { work_center_id: 1, title: "First", note: null });
    // small delay to ensure different created_at
    const later = new Date(Date.now() + 1000).toISOString();
    db.prepare(
      `INSERT INTO requests (work_center_id, title, note, status, created_at)
       VALUES (?, ?, ?, 'open', ?)`
    ).run(1, "Second", null, later);

    const requests = getRequests(db);
    expect(requests[0].title).toBe("Second");
    expect(requests[1].title).toBe("First");
  });

  it("rejects title longer than 120 characters", () => {
    const longTitle = "x".repeat(121);
    expect(() =>
      createRequest(db, { work_center_id: 1, title: longTitle, note: null })
    ).toThrow();
  });

  it("rejects invalid work_center_id (foreign key)", () => {
    expect(() =>
      createRequest(db, { work_center_id: 999, title: "Orphan", note: null })
    ).toThrow();
  });

  it("toggleRequestStatus returns undefined for non-existent id", () => {
    const result = toggleRequestStatus(db, 999);
    expect(result).toBeUndefined();
  });
});
