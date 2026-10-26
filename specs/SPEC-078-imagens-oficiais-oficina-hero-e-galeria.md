# SPEC-078 — Imagens oficiais da oficina, hero e galeria de registros

## Metadados

| Campo        | Valor                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------- |
| ID           | SPEC-078                                                                                    |
| Título       | Substituição do acervo da oficina pelas imagens oficiais, novo hero e galeria de registros   |
| Status       | Approved                                                                                    |
| Responsável  | Senior Frontend / Conteúdo Visual (Universal SDD)                                           |
| Revisores    | Produto / Engenharia / QA                                                                   |
| Criado       | 2026-10-26                                                                                  |
| Atualizado   | 2026-10-26                                                                                  |
| Refs:        | Solicitação humana explícita de 2026-10-26; `SPEC-064`, `SPEC-069`, `SPEC-077`, `TASK-077-01` |
| Substitui    | AC-077-08 quanto à origem do hero e do Open Graph, preservada a exigência de placas ilegíveis |

---

## Problema e resultado

As fotos antigas da oficina usadas no site têm baixa qualidade e um bloco de
desfoque grande e visível sobre a placa no recorte do hero. O cliente forneceu
seis imagens oficiais da empresa com as placas substituídas pela marca
**MASTER**, com melhor enquadramento, iluminação e coerência de marca. Elas
devem substituir as fotos antigas nos registros da oficina e nas páginas
institucionais.

**Resultado esperado**: publicar as seis imagens oficiais em
`src/assets/cliente/`, usá-las na galeria de `/trabalhos`, no hero, no Open
Graph e nas páginas institucionais, mantendo a transparência sobre a
substituição das placas. A imagem sob céu nublado ainda tem placas reais em
veículos ao fundo e deve receber tratamento localizado.

**Restrições**:

- As imagens oficiais não devem ser descritas como serviço concluído ou caso
  de cliente.
- Placas de terceiros ainda legíveis devem ser tratadas.
- Nomes originais com placas não podem ir para o repositório, `alt`, docs ou
  metadados.
- A galeria de métodos ilustrativos e seus rótulos devem permanecer intactos.
- O hero mantém AVIF/WebP, preload, dimensões e performance.

## Escopo

### No escopo

- Cópia neutra das seis imagens para `assets-originais/divulgacao/` (fora do Git).
- Processamento para `src/assets/cliente/` em JPG otimizado.
- Tratamento localizado das placas reais remanescentes na imagem de céu nublado.
- Novo hero desktop/mobile e Open Graph derivados das imagens oficiais.
- Galeria acessível com seis registros oficiais em `/trabalhos`.
- Rótulo "Imagem de divulgação" no hero e nota de placas substituídas na galeria.
- Relatório `docs/image-treatment-report.json` e atualização do inventário.
- Testes de renderização, privacidade, hero e documentação.

### Fora do escopo

- Casos reais de clientes, autorizações de imagem ou novas promessas comerciais.
- Substituir os comparadores ilustrativos de método.
- Alterar rotas, formulário, dados cadastrais ou regras de negócio.

## Comportamento Funcional

1. As seis imagens oficiais são publicadas em `src/assets/cliente/` e usadas
   nos registros da oficina.
2. A imagem de céu nublado tem as placas reais dos veículos ao fundo tratadas.
3. O hero da home usa o recorte da estufa oficial e exibe o rótulo
   "Imagem de divulgação" no rodapé, sem o bloco de desfoque anterior.
4. O Open Graph usa a fachada oficial com guincho branco, sem placas legíveis.
5. `/trabalhos` exibe a galeria com seis registros oficiais, ampliação por
   diálogo e navegação por setas.
6. A galeria informa que as placas de terceiros foram substituídas pela marca.
7. As imagens usam `width`/`height`, `loading="lazy"`, `decoding="async"` e
   nomes neutros; o hero continua com variantes responsivas e preload.

## Critérios de Aceitação

| ID        | Critério                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------ |
| AC-078-01 | As seis imagens oficiais estão publicadas em `src/assets/cliente/` com nomes neutros              |
| AC-078-02 | Nenhuma placa real permanece legível na imagem de céu nublado                                     |
| AC-078-03 | Hero e Open Graph usam derivados oficiais, com AVIF/WebP e preload preservados                    |
| AC-078-04 | O hero exibe o rótulo "Imagem de divulgação" e não apresenta a imagem como serviço concluído      |
| AC-078-05 | `/trabalhos` possui galeria com seis registros oficiais, rótulo e lightbox acessível              |
| AC-078-06 | A galeria de métodos ilustrativos e seus rótulos permanecem intactos                             |
| AC-078-07 | `docs/image-treatment-report.json` e o inventário documentam origem, uso e tratamento             |
| AC-078-08 | Testes, lint, build e matriz de rastreabilidade passam                                           |

## Restrições de Qualidade

- Performance: imagens fora do hero com carregamento tardio; hero com variantes
  AVIF/WebP e preload casado.
- Acessibilidade: botões com rótulo, foco visível, diálogo com título e setas.
- Transparência: a galeria informa a substituição de placas; nenhuma imagem é
  descrita como caso de cliente.
- Privacidade: nenhum identificador veicular em artefato versionado.
