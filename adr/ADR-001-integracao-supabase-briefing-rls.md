# ADR-001 — Supabase como backend do briefing da Master

| Campo     | Valor                 |
| --------- | --------------------- |
| ID        | ADR-001               |
| Status    | Accepted              |
| Data      | 2026-10-20            |
| Decisores | Engenharia EPMDEVTECH |
| Refs:     | SPEC-073; TASK-073-01 |

## Contexto

O briefing operacional da Master Chapeação (SPEC-072) é um protótipo local: rascunho em `localStorage`, barreira por código de demonstração no bundle e exportação manual. A SPEC-073 exige persistência real, retomada do preenchimento, autenticação, autorização por papéis, arquivos privados, auditoria e painel administrativo — sem recriar o projeto, sem segundo backend e sem publicar em produção sem autorização.

Restrições reais: TanStack Start 1.168 com Nitro/Vercel, React 19, Zod e React Hook Form já instalados; nenhuma infraestrutura de dados configurada; o projeto deve continuar funcionando como site institucional sem dependência do novo serviço.

## Decisão

Adotar **Supabase** (Auth + PostgreSQL + Storage) como camada de dados e autenticação do briefing, com:

1. **Autenticação por sessão em cookie, resolvida no servidor.** `createServerFn` do TanStack Start executa a resolução do usuário no servidor usando `@supabase/ssr` com cookies da requisição; a interface nunca decide autorização.
2. **PostgreSQL com Row Level Security como barreira primária.** As políticas restringem o cliente ao próprio `briefing` por `owner_user_id` e restringem o administrador ao papel `admin` lido de `profiles`. Nenhuma política irrestrita é criada.
3. **Chave anônima apenas no cliente, chave privilegiada apenas no servidor.** Nenhuma variável `VITE_` carrega segredo; o papel de administrador é derivado da sessão e do papel no banco, nunca de parâmetro enviado pelo navegador.
4. **Storage privado com URL assinada curta.** Uploads vão para caminho controlado por `user_id/briefing_id/categoria/uuid.ext`, com limite de tamanho, lista de MIME permitidos e validação no servidor; download exige verificação de propriedade.
5. **Funções de servidor como única porta de escrita.** Todas as operações de leitura, gravação, envio, upload, download e administração passam por `createServerFn` com `inputValidator` Zod e verificação de autorização no servidor.
6. **Degradação honesta.** Sem `SUPABASE_URL`/`SUPABASE_ANON_KEY`, a interface informa que a persistência está indisponível e nenhuma operação é simulada.

### Alternativas consideradas

| Alternativa                           | Motivo da recusa                                                                                               |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| API própria em Express/Nitro routes   | Introduziria segundo backend e stack de runtime duplicada, contra a premissa de stack única do projeto.        |
| Neon/Postgres + Auth.js               | Exigiria migração de esquema e cookies gerenciados manualmente, sem RLS nativo, elevando o risco de exposição. |
| Persistência apenas em `localStorage` | Não atende retomada real, auditoria, isolamento entre clientes nem arquivos privados.                          |
| Código de acesso no bundle (SPEC-072) | Não é segurança: o valor é público no artefato do cliente.                                                     |
| ORM adicional (Drizzle/Prisma)        | Camada de tipos redundante com Zod e sem ganho para o volume de dados do briefing.                             |

## Consequências

**Positivas**

- RLS no banco como segunda barreira, auditável em SQL e testável.
- Autenticação, banco e storage em um único serviço, com migrações versionadas no repositório.
- Compatibilidade com o runtime Node da Vercel e com SSR do TanStack Start via cookies.

**Negativas e riscos**

- Dependência externa e custo de provisionamento (ainda não realizado).
- A segurança passa a depender da configuração correta do projeto Supabase; migrações e políticas versionadas reduzem, mas não eliminam esse risco.
- O painel administrativo exige um usuário com papel `admin`, cujo provisionamento é manual.

**Mitigações**

- Políticas restritivas por padrão e testes de isolamento e escalada de privilégio.
- Documentação de provisionamento, `.env.example` e verificação de ausência de segredos no bundle.
- Documentação de retenção, exclusão e papel do controlador sob LGPD.

## Situação de implantação

Código, migrações e documentação prontos; **persistência real ainda não validada**, pois o projeto Supabase de destino e as credenciais não foram fornecidos. A interface opera em modo degradado explícito até a configuração manual.
