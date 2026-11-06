revoke all on all tables in schema public from anon;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.prompts enable row level security;
alter table public.prompt_tags enable row level security;
alter table public.collections enable row level security;
alter table public.collection_prompts enable row level security;
alter table public.prompt_shares enable row level security;

create policy profiles_select_own on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy categories_own on public.categories for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy tags_own on public.tags for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

create policy prompts_select_own on public.prompts for select to authenticated
  using (owner_id = (select auth.uid()));
create policy prompts_insert_own on public.prompts for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and (category_id is null or exists (
      select 1 from public.categories c where c.id = category_id and c.owner_id = (select auth.uid())))
  );
create policy prompts_update_own on public.prompts for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (
    owner_id = (select auth.uid())
    and (category_id is null or exists (
      select 1 from public.categories c where c.id = category_id and c.owner_id = (select auth.uid())))
  );
create policy prompts_delete_own on public.prompts for delete to authenticated
  using (owner_id = (select auth.uid()));

create policy prompt_tags_select_own on public.prompt_tags for select to authenticated
  using (exists (select 1 from public.prompts p where p.id = prompt_id and p.owner_id = (select auth.uid())));
create policy prompt_tags_insert_own on public.prompt_tags for insert to authenticated
  with check (
    exists (select 1 from public.prompts p where p.id = prompt_id and p.owner_id = (select auth.uid()))
    and exists (select 1 from public.tags t where t.id = tag_id and t.owner_id = (select auth.uid()))
  );
create policy prompt_tags_delete_own on public.prompt_tags for delete to authenticated
  using (exists (select 1 from public.prompts p where p.id = prompt_id and p.owner_id = (select auth.uid())));

create policy collections_own on public.collections for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

create policy collection_prompts_select_own on public.collection_prompts for select to authenticated
  using (exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = (select auth.uid())));
create policy collection_prompts_insert_own on public.collection_prompts for insert to authenticated
  with check (
    exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = (select auth.uid()))
    and exists (select 1 from public.prompts p where p.id = prompt_id and p.owner_id = (select auth.uid()))
  );
create policy collection_prompts_update_own on public.collection_prompts for update to authenticated
  using (exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = (select auth.uid())));
create policy collection_prompts_delete_own on public.collection_prompts for delete to authenticated
  using (exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = (select auth.uid())));

create policy prompt_shares_select_own on public.prompt_shares for select to authenticated
  using (owner_id = (select auth.uid()));
create policy prompt_shares_insert_own on public.prompt_shares for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and exists (select 1 from public.prompts p where p.id = prompt_id and p.owner_id = (select auth.uid()))
  );
create policy prompt_shares_update_own on public.prompt_shares for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy prompt_shares_delete_own on public.prompt_shares for delete to authenticated
  using (owner_id = (select auth.uid()));
