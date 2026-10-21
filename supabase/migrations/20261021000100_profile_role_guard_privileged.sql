-- 20261021000100_profile_role_guard_privileged.sql
-- Correção do gatilho de proteção de papel (SPEC-075).
--
-- O gatilho original (`profiles_guard_role`) recusava qualquer alteração de
-- papel porque a verificação exigia que o próprio chamador já fosse admin.
-- Isso bloqueava a promoção inicial de administrador — inclusive pelo SQL
-- Editor do painel e pela chave de serviço —, tornando o procedimento
-- documentado em docs/supabase-briefing.md inexequível.
--
-- A alteração passa a ser permitida para sessões privilegiadas:
--   - administrador autenticado (auth.uid() com profiles.role = 'admin');
--   - chave de serviço do Supabase (auth.role() = 'service_role');
--   - sessão direta do SQL Editor (current_user = 'postgres'/'supabase_admin').
--
-- Nenhuma alteração de papel continua possível a partir da sessão de um
-- cliente: a tentativa é recusada com SQLSTATE 42501.

create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_is_privileged boolean :=
    public.is_admin()
    or auth.role() in ('service_role', 'supabase_admin')
    or current_user in ('postgres', 'supabase_admin');
begin
  if new.role is distinct from old.role and not caller_is_privileged then
    raise exception 'Alteração de papel não permitida' using errcode = '42501';
  end if;

  return new;
end;
$$;

-- Teste rápido da correção (opcional, execute no SQL Editor):
--   update public.profiles set role = 'admin' where id = '<uuid-do-usuário>';
--   select id, role from public.profiles where id = '<uuid-do-usuário>';
