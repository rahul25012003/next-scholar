-- Next Scholar: the durable store, replacing the in-memory arrays in
-- src/data/store.ts and src/data/users.ts.
--
-- What is normalized versus what is JSONB is a deliberate line, not laziness:
-- documents, applications, deadlines, tasks, the case log and the student
-- profile only ever move with their parent case (nothing in this app queries
-- "every document across every case" independently of a case), so they are
-- JSONB columns on `cases`. That also means they inherit `cases`' RLS for
-- free instead of needing their own policies to get right. Consents, channel
-- consents, communications, extractions and notifications are each already
-- independent arrays with their own natural key in the in-memory model and
-- their own lifecycle, so they get real tables. The audit log is a real
-- table for the same reason plus one more: 1.09 asks for it to be durable,
-- paginated and retained on its own schedule, independent of any case.
--
-- Auth stays custom (scrypt password hashes, HMAC-signed session cookies in
-- src/domain/auth.ts) rather than moving to Supabase's own auth.users /
-- GoTrue. That file's own comment says why: "What is temporary is where the
-- users live, not how they are checked." `public.users` is a plain table,
-- not `auth.users`.
--
-- RLS policies in 0002_rls.sql are defense-in-depth, not the only gate. The
-- application's own permission matrix (src/domain/rbac.ts) remains the
-- primary check, run before any query reaches this database, and the Next.js
-- server continues to use the service-role key (which bypasses RLS) for the
-- same reason the build spec asks the two to mirror each other rather than
-- one replacing the other: a bug in one should not be a bug in both.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------------

create table public.users (
  id text primary key,
  email text not null unique,
  name text not null,
  role text not null check (role in ('student', 'counselor', 'manager', 'founder')),
  password_hash text not null,
  case_id text,
  created_at timestamptz not null default now(),
  onboarding jsonb,
  shortlist text[] not null default '{}'
);

create index users_email_idx on public.users (email);
create index users_case_id_idx on public.users (case_id) where case_id is not null;

comment on column public.users.password_hash is
  'scrypt, salt:derivedKey, both hex. Produced by hashPassword() in src/domain/auth.ts. Never a plain password.';
comment on column public.users.case_id is
  'Set for students: the one case this account may read. References cases.id, not enforced as a foreign key because a student account can exist before its case does.';

-- ---------------------------------------------------------------------------
-- Cases
-- ---------------------------------------------------------------------------

create table public.cases (
  id text primary key,
  name text not null,
  destination text not null,
  route text,
  intake text not null,
  -- The single source of truth for who owns this case, superseding the
  -- separate, never-updated assignedCaseIds array the in-memory Actor type
  -- carried on the user record. Reassignment now means updating this one
  -- column, and visibility for a counselor is a straight equality check
  -- against it instead of an array membership test that nothing kept current.
  counselor_id text not null references public.users (id),
  budget_inr integer,
  profile jsonb not null default '{}'::jsonb,
  stage text not null,
  stage_updated_at timestamptz not null default now(),
  priority text not null check (priority in ('Normal', 'High', 'Urgent')),
  summary text,
  summary_source text check (summary_source in ('human', 'ai', 'system')),
  suggested_action text,
  suggested_action_source text check (suggested_action_source in ('human', 'ai', 'system')),
  last_student_contact_at timestamptz,
  last_counselor_reply_at timestamptz,
  deadlines jsonb not null default '[]'::jsonb,
  tasks jsonb not null default '[]'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  applications jsonb not null default '[]'::jsonb,
  visa jsonb not null default '{"state": "not-started", "note": null, "decidedOn": null}'::jsonb,
  log jsonb not null default '[]'::jsonb,
  closed_at timestamptz,
  needs_manual_review jsonb,
  synthetic boolean not null default false
);

create index cases_counselor_id_idx on public.cases (counselor_id);
create index cases_stage_idx on public.cases (stage);

comment on column public.cases.profile is
  'degree, percentage, graduationYear, languageTests[], recognition. Never queried independently of its case.';
