create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) <= 80),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  created_at timestamptz not null default now()
);
create unique index categories_owner_name_key on public.categories (owner_id, lower(name));

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 40)
);
create unique index tags_owner_name_key on public.tags (owner_id, lower(name));

create table public.prompts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  description text check (description is null or char_length(description) <= 500),
  content text not null check (char_length(content) between 1 and 100000),
  category_id uuid references public.categories(id) on delete set null,
  visibility text not null default 'private' check (visibility in ('private', 'link')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, ''))
  ) stored
);
create index prompts_owner_updated_idx on public.prompts (owner_id, updated_at desc);
create index prompts_category_idx on public.prompts (category_id);
create index prompts_search_idx on public.prompts using gin (search_vector);
create trigger prompts_set_updated_at before update on public.prompts
  for each row execute function public.set_updated_at();

create table public.prompt_tags (
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (prompt_id, tag_id)
);
create index prompt_tags_tag_idx on public.prompt_tags (tag_id);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 100),
  description text check (description is null or char_length(description) <= 500),
  visibility text not null default 'private' check (visibility in ('private', 'link')),
  last_accessed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index collections_owner_idx on public.collections (owner_id, updated_at desc);
create trigger collections_set_updated_at before update on public.collections
  for each row execute function public.set_updated_at();

create table public.collection_prompts (
  collection_id uuid not null references public.collections(id) on delete cascade,
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  position integer not null default 0,
  primary key (collection_id, prompt_id)
);
create index collection_prompts_order_idx on public.collection_prompts (collection_id, position);
create index collection_prompts_prompt_idx on public.collection_prompts (prompt_id);

create table public.prompt_shares (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  access_token text not null unique
    default (replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')),
  permission text not null default 'read' check (permission in ('read')),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
create index prompt_shares_prompt_idx on public.prompt_shares (prompt_id);
create index prompt_shares_owner_idx on public.prompt_shares (owner_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1))
  );
  return new;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
