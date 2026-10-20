-- 20261020000100_briefing_core.sql
-- Núcleo de dados do briefing operacional da Master Chapeação (SPEC-073).
-- Schema: public | Bucket: master-briefing-private
-- Aplicação: SQL Editor do Supabase ou `supabase db push` (projeto de destino).
-- Rollback: ver supabase/rollback/20261020000100_briefing_core.down.sql

-- =========================================================================
-- 1. Tipos enumerados
-- =========================================================================

do $$
begin
  create type public.briefing_status as enum (
    'draft',
    'submitted',
    'in_review',
    'awaiting_information',
    'completed'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.profile_role as enum ('client', 'admin');
exception
  when duplicate_object then null;
end
$$;

-- =========================================================================
-- 2. Funções auxiliares
-- =========================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Verifica o papel do usuário autenticado sem permitir escalada de privilégio:
-- a função é security definer, mas lê apenas profiles.id = auth.uid().
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- =========================================================================
-- 3. Tabelas
-- =========================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role public.profile_role not null default 'client',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.briefings (
  id uuid primary key default gen_random_uuid(),
  company_name text not null default '',
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  status public.briefing_status not null default 'draft',
  client_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  completed_at timestamptz
);

create table if not exists public.briefing_answers (
  id uuid primary key default gen_random_uuid(),
  briefing_id uuid not null references public.briefings(id) on delete cascade,
  section_key text not null,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint briefing_answers_unique_section unique (briefing_id, section_key),
  constraint briefing_answers_section_key_check check (
    section_key in (
      'company_identification',
      'services',
      'facility',
      'equipment',
      'team',
      'operations',
      'capacity',
      'quality',
      'compliance',
      'technology',
      'suppliers',
      'accreditation_interest',
      'portfolio',
      'website_content',
      'observations'
    )
  )
);

create table if not exists public.briefing_files (
  id uuid primary key default gen_random_uuid(),
  briefing_id uuid not null references public.briefings(id) on delete cascade,
  uploaded_by uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  category text not null default 'geral',
  created_at timestamptz not null default now(),
  constraint briefing_files_storage_path_unique unique (storage_path)
);

create table if not exists public.briefing_activity (
  id uuid primary key default gen_random_uuid(),
  briefing_id uuid not null references public.briefings(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists briefings_owner_updated_idx
  on public.briefings (owner_user_id, updated_at desc);
create index if not exists briefings_status_idx on public.briefings (status);
create index if not exists briefings_created_idx on public.briefings (created_at desc);
create index if not exists briefing_answers_briefing_idx
  on public.briefing_answers (briefing_id);
create index if not exists briefing_files_briefing_idx
  on public.briefing_files (briefing_id);
create index if not exists briefing_activity_briefing_idx
  on public.briefing_activity (briefing_id, created_at desc);

-- =========================================================================
-- 4. Gatilhos
-- =========================================================================

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- O cliente não pode elevar o próprio papel: a alteração de role exige
-- que quem executa já seja administrador.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Alteração de papel não permitida' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

drop trigger if exists briefings_set_updated_at on public.briefings;
create trigger briefings_set_updated_at
  before update on public.briefings
  for each row execute function public.set_updated_at();

-- Transições de status controladas no banco, independentemente da interface.
create or replace function public.enforce_briefing_status_transition()
returns trigger
language plpgsql
as $$
declare
  caller_is_admin boolean := public.is_admin();
begin
  if new.owner_user_id is distinct from old.owner_user_id and not caller_is_admin then
    raise exception 'Propriedade do briefing não pode ser alterada' using errcode = '42501';
  end if;

  if new.status is not distinct from old.status then
    return new;
  end if;

  if caller_is_admin then
    if not (
      (old.status = 'draft' and new.status in ('submitted', 'awaiting_information')) or
      (old.status = 'submitted' and new.status in ('in_review', 'awaiting_information')) or
      (old.status = 'in_review' and new.status in ('awaiting_information', 'completed')) or
      (old.status = 'awaiting_information' and new.status in ('draft', 'in_review'))
    ) then
      raise exception 'Transição de status inválida: % -> %', old.status, new.status
        using errcode = '23514';
    end if;
  else
    if not (
      (old.status = 'draft' and new.status = 'submitted') or
      (old.status = 'awaiting_information' and new.status = 'draft')
    ) then
      raise exception 'Transição de status inválida: % -> %', old.status, new.status
        using errcode = '23514';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists briefings_enforce_status on public.briefings;
create trigger briefings_enforce_status
  before update on public.briefings
  for each row execute function public.enforce_briefing_status_transition();

-- Provisiona o perfil com papel padrão "client" para cada novo usuário.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      nullif(split_part(coalesce(new.email, ''), '@', 1), '')
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- 5. Row Level Security
-- =========================================================================

alter table public.profiles enable row level security;
alter table public.briefings enable row level security;
alter table public.briefing_answers enable row level security;
alter table public.briefing_files enable row level security;
alter table public.briefing_activity enable row level security;

-- profiles -----------------------------------------------------------------
drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
  on public.profiles for insert to authenticated
  with check (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- briefings ----------------------------------------------------------------
drop policy if exists briefings_select_own_or_admin on public.briefings;
create policy briefings_select_own_or_admin
  on public.briefings for select to authenticated
  using (owner_user_id = auth.uid() or public.is_admin());

drop policy if exists briefings_insert_own on public.briefings;
create policy briefings_insert_own
  on public.briefings for insert to authenticated
  with check (owner_user_id = auth.uid());

drop policy if exists briefings_update_own_or_admin on public.briefings;
create policy briefings_update_own_or_admin
  on public.briefings for update to authenticated
  using (owner_user_id = auth.uid() or public.is_admin())
  with check (owner_user_id = auth.uid() or public.is_admin());

drop policy if exists briefings_delete_own_draft_or_admin on public.briefings;
create policy briefings_delete_own_draft_or_admin
  on public.briefings for delete to authenticated
  using ((owner_user_id = auth.uid() and status = 'draft') or public.is_admin());

-- briefing_answers ---------------------------------------------------------
drop policy if exists briefing_answers_select_own_or_admin on public.briefing_answers;
create policy briefing_answers_select_own_or_admin
  on public.briefing_answers for select to authenticated
  using (
    exists (
      select 1 from public.briefings b
      where b.id = briefing_id
        and (b.owner_user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists briefing_answers_write_own_or_admin on public.briefing_answers;
create policy briefing_answers_write_own_or_admin
  on public.briefing_answers for insert to authenticated
  with check (
    exists (
      select 1 from public.briefings b
      where b.id = briefing_id
        and (
          public.is_admin()
          or (b.owner_user_id = auth.uid() and b.status = 'draft')
        )
    )
  );

drop policy if exists briefing_answers_update_own_or_admin on public.briefing_answers;
create policy briefing_answers_update_own_or_admin
  on public.briefing_answers for update to authenticated
  using (
    exists (
      select 1 from public.briefings b
      where b.id = briefing_id
        and (
          public.is_admin()
          or (b.owner_user_id = auth.uid() and b.status = 'draft')
        )
    )
  )
  with check (
    exists (
      select 1 from public.briefings b
      where b.id = briefing_id
        and (
          public.is_admin()
          or (b.owner_user_id = auth.uid() and b.status = 'draft')
        )
    )
  );

drop policy if exists briefing_answers_delete_own_or_admin on public.briefing_answers;
create policy briefing_answers_delete_own_or_admin
  on public.briefing_answers for delete to authenticated
  using (
    exists (
      select 1 from public.briefings b
      where b.id = briefing_id
        and (b.owner_user_id = auth.uid() or public.is_admin())
    )
  );

-- briefing_files -----------------------------------------------------------
drop policy if exists briefing_files_select_own_or_admin on public.briefing_files;
create policy briefing_files_select_own_or_admin
  on public.briefing_files for select to authenticated
  using (
    exists (
      select 1 from public.briefings b
      where b.id = briefing_id
        and (b.owner_user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists briefing_files_insert_own on public.briefing_files;
create policy briefing_files_insert_own
  on public.briefing_files for insert to authenticated
  with check (
    uploaded_by = auth.uid()
    and storage_path like auth.uid()::text || '/%'
    and exists (
      select 1 from public.briefings b
      where b.id = briefing_id
        and (b.owner_user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists briefing_files_delete_own_or_admin on public.briefing_files;
create policy briefing_files_delete_own_or_admin
  on public.briefing_files for delete to authenticated
  using (
    exists (
      select 1 from public.briefings b
      where b.id = briefing_id
        and (b.owner_user_id = auth.uid() or public.is_admin())
    )
  );

-- briefing_activity --------------------------------------------------------
drop policy if exists briefing_activity_select_admin on public.briefing_activity;
create policy briefing_activity_select_admin
  on public.briefing_activity for select to authenticated
  using (public.is_admin());

-- A auditoria é gravada apenas por função controlada: o cliente não insere
-- nem altera metadados de auditoria.
drop policy if exists briefing_activity_insert_client on public.briefing_activity;

-- =========================================================================
-- 6. Registro de atividade (função controlada)
-- =========================================================================

create or replace function public.log_briefing_activity(
  p_briefing_id uuid,
  p_action text,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.briefings%rowtype;
  caller_is_admin boolean := public.is_admin();
begin
  select * into target from public.briefings where id = p_briefing_id;

  if not found then
    raise exception 'Briefing não encontrado' using errcode = 'P0002';
  end if;

  if not caller_is_admin then
    if target.owner_user_id <> auth.uid() then
      raise exception 'Acesso negado' using errcode = '42501';
    end if;
    if p_action not in (
      'briefing_created',
      'section_saved',
      'submitted',
      'file_uploaded',
      'file_removed'
    ) then
      raise exception 'Ação de auditoria não permitida' using errcode = '42501';
    end if;
  end if;

  insert into public.briefing_activity (briefing_id, actor_user_id, action, metadata)
  values (
    p_briefing_id,
    auth.uid(),
    p_action,
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

revoke all on function public.log_briefing_activity(uuid, text, jsonb) from public, anon;
grant execute on function public.log_briefing_activity(uuid, text, jsonb) to authenticated;

-- =========================================================================
-- 7. Storage privado
-- =========================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'master-briefing-private',
  'master-briefing-private',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists briefing_storage_select_own_or_admin on storage.objects;
create policy briefing_storage_select_own_or_admin
  on storage.objects for select to authenticated
  using (
    bucket_id = 'master-briefing-private'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

drop policy if exists briefing_storage_insert_own on storage.objects;
create policy briefing_storage_insert_own
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'master-briefing-private'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists briefing_storage_update_own_or_admin on storage.objects;
create policy briefing_storage_update_own_or_admin
  on storage.objects for update to authenticated
  using (
    bucket_id = 'master-briefing-private'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  )
  with check (
    bucket_id = 'master-briefing-private'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists briefing_storage_delete_own_or_admin on storage.objects;
create policy briefing_storage_delete_own_or_admin
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'master-briefing-private'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );
