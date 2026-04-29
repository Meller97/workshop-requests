# Workshop Requests

A small app for operators to submit maintenance and tooling requests, and for a lead to mark them open or done.

## Install and run

```bash
npm install
npm run dev     # starts Next.js on http://localhost:3000
```

No environment variables are required.

## Tests

```bash
npm test        # runs vitest (node environment, no browser needed)
```

The test suite has 17 tests across two files:

- `tests/logic.test.ts` — pure logic: `parseStatusFilter` and `filterRequests`
- `tests/repository.test.ts` — integration tests against an in-memory SQLite DB covering create → list → toggle → list, ordering, constraint enforcement, and FK violations

## Database

**File:** `workshop.db` in the project root. It is created automatically on first run, no migration step is needed.

**Schema initialisation and seeding** happen inside `lib/db.ts` the first time `getDb()` is called (i.e. on the first page load). The schema is created with `CREATE TABLE IF NOT EXISTS`, and the seed (three work centres: CNC Area, Assembly, Shipping) is inserted only when the `work_centers` table is empty.

The file is excluded from git via `.gitignore` since the seed runs on first boot.

## Tech choices and trade-offs

| Choice | Reason |
|--------|--------|
| **better-sqlite3** | Synchronous API keeps the data-layer code straightforward — no async ceremony for a local SQLite file. Already in Next.js's `serverExternalPackages` auto-opt-out list so no extra config needed. |
| **Zod** | Declarative schema + good error messages with minimal boilerplate. Used only in `lib/validation.ts`; keeps parsing separate from the action. |
| **Server Actions** | Colocates the mutation path with the UI without a separate API layer. Suitable for a small local-only app. `revalidatePath("/")` keeps the list fresh after each mutation. |
| **No global state / no client-side fetching** | The page is a server component that reads directly from SQLite. The filter is a URL search param (`?filter=open`), which means the list can be shared or bookmarked and works without JavaScript. |
| **Inline styles** | Avoids adding a CSS framework dependency for a plain utility UI. The spec explicitly says no design system is required. |

## Structure

```
lib/
  db.ts            — Database client singleton, schema init, seed
  repositories.ts  — SQL queries (data access only, no business rules)
  validation.ts    — Zod schema + validateCreateRequest helper
  logic.ts         — Pure functions: parseStatusFilter, filterRequests

app/
  page.tsx         — Server component: reads DB, applies filter, renders page
  actions.ts       — Server Actions: createRequestAction, toggleStatusAction
  layout.tsx       — Root layout

components/
  RequestForm.tsx  — Client component (useActionState for validation feedback)
  RequestList.tsx  — Server component (renders list with ToggleButton per item)
  ToggleButton.tsx — Client component (useActionState for toggle)
  FilterTabs.tsx   — Client component (reads searchParams via useSearchParams)

tests/
  logic.test.ts      — Unit tests for pure logic
  repository.test.ts — Integration tests against in-memory SQLite
```

## Status constraint

`status` is enforced at three levels:
1. **DB CHECK constraint**: `CHECK(status IN ('open', 'done'))` — the DB will reject any other value.
2. **TypeScript union type**: `"open" | "done"` in `lib/repositories.ts`.
3. **Logic**: new requests are always inserted as `'open'` (hardcoded in the `INSERT`); the toggle computes the next value deterministically.

## Assumptions

- The app is local-only and does not handle authentication or multiple users.
- A single SQLite database file is sufficient for this small-scale application.
- The `note` field is optional and may be omitted when creating a request.

## What I would improve with more time

- Improve user experience by adding optimistic UI updates when toggling request status.
- Add pagination or list virtualization to handle larger datasets efficiently.
- Introduce a more structured database initialization approach instead of running schema creation on boot.
- Expand test coverage, including higher-level integration or end-to-end tests.
- Improve error handling to provide clearer user feedback for unexpected failures.
