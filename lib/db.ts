import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "workshop.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  initSchema(_db);
  return _db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS work_centers (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS requests (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      work_center_id INTEGER NOT NULL REFERENCES work_centers(id),
      title          TEXT NOT NULL CHECK(length(title) <= 120),
      note           TEXT,
      status         TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'done')),
      created_at     TEXT NOT NULL
    );
  `);

  const count = (
    db.prepare("SELECT COUNT(*) AS n FROM work_centers").get() as { n: number }
  ).n;

  if (count === 0) {
    const insert = db.prepare("INSERT INTO work_centers (name) VALUES (?)");
    const seedAll = db.transaction(() => {
      insert.run("CNC Area");
      insert.run("Assembly");
      insert.run("Shipping");
    });
    seedAll();
  }
}
