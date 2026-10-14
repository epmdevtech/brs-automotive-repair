# TASK-038-01 — Eliminação de Artefatos de IA das Capturas de Tela

## Metadados

| Campo         | Valor                                                                          |
| ------------- | ------------------------------------------------------------------------------ |
| Task ID       | `TASK-038-01`                                                                  |
| Spec Ref      | `SPEC-038`                                                                     |
| Título        | Eliminação de Artefatos de IA das Capturas de Tela                             |
| Status        | Completed                                                                     |
| Responsável   | Engenheiro de Software Sênior & Especialista em Design Systems                 |
| Data Início   | 2026-10-14                                                                     |
| Data Conclusão| 2026-10-14                                                                     |

---

## 1. Escopo de Trabalho

1. **Remover "OFICINA ATIVA" (`src/routes/sobre.tsx`)**:
   - Remover a tag verde pulsante e o texto `OFICINA ATIVA` do card institucional.
   - Trocar o identificador para "Oficina em Toledo, Paraná".
2. **Despoluir Eyebrow do Hero (`src/components/brs/hero.tsx`)**:
   - Remover a caixa com borda e o LED pulsante `led-status-pulse`.
   - Adotar eyebrow tipográfico limpo e sem caixa HUD artificial.
3. **Normalizar Tipografia de Botões (`src/components/brs/final-cta.tsx` e `src/routes/servicos/index.tsx`)**:
   - Alterar `SOLICITAR AVALIAÇÃO` para `Solicitar avaliação`.
4. **Testes & Quality Gates**:
   - Criar `src/test/anti-ai-artifacts.test.tsx`.
   - Rodar `bun run test`, `bun run lint` e `bun run build`.

---

## 2. Checklist de Execução

- [x] Atualizar `src/routes/sobre.tsx`
- [x] Atualizar `src/components/brs/hero.tsx`
- [x] Atualizar `src/components/brs/final-cta.tsx` e `src/routes/servicos/index.tsx`
- [x] Criar suite `src/test/anti-ai-artifacts.test.tsx`
- [x] Validar testes (`bun run test`)
- [x] Validar linter (`bun run lint`)
- [x] Validar build (`bun run build`)
- [x] Gerar `reviews/REVIEW-038-remocao-artefatos-genericos-ia.md` e sincronizar `PROJECT.md`
