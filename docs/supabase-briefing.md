# Briefing da Master Chapeação — Supabase, RLS e operação

| Campo      | Valor                                                                           |
| ---------- | ------------------------------------------------------------------------------- |
| Referência | `SPEC-073` / `TASK-073-01` a `TASK-073-04`                                      |
| Status     | Implementado; **persistência real ainda não validada** (depende de credenciais) |
| Atualizado | 2026-10-20                                                                      |

Este documento descreve o que precisa ser feito manualmente para que o briefing
funcione com persistência real. Nenhum passo abaixo pode ser automatizado sem
acesso ao projeto Supabase de destino.

---

## 1. O que o código entrega hoje

- Migração SQL versionada com esquema, RLS, gatilhos de integridade e bucket privado.
- Camada de servidor com `createServerFn` do TanStack Start: sessão por cookie,
  autorização verificada no servidor, persistência por etapa, envio idempotente,
  upload privado e painel administrativo.
- Rotas `/briefing`, `/briefing/confirmacao`, `/login`, `/admin/briefings` e
  `/admin/briefings/$briefingId`.
- Degradação honesta: sem `SUPABASE_URL`/`SUPABASE_ANON_KEY`, a interface informa
  que a persistência está indisponível e **não simula sucesso** de gravação.

## 2. Provisionamento do projeto Supabase

1. Crie um projeto Supabase dedicado ao briefing (**não** use o projeto de outro
   cliente). Suggested: `master-briefing`.
2. Anote a URL do projeto e a chave anônima em `Project Settings → API`.
3. Crie a chave de serviço apenas se houver necessidade administrativa no servidor
   (a aplicação atual **não** usa `service_role`; prefira revogá-la).
4. Configure a autenticação:
   - `Authentication → Providers → Email`: mantenha habilitado o e-mail e senha;
   - desabilite o cadastro público (`Sign up`) — o acesso é por convite;
   - em `Authentication → URL Configuration`, defina a URL do site (preview e
     produção) para evitar avisos de redirect em e-mails de confirmação.
5. Crie os usuários em `Authentication → Users` (convite por e-mail) para:
   - o responsável da Master Chapeação (papel `client`);
   - os administradores da EPM DevTech (papel `admin`).

## 3. Aplicação da migração

- Pelo SQL Editor do Supabase: cole o conteúdo de
  `supabase/migrations/20261020000100_briefing_core.sql` e execute.
- Ou pela CLI: `supabase db push` (requer projeto vinculado e `supabase login`).
- Rollback documentado em `supabase/rollback/20261020000100_briefing_core.down.sql`
  (apaga definitivamente os dados — use apenas em desenvolvimento).

A migração cria:

| Objeto                           | Finalidade                                               |
| -------------------------------- | -------------------------------------------------------- |
| `public.profiles`                | Papel (`client`/`admin`) vinculado a `auth.users`        |
| `public.briefings`               | Briefing, proprietário, status e mensagem para o cliente |
| `public.briefing_answers`        | Respostas por etapa (`section_key` + JSONB)              |
| `public.briefing_files`          | Metadados dos arquivos enviados                          |
| `public.briefing_activity`       | Trilha de auditoria (somente administradores)            |
| `public.log_briefing_activity()` | Função `security definer` para registrar atividade       |
| `public.is_admin()`              | Verificação de papel usada nas políticas                 |
| bucket `master-briefing-private` | Armazenamento privado, sem URLs públicas                 |

## 4. Promoção de papel

O gatilho `profiles_guard_role` impede que um usuário eleve o próprio papel. Para
promover um administrador, use o SQL Editor com uma sessão de administrador do
Supabase (o papel do dashboard):

```sql
update public.profiles set role = 'admin' where id = '<uuid-do-usuário>';
```

Não existe endpoint de aplicação para alteração de papel, e o papel nunca é lido
de parâmetro enviado pelo navegador.

## 5. Variáveis de ambiente

Copie `.env.example` para `.env` (local) ou configure no painel da Vercel.

