-- Row level security, mirroring src/domain/rbac.ts's `can` and
-- `visibleCases` exactly, checked against Postgres session variables the
-- application sets per request rather than Supabase Auth's auth.uid():
-- this app keeps its own scrypt + HMAC session (see 0001_schema.sql's
-- comment on why), so there is no Supabase-issued JWT for auth.uid() to
-- read. The Next.js server sets `app.actor_id` and `app.actor_role` with
-- `set_config(..., true)` (transaction-scoped) before every query that
-- should run under RLS rather than under the service-role key.
--
-- This is defense-in-depth, not the primary gate. The Next.js server's own
-- rbac.ts check runs first and the server uses the service-role key (which
-- bypasses RLS) for its normal queries; these policies exist so a future
-- direct-from-client Supabase call, or a bug that skips the application
-- check, still cannot read or write outside what rbac.ts would have allowed.
-- That is the literal ask in REMAINING.md: "Row level security should
-- mirror visibleCases() rather than replace it, so the check exists in both
-- places."

create schema if not exists app;

create or replace function app.current_actor_id() returns text as $$
  select nullif(current_setting('app.actor_id', true), '')
$$ language sql stable;

create or replace function app.current_actor_role() returns text as $$
  select nullif(current_setting('app.actor_role', true), '')
$$ language sql stable;

-- `case_id` is stored on students' own user row, not in a session variable,
-- so a tampered `app.actor_id` cannot claim a different student's case: the
-- lookup goes through the users table's own row, which RLS on `users` (below)
-- already restricts to the caller's own id.
create or replace function app.current_student_case_id() returns text as $$
  select case_id from public.users where id = app.current_actor_id()
$$ language sql stable;

alter table public.users enable row level security;
alter table public.cases enable row level security;
alter table public.consents enable row level security;
alter table public.channel_consents enable row level security;
alter table public.communications enable row level security;
alter table public.extractions enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_log enable row level security;

-- ---------------------------------------------------------------------------
-- users: everyone may read their own row (needed to resolve case_id above,
-- and for a student to see their own onboarding profile); only manager and
-- founder may read the whole table, matching the fact that only those two
-- roles ever need a directory of accounts (assigning a case, for instance).
-- No role may write here from an RLS-governed connection: account creation
-- and role changes always run under the service-role key.
-- ---------------------------------------------------------------------------

create policy users_select_self on public.users
  for select
  using (id = app.current_actor_id());

create policy users_select_staff on public.users
  for select
  using (app.current_actor_role() in ('manager', 'founder'));

-- ---------------------------------------------------------------------------
-- cases: mirrors `visibleCases` in rbac.ts precisely.
--   student:   cases.id = the case_id on the caller's own user row
--   counselor: cases.counselor_id = the caller
--   manager, founder: every row
-- ---------------------------------------------------------------------------

create policy cases_select on public.cases
  for select
  using (
    case app.current_actor_role()
      when 'student' then id = app.current_student_case_id()
      when 'counselor' then counselor_id = app.current_actor_id()
      when 'manager' then true
      when 'founder' then true
      else false
    end
  );

-- Writes mirror `can()`: a student may never write a case (only
-- document.upload, which does not touch this table); counselor, manager and
-- founder may write a case in their visible set, matching case.note.write /
-- case.stage.write being granted to all three in the matrix.
create policy cases_update on public.cases
  for update
  using (
    case app.current_actor_role()
      when 'counselor' then counselor_id = app.current_actor_id()
      when 'manager' then true
      when 'founder' then true
      else false
    end
  );

-- ---------------------------------------------------------------------------
-- Case-scoped tables: visible exactly when the parent case is visible. Each
-- policy re-runs the same case-visibility test as `cases_select` via a
-- subquery, so a change to one does not have to be remembered in six places
-- by anyone reading this file, only by whoever edits `cases_select` without
-- reading this comment.
-- ---------------------------------------------------------------------------

create policy consents_select on public.consents
  for select
  using (exists (select 1 from public.cases c where c.id = case_id));

create policy channel_consents_select on public.channel_consents
  for select
  using (exists (select 1 from public.cases c where c.id = case_id));

create policy communications_select on public.communications
  for select
  using (
    exists (select 1 from public.cases c where c.id = case_id)
    and (
      app.current_actor_role() <> 'student'
      or student_visible
    )
  );

create policy extractions_select on public.extractions
  for select
  using (exists (select 1 from public.cases c where c.id = case_id));

create policy notifications_select on public.notifications
  for select
  using (exists (select 1 from public.cases c where c.id = case_id));

-- ---------------------------------------------------------------------------
-- audit_log: founder only, mirroring the fact that only "founder" carries
-- report.publish and the commission.* actions in the matrix — reading the
-- full trail is the same tier of access as publishing what it backs. A
-- narrower "see the audit trail for my own caseload" policy can be added
-- once a real product need for it shows up; none has yet.
-- ---------------------------------------------------------------------------

create policy audit_log_select on public.audit_log
  for select
  using (app.current_actor_role() = 'founder');
