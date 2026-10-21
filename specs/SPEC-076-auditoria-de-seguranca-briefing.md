# SPEC-076 — Auditoria de segurança do briefing operacional da Master Chapeação

## Metadados

| Campo          | Valor                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| ID             | SPEC-076                                                                                                                 |
| Título         | Auditoria de segurança (OWASP Top 10:2025) do briefing operacional e correções confirmadas                             |
| Status         | Approved                                                                                                                 |
| Responsável    | Senior Full Stack / AppSec Engineer (Universal SDD)                                                                      |
| Revisores      | Produto / Engenharia / QA                                                                                                |
| Criado         | 2026-10-20                                                                                                                |
| Atualizado     | 2026-10-20                                                                                                                |
| Liberação Alvo | Branch `security/master-briefing-audit`; sem promoção a produção sem autorização humana                                   |
| Refs:          | Discovery: solicitação humana explícita de 2026-10-20 (auditoria de segurança do briefing); ADRs: `ADR-001`, `ADR-002`, `ADR-003` |

---

## Problema e resultado

O briefing operacional da Master Chapeação concentra dados comerciais
confidenciais (identificação da empresa, respostas das 15 etapas, documentos e
fotos privadas) e um painel administrativo com acesso privilegiado. A
implementação foi descrita como autorizada e persistente, mas **não havia
evidência técnica** de que os controles announcement existissem de fato: a
promoção de administrador falhava na prática e nenhuma auditoria independente
verificara o isolamento entre clientes, a validade dos cookies de sessão, os
cabeçalhos de segurança ou a integridade das migrações de RLS.

**Resultado esperado**: uma auditoria técnica com evidência reproduzível,
achados classificados por severidade, correções das Vulnerabilidades
confirmadas com teste de regressão, e a documentação que permita a um humano
decidir a publicação.

**Restrições**: nenhum teste destrutivo, nenhum acesso a dado real de
cliente, nenhuma alteração de configuração remota durante a auditoria; as
correções de infraestrutura (Supabase/Vercel) ficam como ação manual
documentada.

## Escopo

### No escopo (In scope)

- Auditoria estática de servidor, banco (migrações), rotas, uploads,
  configuração de deploy, CI/CD e cadeia de dependências.
- Testes dinâmicos de controle de acesso com contas sintéticas
  independentes (Cliente A, Cliente B, Administrador, anônimo).
- Correções em código: cookie de sessão, cabeçalhos de segurança,
  encerramento de sessão, allowlist de redirecionamento, contexto Docker,
  permissões do CI, migração de proteção de papel.
- Testes de regressão (unitários e E2E) e entregáveis em `docs/security/`.

### Fora do escopo (Out of scope)

- Testes de intrusão, DAST completo, fuzzing e testes de carga.
- Alterações no painel do Supabase, na Vercel, DNS, Caddy ou em dados
  persistidos de terceiros.
- Auditoria do módulo de demonstração de agendamentos como produto final
  (apenas registro do risco).

## Comportamento Funcional

1. A auditoria registra branch, commit, estado inicial e limitações.
2. Todo achado tem identificador, categoria OWASP, evidência, reprodução
   segura, impacto e correção.
3. Vulnerabilidades confirmadas com correção local recebem teste de regressão.
4. Correções que dependem de configuração remota viram migração ou instrução
   versionada, com ação pendente explícita.
5. Os entregáveis ficam em `docs/security/`.

## Critérios de Aceitação

| ID | Critério |
| -- | -------- |
| AC-076-01 | Os dezessete achados estão classificados por severidade e categoria OWASP, com evidência reproduzível |
| AC-076-02 | O teste dinâmico de isolamento entre clientes está automatizado e executável |
| AC-076-03 | A elevação de privilégio em `profiles.role` está corrigida em migração versionada, com teste de regressão |
| AC-076-04 | O cookie de sessão é `httpOnly` e `Secure` em HTTPS |
| AC-076-05 | Todas as respostas carregam os cabeçalhos de segurança definidos |
| AC-076-06 | Existe encerramento de sessão na interface, com limpeza do rascunho local |
| AC-076-07 | O redirecionamento pós-login aceita apenas caminhos internos permitidos |
| AC-076-08 | `docs/security/` contém relatório, matriz OWASP, plano de correção e plano de testes |
| AC-076-09 | Lint, testes e build passam com as correções aplicadas |

## Restrições de Qualidade

- Nenhuma alteração destrutiva, nenhuma publicação e nenhum commit automático
  sem autorização humana.
- Compatibilidade preservada: a aplicação deve continuar funcionando com
  SSR, hidratação, login, persistência e painel administrativo.
- Toda correção vem acompanhada de teste de regressão executável.
