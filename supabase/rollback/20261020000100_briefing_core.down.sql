-- Rollback da migração 20261020000100_briefing_core.sql
-- Uso: aplicar somente em ambiente de desenvolvimento ou após backup.
-- Atenção: apaga definitivamente briefings, respostas, arquivos e auditoria.

drop policy if exists briefing_storage_delete_own_or_admin on storage.objects;
drop policy if exists briefing_storage_update_own_or_admin on storage.objects;
drop policy if exists briefing_storage_insert_own on storage.objects;
drop policy if exists briefing_storage_select_own_or_admin on storage.objects;

delete from storage.buckets where id = 'master-briefing-private';

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

drop trigger if exists briefings_enforce_status on public.briefings;
drop function if exists public.enforce_briefing_status_transition();

drop trigger if exists briefings_set_updated_at on public.briefings;

drop trigger if exists profiles_guard_role on public.profiles;
drop function if exists public.guard_profile_role();

drop trigger if exists profiles_set_updated_at on public.profiles;

revoke all on function public.log_briefing_activity(uuid, text, jsonb) from public, anon;
drop function if exists public.log_briefing_activity(uuid, text, jsonb);

drop table if exists public.briefing_activity;
drop table if exists public.briefing_files;
drop table if exists public.briefing_answers;
drop table if exists public.briefings;
drop table if exists public.profiles;

drop function if exists public.is_admin();
drop function if exists public.set_updated_at();

drop type if exists public.briefing_status;
drop type if exists public.profile_role;
