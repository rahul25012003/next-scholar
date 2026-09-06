# The database

Items 1.07–1.09 from `docs/REMAINING.md`. This is the whole migration: apply
these three files to a real Supabase project, in order, then set
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`, and
`src/data/store.ts` / `src/data/users.ts` switch from the in-memory fixtures
to this schema on the next request. Nothing else changes.

```
migrations/0001_schema.sql   # tables
migrations/0002_rls.sql      # row level security, defense in depth
migrations/0003_functions.sql # one atomic function (shortlist toggle)
```

## Why row level security if the app already checks permissions

It does, in `src/domain/rbac.ts`, and that check still runs first: the
Next.js server uses the service role key, which bypasses RLS, so these
policies are not what stands between a request and the data today. They
exist for the access path that does not go through `rbac.ts` — a future
client-side Supabase call, a bug that skips the check, someone with a psql
prompt — so that a mistake there is not also a data leak. `0002_rls.sql`'s
own header comment says this in more words; `docs/REMAINING.md`'s note on
this item says it too: "mirror `visibleCases()` rather than replace it, so
the check exists in both places."

The policies read `app.actor_id` / `app.actor_role`, not Supabase's own
`auth.uid()`, because this application keeps its own session mechanism
(scrypt password hashes, HMAC-signed cookies, in `src/domain/auth.ts`)
rather than Supabase's GoTrue auth — that file's own comment explains why.
There is no Supabase-issued JWT for `auth.uid()` to read. The service-role
connection this app actually uses does not set those variables and does not
need to, since it bypasses RLS entirely; they matter only for testing the
policies themselves and for whatever future access path needs them for real.

## Verifying the policies actually work

Don't take the SQL on faith. `tests/rls-check.sql` seeds two students, two
counsellors, a manager and a founder (`tests/fixtures.sql`), then runs as a
real non-superuser Postgres role — RLS is not enforced against a superuser
or a table's owner, so testing as either would pass trivially and prove
nothing — simulating each role in turn and asserting what it can and cannot
see or write. Every assertion in that file was checked by hand against
`src/domain/rbac.ts`'s `can` and `visibleCases` the last time it ran, using:

```bash
docker run -d --name pg-rls-check -e POSTGRES_PASSWORD=x -p 54329:5432 postgres:16-alpine
for f in migrations/0001_schema.sql migrations/0002_rls.sql migrations/0003_functions.sql tests/fixtures.sql tests/rls-check.sql; do
  cat "$f" | docker exec -i pg-rls-check psql -U postgres
done
docker rm -f pg-rls-check
```

Re-run this after editing any policy, before trusting it. The last full run
found what it should have on every one of eleven assertions: each role sees
exactly its own visible set, a student's internal-only communications stay
hidden from the student, only the founder role can read `audit_log`, a
counsellor's `UPDATE` on a case that is not theirs affects zero rows, a
student's `UPDATE` on their own case affects zero rows (students never write
a case, only read it and upload documents), and — the fail-closed check that
matters most — a connection with no actor context set at all sees nothing.

## What is deliberately not here

- **Supabase Auth.** Kept out on purpose; see above.
- **A normalized table per nested array.** `documents`, `applications`,
  `deadlines`, `tasks`, the case `log`, and the student `profile` are JSONB
  columns on `cases`, not their own tables. Nothing in this application
  queries, for instance, every document across every case independently of
  a case, so normalizing them would triple the schema for no real query this
  app makes, and they inherit `cases`' RLS for free as a column rather than
  needing their own policy to get right.
- **Retention deletion (2.10).** `src/domain/retention.ts` computes the
  clock; `src/data/store.ts`'s `enforceRetention()` now deletes on it, wired
  into the daily `/api/sweep`, exactly the separate piece of work layered on
  top of this schema that this note originally called for, not part of the
  schema itself. `audit_log` stays append-only from the application by
  design: that job does not prune it, a stated, separate gap.
- **Commission change history (2.09).** Needs its own table once this one is
  live; not attempted here since it was explicitly listed as following 1.07–1.09
  rather than part of them.
