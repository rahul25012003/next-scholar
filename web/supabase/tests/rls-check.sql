-- Verifies the RLS policies in ../migrations/0002_rls.sql actually enforce
-- the permission matrix in src/domain/rbac.ts, by simulating each role via
-- the same session variables the application sets, running as a real
-- non-superuser role. RLS is not enforced against a superuser or a table's
-- owner, which would make every check below pass trivially and prove
-- nothing, so this creates a throwaway role for the duration of the check.
--
-- Run against a scratch database, after applying the three migration files
-- and ../tests/fixtures.sql, in that order:
--
--   docker run -d --name pg-rls-check -e POSTGRES_PASSWORD=x -p 54329:5432 postgres:16-alpine
--   for f in migrations/0001_schema.sql migrations/0002_rls.sql migrations/0003_functions.sql tests/fixtures.sql tests/rls-check.sql; do
--     cat "$f" | docker exec -i pg-rls-check psql -U postgres
--   done
--   docker rm -f pg-rls-check
--
-- Every result below was checked by hand against what src/domain/rbac.ts's
-- `can` and `visibleCases` say should happen, the last time this file ran.

create role app_rls_test nosuperuser noinherit login;
grant usage on schema public, app to app_rls_test;
grant select, update on public.cases to app_rls_test;
grant select on public.users, public.consents, public.channel_consents,
  public.communications, public.extractions, public.notifications, public.audit_log
  to app_rls_test;

\c - app_rls_test

\echo '--- Student A: should see exactly case-a ---'
select set_config('app.actor_id', 'user-student-a', false);
select set_config('app.actor_role', 'student', false);
select id from public.cases order by id;

\echo '--- Student A: should NOT be able to read case-b directly ---'
select id from public.cases where id = 'case-b';

\echo '--- Student A: communications on case-a, only the visible one ---'
select id, student_visible from public.communications where case_id = 'case-a' order by id;

\echo '--- Counselor A: should see exactly case-a (their own), not case-b ---'
select set_config('app.actor_id', 'user-counselor-a', false);
select set_config('app.actor_role', 'counselor', false);
select id from public.cases order by id;

\echo '--- Counselor A: communications on case-a, BOTH rows (staff sees internal too) ---'
select id, student_visible from public.communications where case_id = 'case-a' order by id;

\echo '--- Counselor B: should see exactly case-b, not case-a ---'
select set_config('app.actor_id', 'user-counselor-b', false);
select set_config('app.actor_role', 'counselor', false);
select id from public.cases order by id;

\echo '--- Manager: should see both cases ---'
select set_config('app.actor_id', 'user-manager', false);
select set_config('app.actor_role', 'manager', false);
select id from public.cases order by id;

\echo '--- Founder: should see both cases, and the audit log ---'
select set_config('app.actor_id', 'user-founder', false);
select set_config('app.actor_role', 'founder', false);
select id from public.cases order by id;
select count(*) as audit_rows_visible_to_founder from public.audit_log;

\echo '--- Manager: audit log should be invisible (founder only) ---'
select set_config('app.actor_id', 'user-manager', false);
select set_config('app.actor_role', 'manager', false);
select count(*) as audit_rows_visible_to_manager from public.audit_log;

\echo '--- Counselor A attempting to UPDATE case-b (not theirs): should affect 0 rows ---'
select set_config('app.actor_id', 'user-counselor-a', false);
select set_config('app.actor_role', 'counselor', false);
update public.cases set priority = 'Urgent' where id = 'case-b';

\echo '--- Counselor A attempting to UPDATE case-a (theirs): should affect 1 row ---'
update public.cases set priority = 'High' where id = 'case-a';

\echo '--- Student attempting to UPDATE their own case: should affect 0 rows (students never write cases) ---'
select set_config('app.actor_id', 'user-student-a', false);
select set_config('app.actor_role', 'student', false);
update public.cases set priority = 'Urgent' where id = 'case-a';

\echo '--- No actor set at all (e.g. a forgotten set_config): should see nothing ---'
reset app.actor_id;
reset app.actor_role;
select count(*) as cases_visible_with_no_actor_set from public.cases;

\c - postgres

revoke all on all tables in schema public from app_rls_test;
revoke all on schema public, app from app_rls_test;
drop role app_rls_test;
