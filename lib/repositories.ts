import type Database from "better-sqlite3";

export type WorkCenter = {
  id: number;
  name: string;
};

export type Request = {
  id: number;
  work_center_id: number;
  title: string;
  note: string | null;
  status: "open" | "done";
  created_at: string;
};

export type RequestWithWorkCenter = Request & {
  work_center_name: string;
};

export function getWorkCenters(db: Database.Database): WorkCenter[] {
  return db.prepare("SELECT id, name FROM work_centers ORDER BY name").all() as WorkCenter[];
}

export function getRequests(db: Database.Database): RequestWithWorkCenter[] {
  return db
    .prepare(
      `SELECT r.id, r.work_center_id, r.title, r.note, r.status, r.created_at,
              wc.name AS work_center_name
       FROM requests r
       JOIN work_centers wc ON wc.id = r.work_center_id
       ORDER BY r.created_at DESC, r.id DESC`
    )
    .all() as RequestWithWorkCenter[];
}

export type CreateRequestInput = {
  work_center_id: number;
  title: string;
  note: string | null;
};

export function createRequest(
  db: Database.Database,
  input: CreateRequestInput
): Request {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO requests (work_center_id, title, note, status, created_at)
       VALUES (?, ?, ?, 'open', ?)`
    )
    .run(input.work_center_id, input.title, input.note, now);

  return db
    .prepare("SELECT * FROM requests WHERE id = ?")
    .get(result.lastInsertRowid) as Request;
}

export function toggleRequestStatus(
  db: Database.Database,
  id: number
): Request | undefined {
  const row = db
    .prepare("SELECT * FROM requests WHERE id = ?")
    .get(id) as Request | undefined;

  if (!row) return undefined;

  const nextStatus = row.status === "open" ? "done" : "open";
  db.prepare("UPDATE requests SET status = ? WHERE id = ?").run(nextStatus, id);

  return db
    .prepare("SELECT * FROM requests WHERE id = ?")
    .get(id) as Request;
}