| Variável                    | Ambiente | Exposição           | Descrição                                         |
| --------------------------- | -------- | ------------------- | ------------------------------------------------- |
| `SUPABASE_URL`              | servidor | privada             | URL do projeto Supabase                           |
| `SUPABASE_ANON_KEY`         | servidor | privada no servidor | Chave anônima usada nas Server Functions          |
| `SUPABASE_SERVICE_ROLE_KEY` | servidor | privada             | Não utilizada pela aplicação; deixe vazia         |
| `SUPABASE_BRIEFING_BUCKET`  | servidor | privada             | Nome do bucket (padrão `master-briefing-private`) |
| `VITE_SUPABASE_URL`         | cliente  | pública             | Somente se houver uso do SDK no navegador         |
| `VITE_SUPABASE_ANON_KEY`    | cliente  | pública             | Chave anônima; nunca a `service_role`             |

Regras:

- Nenhuma variável `VITE_` pode conter a `service_role` ou qualquer segredo.
- O bundle do cliente **não** contém o SDK do Supabase: toda operação passa pelas
  Server Functions (`bun run build` e inspeção de `dist/client` comprovam isso).
- Trocar de ambiente exige recriar os cookies de sessão: usuários precisarão
  entrar novamente.

## 6. Execução local

```sh
cp .env.example .env   # preencha SUPABASE_URL e SUPABASE_ANON_KEY
bun install
bun run dev            # http://localhost:5210/briefing (porta estrita 5210)
```

Sem as variáveis preenchidas, a rota `/briefing` exibe o aviso de persistência
indisponível — comportamento esperado e testado.

## 7. Validação do preview na Vercel

1. Importe o repositório na Vercel e defina as variáveis de ambiente do preview.
2. Confirme o runtime: o build do projeto gera `dist/server/server.js` (Nitro/Node).
   Use **Node.js 20 LTS** e o comando de build `bun run build` (ou `npm run build`).
3. Aplique a migração no mesmo projeto Supabase usado pelo preview.
4. Verifique no preview:
   - `/briefing` sem sessão redireciona para `/login`;
   - `/login` autentica com um usuário `client` e abre o formulário;
   - o preenchimento de uma etapa recarrega do banco em outro navegador;
   - `/admin/briefings` exige usuário `admin` e lista o briefing enviado;
   - `/admin/briefings/<id>` mostra pendências, notas internas e histórico;
   - o download de arquivo responde por URL assinada de 5 minutos.
5. Nenhum deploy de produção é executado sem autorização humana explícita.

## 8. Segurança aplicada

- RLS ativa em todas as tabelas; nenhuma política irrestrita.
- Cliente só lê e grava o próprio briefing (`owner_user_id = auth.uid()`).
- Respostas só são graváveis enquanto o briefing está em `draft`.
- Transições de status são validadas no banco por `enforce_briefing_status_transition`.
- Auditoria é gravada apenas por função `security definer` controlada.
- Arquivos ficam em bucket privado, com caminho controlado pelo servidor
  (`<user_id>/<briefing_id>/<categoria>/<uuid>.<ext>`) e download por URL assinada.
- Toda Server Function resolve a sessão e o papel no servidor; a interface nunca
  decide autorização.

## 9. Privacidade, LGPD e retenção (proposta)

- Finalidade: levantamento operacional e comercial para a EPM DevTech avaliar a
  Master Chapeação, incluindo eventual credenciamento junto a seguradoras.
- Base legal e papel do controlador ainda dependem de decisão do responsável pelo
  tratamento de dados: este documento **não** declara conformidade jurídica.
- Separação de consentimentos: autorização de publicação de fotos/documentos no
  site é campo distinto do envio do briefing, desmarcado por padrão.
- Retenção proposta: 180 dias após o encerramento da análise, com exclusão de
  arquivos e respostas a pedido do titular; a exclusão em cascata está prevista
  nas chaves estrangeiras (`on delete cascade`).
- Direitos do titular: acesso, correção, portabilidade e exclusão devem ser
  atendidos por processo manual coordenado com o responsável pelo tratamento.

## 10. Pendências abertas

| Pendência                                        | Responsável   | Dependência                 |
| ------------------------------------------------ | ------------- | --------------------------- |
| Criar o projeto Supabase e aplicar a migração    | Infra         | Acesso externo              |
| Convidar usuários e promover o administrador     | Infra         | Projeto criado              |
| Validar o preview com persistência real          | Engenharia    | Variáveis de ambiente       |
| Definir prazo de retenção e processo de exclusão | Produto / DPO | Decisão de negócio          |
| Avaliar publicação de fotos no site              | Produto       | Autorização do proprietário |
