# SPEC-077 — Aproveitamento das fotos reais da oficina com privacidade de placas

## Metadados

| Campo       | Valor                                                                             |
| ----------- | --------------------------------------------------------------------------------- |
| ID          | SPEC-077                                                                          |
| Título      | Integração editorial das fotos reais da oficina e tratamento de placas            |
| Status      | Approved                                                                          |
| Responsável | Senior Frontend / Conteúdo Visual (Universal SDD)                                 |
| Revisores   | Produto / Engenharia / QA                                                         |
| Criado      | 2026-10-26                                                                        |
| Atualizado  | 2026-10-26                                                                        |
| Refs:       | Solicitação humana explícita de 2026-10-26; `SPEC-064`, `SPEC-069`, `TASK-069-01` |

---

## Problema e resultado

O site usava majoritariamente imagens ilustrativas, algumas delas repetidas
entre seções, enquanto o cliente forneceu sete fotografias reais da oficina.
As fotos incluem veículos com placas legíveis e nomes de arquivo que também
são placas, o que impede o uso direto no repositório e no site.

**Resultado esperado**: publicar as seis fotografias reais relevantes em
contextos coerentes (fachada, recepção, estufa e guincho), com placas
visualmente ilegíveis e sem expor identificadores veiculares em nomes,
textos, `alt`, metadados ou documentação. As imagens ilustrativas restantes
continuam identificadas como tal, sem narrativa de caso real.

**Restrições**:

- Nenhum par antes/depois real deve ser inventado ou atribuído a cliente.
- Nenhuma imagem deve ser descartada apenas por semelhança; o terreno vazio
  e a imagem ilustrativa de vistoria ficam fora do site por falta de aderência.
- O tratamento de placas é destrutivo apenas nas cópias de publicação; os
  originais permanecem fora de `src/` e `public/` e não são versionados.
- A entrega deve preservar performance, SEO, acessibilidade e o fluxo de
  contato existente.

## Escopo

### No escopo

- Inventário das 29 fotografias disponíveis (22 do projeto e 7 do cliente).
- Pipeline reprodutível em `scripts/process-client-images.py`.
- Pixelização, desfoque e véu escuro localizados sobre cada placa.
- Geração das variantes do hero (AVIF/WebP) e do Open Graph.
- Galeria acessível com ampliação em `/trabalhos`.
- Uso de registros reais em `/sobre`, `/contato`, `/para-corretores`,
  `/servicos`, `/servicos/pintura-automotiva` e hero da home.
- Remoção dos derivados antigos não tratados em `src/assets/master/`.
- Testes de privacidade de nomes/conteúdo e de renderização da galeria.
- Documentação do inventário e da política de tratamento.

### Fora do escopo

- Autorização de uso de imagem de clientes ou pessoas identificáveis.
- Publicação de pares antes/depois reais não fornecidos pelo cliente.
- Reconhecimento automatizado de placas em produção.
- Alteração de dados cadastrais, rotas, formulário ou regras de negócio.

## Comportamento Funcional

1. As seis fotos reais são servidas apenas a partir de `src/assets/cliente/`.
2. Toda placa visível nas fotos publicadas recebe tratamento localizado;
   nenhum caractere é legível mesmo em ampliação.
3. A galeria de `/trabalhos` exibe seis registros com `alt`, dimensões,
   carregamento tardio e ampliação por diálogo acessível.
4. As páginas institucionais e de serviço usam a foto real apenas quando ela
   corresponde ao conteúdo (estufa em pintura, guincho em leva-e-traz,
   fachada em contato/sobre/corretores).
5. Comparadores e sequências de método permanecem rotulados como ilustrativos.
6. Arquivos originais e derivados não tratados não são versionados nem
   referenciados pelo código.

## Critérios de Aceitação

| ID        | Critério                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------- |
| AC-077-01 | As 29 imagens estão inventariadas com origem, uso e status                                     |
| AC-077-02 | As seis fotos reais relevantes estão publicadas e as placas não são legíveis                   |
| AC-077-03 | Nomes de arquivo, textos, `alt`, docs e metadados não contêm placas ou os nomes originais      |
| AC-077-04 | `src/assets/master/` foi removido e nenhum import aponta para derivados não tratados           |
| AC-077-05 | `/trabalhos` possui galeria real com ampliação por teclado e leitor de tela                    |
| AC-077-06 | `/sobre`, `/contato`, `/para-corretores`, `/servicos` e pintura usam registros reais coerentes |
| AC-077-07 | Imagens ilustrativas e comparadores continuam rotulados e não simulam casos reais              |
| AC-077-08 | Hero e Open Graph usam derivados tratados e mantêm as variantes responsivas                    |
| AC-077-09 | Testes de privacidade e de galeria passam, assim como lint e build                             |

## Restrições de Qualidade

- Performance: imagens com `width`/`height`, `loading="lazy"` fora do hero e
  `decoding="async"`; hero mantém AVIF/WebP e preload.
- Acessibilidade: botões com rótulo, foco visível, diálogo com título e
  navegação por setas.
- SEO: `alt` descritivo, metadados coerentes e nenhuma promessa de resultado.
- Privacidade: nenhum identificador veicular em artefato versionado.
