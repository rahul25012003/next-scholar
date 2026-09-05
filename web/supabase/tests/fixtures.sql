-- Not a migration: seed data for testing the RLS policies in 0002_rls.sql
-- against a real Postgres instance. Mirrors the shape of syntheticCases.
--
-- users.case_id and cases.counselor_id reference each other, so the first
-- insert of each pair is only valid once both rows exist; users.case_id's
-- foreign key is DEFERRABLE INITIALLY DEFERRED for exactly this reason, and
-- deferred checking only applies inside one explicit transaction.

begin;

insert into public.users (id, email, name, role, password_hash, case_id) values
  ('user-founder', 'founder@example.com', 'Founder One', 'founder', 'x', null),
  ('user-manager', 'manager@example.com', 'Manager One', 'manager', 'x', null),
  ('user-counselor-a', 'counselor-a@example.com', 'Counselor A', 'counselor', 'x', null),
  ('user-counselor-b', 'counselor-b@example.com', 'Counselor B', 'counselor', 'x', null),
  ('user-student-a', 'student-a@example.com', 'Student A', 'student', 'x', 'case-a'),
  ('user-student-b', 'student-b@example.com', 'Student B', 'student', 'x', 'case-b');

insert into public.cases (id, name, destination, intake, counselor, counselor_id, stage, priority) values
  ('case-a', 'Student A', 'Germany', 'October 2027', 'Counselor A', 'user-counselor-a', 'documents', 'Normal'),
  ('case-b', 'Student B', 'Ireland', 'September 2027', 'Counselor B', 'user-counselor-b', 'shortlist', 'Normal');

insert into public.communications (id, case_id, channel, direction, participants, raw, student_visible) values
  ('comm-a-visible', 'case-a', 'portal', 'outbound', 'Counselor A', 'A visible message', true),
  ('comm-a-internal', 'case-a', 'call', 'inbound', 'Counselor A, Manager', 'An internal note', false);

insert into public.audit_log (actor_id, actor_name, actor_role, action, subject_type, subject_id) values
  ('user-counselor-a', 'Counselor A', 'counselor', 'read', 'case', 'case-a');

commit;
