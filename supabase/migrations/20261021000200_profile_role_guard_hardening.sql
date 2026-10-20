-- 20261021000200_profile_role_guard_hardening.sql
-- Correção da elevação de privilégio em public.profiles (auditoria de segurança).
--
-- A migração anterior (20261021000100) autorizou a alteração de papel para
-- sessões privilegiadas, mas definiu a função do gatilho como `security
-- definer`. Dentro de uma função `security definer`, `current_user` é o dono
-- da função (`postgres`) e não quem executou o UPDATE. Com isso, a checagem
-- `current_user in ('postgres','supabase_admin')` era sempre verdadeira e o
-- gatilho não bloqueava nada: qualquer usuário autenticado conseguia
-- atualizar o próprio `public.profiles.role` para `admin` e passar a ler,
-- via RLS, os briefings de todos os clientes.
--
-- Esta migração:
--   1. torna a função do gatilho `security invoker`, para que `current_user`
--      reflita o papel real da sessão (authenticated, service_role, postgres);
--   2. mantém as exceções legítimas (chave de serviço, SQL Editor e
--      administrador já autenticado);
--   3. restringe a atualização de `public.profiles` à coluna `display_name`,
--      de modo que `role` não possa ser alterado pela sessão de um cliente
--      mesmo que o gatilho esteja ausente;
--   4. limita a execução de `public.is_admin()` a `authenticated` e
--      `service_role`, retirando o acesso do papel `anon`.
--
-- A aplicação da migração é manual (SQL Editor do painel do Supabase ou
-- `supabase db push` com o projeto vinculado) e está registrada como ação
-- pendente em `docs/security/remediation-plan.md`.

-- 1. Gatilho com `security invoker`: `current_user` passa a ser a sessão que
--    executa o UPDATE (authenticated, service_role ou postgres no SQL Editor).
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  caller_is_privileged boolean :=
    auth.role() in ('service_role', 'supabase_admin')
    or current_user in ('postgres', 'supabase_admin')
    or (auth.uid() is not null and public.is_admin());
begin
  if new.role is distinct from old.role and not caller_is_privileged then
    raise exception 'Alteração de papel não permitida' using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- 2. `is_admin()` é usada dentro do gatilho e pelas políticas de RLS: o papel
--    `authenticated` precisa mantê-la e o `service_role` também precisa
--    conseguir avaliá-la durante operações administrativas.
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_admin() to service_role;
revoke execute on function public.is_admin() from anon;
revoke all on function public.is_admin() from public;

-- 3. Defesa em profundidade: a sessão de um cliente só pode atualizar o nome
--    de exibição do próprio perfil. `role` fica reservado às sessões
--    privilegiadas.
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

-- 4. Verificação rápida (SQL Editor):
--      select id, role from public.profiles order by created_at;
--      update public.profiles set role = 'admin' where id = '<uuid-do-usuário>';
--    A última instrução deve falhar com 42501 quando executada pela sessão de
--    um cliente e succeed quando executada por esta migração (service_role ou
--    SQL Editor).
