-- Small server-side functions for operations that need to be atomic: a
-- read-then-write from the application would have a real, if low-stakes,
-- race under concurrent requests (two tabs toggling the same shortlist item
-- at once). Postgres's own array functions make the check-and-flip one
-- statement instead of two round trips.

create or replace function public.toggle_shortlist(p_user_id text, p_slug text)
returns text[] as $$
  update public.users
  set shortlist = case
    when p_slug = any(shortlist) then array_remove(shortlist, p_slug)
    else array_append(shortlist, p_slug)
  end
  where id = p_user_id
  returning shortlist;
$$ language sql volatile;
