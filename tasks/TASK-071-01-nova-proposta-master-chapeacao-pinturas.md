# TASK-071-01 — Implementar Nova Proposta MASTER Chapeação e Pinturas

| Campo        | Valor                                                       |
| ------------ | ----------------------------------------------------------- |
| ID           | `TASK-071-01`                                               |
| SPEC         | `SPEC-071`                                                  |
| Status       | Done                                                 |
| Data         | 2026-10-19                                                  |
| Responsável  | Senior Full Stack / UX-UI Engineer (Universal SDD)          |
| Dependências | Acervo local e dados fornecidos pelo cliente                |

---

## 1. Objetivo

Rebrandar a demonstração atual para MASTER Chapeação e Pinturas, aplicando logo oficial, fotos reais e dados atualizados sem alterar a arquitetura, as rotas ou o comportamento funcional.

## 2. Escopo

### Incluído

- Dados canônicos, textos institucionais, SEO e JSON-LD.
- Logo, favicons, manifest e mídia social básica.
- Fotos reais em hero, pintura, estrutura, sobre, contato e guincho.
- Proposta comercial interna e dados de demonstração de agendamento.
- Testes e documentação canônica.

### Excluído

- Deploy, push, merge, DNS e infraestrutura.
- Novas rotas, seções, formulários ou integrações.
- Invenção de pares antes/depois, depoimentos ou avaliações.

## 3. Etapas

- [x] Inspecionar repositório, branches, stack e acervo local.
- [x] Criar SPEC-071 e TASK-071-01.
- [ ] Gerar derivados otimizados (hero AVIF/WebP, cards WebP, logo e favicons).
- [ ] Atualizar `src/lib/brs.ts`, SEO, rotas e componentes.
- [ ] Aplicar fotos reais e logo.
- [ ] Atualizar manifest, `llms.txt`, `robots.txt`, `sitemap.xml` e docs.
- [ ] Atualizar testes afetados.
- [ ] Executar lint, test, build e QA visual.

## 4. Validação

| Critério/risco | Teste, comando ou revisão | Evidência esperada |
| -------------- | ------------------------- | ------------------ |
| AC-071-01 | `bun run test` + busca por BRS | Nenhuma referência visível antiga |
| AC-071-02 | Inspeção visual local | Logo e favicon corretos |
| AC-071-03 | Inspeção visual local | Fotos reais em contexto compatível |
| AC-071-04 | Testes de SEO/footer | Dados MASTER |
| AC-071-05 | `bun run build` + inspeção de HTML | Build e semântica de imagens OK |
| AC-071-06 | `git status`/`git branch` | Apenas branch local |

## 5. Condição de Conclusão

- [ ] Escopo implementado sem expansão.
- [ ] Testes e validações aplicáveis aprovados.
- [ ] Documentação e rastreabilidade atualizadas.
- [ ] Limitações e desvios registrados.

## 6. Resultado

- Mudanças feitas: em andamento.
- Evidência: em andamento.
- Trabalho em aberto: aprovação humana e integração em `develop`.
