# TASK-077-01 — Fotos reais da oficina, galeria e privacidade de placas

| Campo        | Valor                                             |
| ------------ | ------------------------------------------------- |
| ID           | TASK-077-01                                       |
| Status       | Done                                              |
| Data         | 2026-10-26                                        |
| Responsável  | Senior Frontend / Conteúdo Visual (Universal SDD) |
| SPEC         | SPEC-077                                          |
| Critérios    | AC-077-01 a AC-077-09                             |
| Dependências | Nenhuma                                           |

## Objetivo

Publicar as fotos reais da oficina com placas tratadas, integrar a galeria e
as páginas institucionais, remover derivados não tratados e comprovar a
privacidade por testes e documentação.

## Escopo

### Incluído

- `scripts/process-client-images.py` e `docs/image-treatment-report.json`.
- Assets tratados em `src/assets/cliente/`.
- Variantes `public/hero/*` e `public/master/og-master.jpg`.
- `src/components/brs/workshop-gallery.tsx`.
- Ajustes em home, `/trabalhos`, `/sobre`, `/contato`, `/para-corretores`,
  `/servicos` e `/servicos/pintura-automotiva`.
- Testes de privacidade e da galeria.
- `docs/inventario-imagens-brs.md` e atualização de governança.

### Não incluído

- Casos reais de clientes, autorizações de imagem ou novos serviços.

## Abordagem e impacto

- Dados: nenhuma alteração de contrato; apenas URLs de assets e conteúdo visual.
- Privacidade: originais em `assets-originais/` ignorados pelo Git; derivados
  antigos removidos.
- Riscos: regressão de layout em mobile e falha de acessibilidade no diálogo;
  mitigados por testes e inspeção visual.
- Padrões: `standards/quality-gates.md`, acessibilidade e SEO do projeto.

## Passos

- [x] Inventariar as imagens e mapear os originais para IDs neutros.
- [x] Aplicar tratamento localizado de placas e gerar derivados.
- [x] Regenerar hero responsivo e Open Graph.
- [x] Integrar galeria e registros reais nas páginas.
- [x] Remover `src/assets/master/` e atualizar imports.
- [x] Criar testes de privacidade e de galeria.
- [x] Documentar inventário e política de tratamento.
- [x] Executar testes, lint, build e matriz de rastreabilidade.

## Validação

| Critério/risco       | Teste, comando ou revisão                         | Evidência esperada                |
| -------------------- | ------------------------------------------------- | --------------------------------- |
| AC-077-01, AC-077-03 | `bun run test src/test/image-privacy.test.ts`     | Nenhum nome ou token de placa     |
| AC-077-05            | `bun run test src/test/workshop-gallery.test.tsx` | Seis fotos e diálogo acessível    |
| AC-077-09            | `bun run test`, `bun run lint`, `bun run build`   | Suítes, lint e build verdes       |
| AC-077-09            | `python3 scripts/generate_traceability.py`        | Matriz com SPEC-077 e TASK-077-01 |

## Condição de conclusão

- [x] Escopo implementado sem expansão.
- [x] Testes e validações aplicáveis passam.
- [x] Documentação e rastreabilidade foram atualizadas.

## Resultado

- Mudanças realizadas: pipeline de tratamento, assets publicados, galeria,
  integrações de página, remoção dos derivados antigos e testes.
- Evidências: `bun run test` (536 testes), `bun run lint` (0 erros, 7 avisos preexistentes), `bun run build` e inspeção visual das fotos tratadas, hero e Open Graph.
- Pendências ou bloqueios: nenhum. Resta apenas o commit humano com os trailers `Spec-Ref` e `Task-Ref`.
