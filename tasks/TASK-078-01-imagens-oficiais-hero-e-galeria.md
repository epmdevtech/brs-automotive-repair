# TASK-078-01 — Imagens oficiais da oficina, hero e galeria

| Campo        | Valor                                             |
| ------------ | ------------------------------------------------- |
| ID           | TASK-078-01                                       |
| Status       | Done                                              |
| Data         | 2026-10-26                                        |
| Responsável  | Senior Frontend / Conteúdo Visual (Universal SDD) |
| SPEC         | SPEC-078                                          |
| Critérios    | AC-078-01 a AC-078-08                             |
| Dependências | SPEC-077 / TASK-077-01                            |

## Objetivo

Substituir as fotos antigas da oficina pelas seis imagens oficiais com placas
da marca, atualizar hero e Open Graph, e manter a galeria de `/trabalhos` com
transparência sobre o tratamento das placas.

## Escopo

### Incluído

- `assets-originais/divulgacao/` com os seis originais renomeados.
- `scripts/process-client-images.py` e `docs/image-treatment-report.json`.
- Assets em `src/assets/cliente/` e recortes do hero.
- Variantes `public/hero/*` e `public/master/og-master.jpg`.
- `src/components/brs/workshop-gallery.tsx` com os seis registros oficiais.
- Rótulo `mediaLabel` no hero e configuração canônica.
- Testes de galeria, hero e privacidade.
- Inventário, `PROJECT.md`, `CHANGELOG.md` e rastreabilidade.

### Não incluído

- Novos casos reais, autorizações de imagem ou alterações de negócio.

## Abordagem e impacto

- Dados: nenhum contrato alterado; apenas assets e conteúdo visual.
- Privacidade: originais ficam fora do Git; a placa real remanescente na imagem
  de céu nublado recebe pixelização, desfoque e véu.
- Riscos: confundir as imagens oficiais com prova documental de serviço e
  regressão de performance no hero; mitigados por rótulos, testes e manutenção
  das variantes responsivas.
- Padrões: `standards/quality-gates.md`, acessibilidade e SEO do projeto.

## Passos

- [x] Copiar as seis imagens com nomes neutros para `assets-originais/divulgacao/`.
- [x] Processar JPGs otimizados e tratar as placas reais remanescentes.
- [x] Gerar hero desktop/mobile, AVIF/WebP e Open Graph.
- [x] Atualizar a galeria de registros oficiais em `/trabalhos`.
- [x] Adicionar o rótulo "Imagem de divulgação" ao hero.
- [x] Criar testes e atualizar relatórios e documentação.
- [x] Executar testes, lint, build e matriz de rastreabilidade.

## Validação

| Critério/risco       | Teste, comando ou revisão                          | Evidência esperada               |
| -------------------- | -------------------------------------------------- | -------------------------------- |
| AC-078-01, AC-078-07 | `docs/image-treatment-report.json` e inventário    | Seis imagens e hashes documentados |
| AC-078-02            | Inspeção visual da imagem de céu nublado           | Placas reais ilegíveis           |
| AC-078-04, AC-078-05 | `bun run test src/test/workshop-gallery.test.tsx`  | Galeria e lightbox presentes     |
| AC-078-08            | `bun run test`, `bun run lint`, `bun run build`    | Suítes, lint e build verdes      |
| AC-078-08            | `python3 scripts/generate_traceability.py`         | Matriz com SPEC-078/TASK-078-01  |

## Condição de conclusão

- [x] Escopo implementado sem expansão.
- [x] Testes e validações aplicáveis passam.
- [x] Documentação e rastreabilidade foram atualizadas.

## Resultado

- Mudanças realizadas: seis imagens oficiais publicadas, hero/OG atualizados,
  galeria de registros oficiais e rótulos de transparência.
- Evidências: `bun run test`, `bun run lint`, `bun run build` e inspeção visual.
- Pendências ou bloqueios: nenhum. Commit humano com `Spec-Ref: SPEC-078` e
  `Task-Ref: TASK-078-01`.