comment on column public.cases.synthetic is
  'Marks fixture data. The application refuses to serve rows where this is true unless NEXT_SCHOLAR_DEMO_DATA=true, mirroring storeMode() in data/store.ts.';

alter table public.users
  add constraint users_case_id_fkey foreign key (case_id) references public.cases (id) deferrable initially deferred;

-- ---------------------------------------------------------------------------
-- Consents (document-category consent) and channel consents
-- ---------------------------------------------------------------------------

create table public.consents (
  id text primary key,
  case_id text not null references public.cases (id) on delete cascade,
  category text not null,
  purpose text not null,
  shared_with text[] not null default '{}',
  granted_at timestamptz not null default now(),
  granted_by text not null,
  withdrawn_at timestamptz
);

create index consents_case_id_idx on public.consents (case_id);

create table public.channel_consents (
  id text primary key,
  case_id text not null references public.cases (id) on delete cascade,
  channel text not null check (channel in ('whatsapp', 'email')),
  granted_at timestamptz not null default now(),
  granted_by text not null,
  withdrawn_at timestamptz
);

create index channel_consents_case_id_idx on public.channel_consents (case_id);

-- ---------------------------------------------------------------------------
-- Communications
-- ---------------------------------------------------------------------------

create table public.communications (
  id text primary key,
  case_id text not null references public.cases (id) on delete cascade,
  channel text not null check (channel in ('email', 'whatsapp', 'call', 'portal')),
  direction text not null check (direction in ('inbound', 'outbound')),
  occurred_at timestamptz not null default now(),
  participants text not null,
  raw text not null,
  summary text,
  summary_source text check (summary_source in ('human', 'ai', 'system')),
  student_visible boolean not null default false
);

create index communications_case_id_idx on public.communications (case_id);

-- ---------------------------------------------------------------------------
-- Document Intelligence staging
-- ---------------------------------------------------------------------------

create table public.extractions (
  document_id text primary key,
  case_id text not null references public.cases (id) on delete cascade,
  extracted_at timestamptz not null default now(),
  fields jsonb not null default '[]'::jsonb,
  note text not null default '',
  unreadable boolean not null default false
);

create index extractions_case_id_idx on public.extractions (case_id);

comment on column public.extractions.fields is
  'StagedField[]: name, value, confidence, state, decidedBy, decidedAt, source. A field only becomes authoritative once state = confirmed, set by decideExtractedField(), never by the agent that proposed it.';

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------

create table public.notifications (
  id text primary key,
  event_key text not null,
  case_id text not null references public.cases (id) on delete cascade,
  type text not null,
  priority text not null check (priority in ('Normal', 'High', 'Urgent')),
  channel text not null check (channel in ('in_app', 'email', 'whatsapp', 'counselor_alert', 'manager_escalation')),
  delivery_status text not null check (delivery_status in ('queued', 'sent', 'delivered', 'failed', 'retried')),
  body text not null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index notifications_case_id_idx on public.notifications (case_id);
create index notifications_open_idx on public.notifications (case_id) where resolved_at is null;

-- ---------------------------------------------------------------------------
-- Audit log (1.09): durable, paginated, retention-aware
-- ---------------------------------------------------------------------------

create table public.audit_log (
  id bigint generated always as identity primary key,
  ts timestamptz not null default now(),
  actor_id text not null,
  actor_name text not null,
  actor_role text not null,
  action text not null,
  subject_type text not null check (subject_type in ('case', 'document', 'consent', 'commission', 'report')),
  subject_id text not null,
  field text,
  before_value text,
  after_value text,
  note text
);

-- The two access patterns the application actually uses: "everything for one
-- subject, newest first" (auditFor) and "the most recent N, newest first"
-- (recentAudit). Both are covered by one descending index on ts.
create index audit_log_ts_idx on public.audit_log (ts desc);
create index audit_log_subject_idx on public.audit_log (subject_id, ts desc);

comment on table public.audit_log is
  'Every read and write of a sensitive field, who did it, when, what changed. Append-only from the application: nothing here is ever updated, only inserted. Retention (how long a row survives) is a policy decision for src/domain/retention.ts to enforce via a scheduled delete, not yet wired up here.';
