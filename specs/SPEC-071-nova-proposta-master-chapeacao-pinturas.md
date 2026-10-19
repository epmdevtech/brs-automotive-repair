# SPEC-071 — Nova Proposta MASTER Chapeação e Pinturas

| Campo          | Valor                                                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| ID             | `SPEC-071`                                                                                                                         |
| Título         | Nova proposta comercial para MASTER Chapeação e Pinturas com fotos reais e identidade oficial                                       |
| Status         | Approved                                                                                                                           |
| Data           | 2026-10-19                                                                                                                         |
| Autor          | Senior Full Stack / UX-UI Engineer (Universal SDD)                                                                                 |
| Escopo         | Rebranding da demonstração BRS para MASTER, acervo fotográfico real, logo oficial, SEO e dados de contato                          |
| Refs           | Acervo local `/home/elessandro/Downloads/site_master/site master`; dados fornecidos pelo cliente em 2026-10-19                     |

---

## 1. Problema e Resultado

A base atual é uma demonstração multipágina da BRS Reparações Automotivas. O cliente MASTER Chapeação e Pinturas forneceu fotos reais da operação, a logo oficial e os dados atualizados da empresa (Av. Maripá, 4138 — Centro, Toledo-PR; telefone (45) 99954-5442; atendimento das 08h às 12h e das 13h30 às 18h30). A proposta deve reapresentar a mesma arquitetura de site com a identidade, o acervo e os dados da MASTER.

**Resultado esperado:** demonstração multipágina consistente, com fotos reais aplicadas onde há correspondência segura, logo oficial no header/footer/favicons e nenhuma alegação visual inventada.

**Medidas de sucesso:** zero referências visíveis à BRS; zero imagens reais rotuladas como ilustrativas; imagens ilustrativas restantes justificadas; lint, testes e build aprovados.

## 2. Escopo

### No escopo

- Rebranding de nome, logo, endereço, telefone, horários, e-mail, CNPJ e dados institucionais para MASTER.
- Aplicação das fotos reais de fachada, estufa/pintura e guincho nas seções correspondentes.
- Manutenção das imagens ilustrativas apenas onde não existe foto real equivalente (PDR/martelinho e pares antes/depois).
- Atualização de SEO, JSON-LD, manifest, favicons, `llms.txt`, `robots.txt` e `sitemap.xml`.
- Atualização da proposta comercial interna EPM DevTech para o novo cliente.
- Testes de regressão e QA visual local.

### Fora do escopo

- Deploy, publicação, push, merge em `develop`/`main`, DNS ou infraestrutura.
- Criação de novas rotas ou seções.
- Invenção de depoimentos, avaliações, prazos, garantias ou pares antes/depois.
- Alteração de formulários, integrações, autenticação ou regras de agendamento além do rebranding textual.
- Remoção das fotos originais do computador local.

## 3. Comportamento Funcional

- `src/lib/brs.ts` permanece como fonte única de verdade (nome do arquivo preservado para evitar refatoração ampla), agora com os dados da MASTER.
- A logo oficial substitui o wordmark textual em header e footer, com `alt` descritivo e proporção preservada.
- Hero usa foto real da estufa, sem selo "Fotografia ilustrativa", com `fetchPriority="high"`, `width`/`height` e variantes responsivas AVIF/WebP.
- Cards de serviço usam foto real apenas quando o conteúdo corresponde ao serviço. Martelinho mantém imagem ilustrativa identificada.
- Galeria antes/depois permanece ilustrativa e identificada, pois não foram fornecidos pares reais.
- Contato usa telefone oficial e dados atualizados; não há envio automático nem persistência de dados.
- Rotas internas de agendamento, acompanhamento e proposta recebem o nome MASTER sem alteração de lógica.

## 4. Requisitos Não-Funcionais

- **Acessibilidade:** `alt` útil em imagens informativas, `alt=""` em decorativas, contraste preservado, foco e teclado inalterados.
- **Desempenho:** imagens abaixo da dobra com `loading="lazy"`; hero sem lazy; variantes responsivas; sem novas dependências.
- **Segurança:** nenhum caminho local no código; nenhum script do acervo executado; nenhuma credencial alterada.
- **Compatibilidade:** manter React 19, TanStack Start, Vite 8, Bun e a porta 5210.
- **Observabilidade:** nenhuma alteração de infraestrutura.

## 5. Critérios de Aceite

### AC-071-01

```yaml
id: AC-071-01
title: Identidade MASTER aplicada em todas as páginas públicas
preconditions:
  - Build local disponível
action: Navegar por /, /servicos, /servicos/funilaria, /servicos/pintura-automotiva, /servicos/martelinho-de-ouro, /trabalhos, /para-corretores, /sobre, /contato, /privacidade
expected_result: Nenhum texto visível "BRS", "Bruno", endereço ou telefone antigos; nome MASTER presente no header, footer, títulos e metadados
evidence_type: automated
```

### AC-071-02

```yaml
id: AC-071-02
title: Logo oficial aplicada com integridade visual
preconditions:
  - Logo oficial disponível no acervo
action: Abrir home em desktop e mobile e inspecionar header, footer e favicon
expected_result: Logo MASTER legível, sem distorção, corte indevido ou fundo branco indesejado; favicon e manifest atualizados
evidence_type: manual
```

### AC-071-03

```yaml
id: AC-071-03
title: Fotos reais aplicadas somente em contexto compatível
preconditions:
  - Fotos reais fornecidas
action: Inspecionar hero, cards de serviço, mídia expandida, sobre, contato e para-corretores
expected_result: Hero e pintura usam fotos reais da estufa; guincho usa foto real do reboque; martelinho e antes/depois permanecem ilustrativos e identificados
evidence_type: manual
```

### AC-071-04

```yaml
id: AC-071-04
title: Dados de contato e horários atualizados
preconditions:
  - Dados fornecidos pelo cliente
action: Abrir /contato, footer e JSON-LD
expected_result: Av. Maripá, 4138 — Centro, Toledo-PR, 85901-000; (45) 99954-5442; horários 08h-12h e 13h30-18h30; sem telefone/endereço antigos
evidence_type: automated
```

### AC-071-05

```yaml
id: AC-071-05
title: Performance e semântica de imagens preservadas
preconditions:
  - Build de produção
action: Inspecionar HTML renderizado e executar build
expected_result: Hero com fetchPriority high e dimensões intrínsecas; imagens abaixo da dobra lazy; ausência de referências quebradas; build concluído
evidence_type: automated
```

### AC-071-06

```yaml
id: AC-071-06
title: Nenhuma publicação em produção
preconditions:
  - Trabalho concluído na branch de feature
action: Verificar git status, branches e remotos
expected_result: Alterações apenas na branch de trabalho; nenhum push, merge, deploy ou alteração de DNS
evidence_type: manual
```

## 6. Abordagem Técnica

- Preservar a árvore de componentes e rotas; substituir dados no módulo canônico `src/lib/brs.ts`.
- Derivar imagens do acervo local com ImageMagick, sem dependências novas: recortes 16:9 para hero, WebP/AVIF responsivos e WebP para cards.
- Criar versão trimada da logo e favicons a partir do arquivo oficial, mantendo o fundo preto original.
- Manter o pipeline de hero existente (`hero-config.ts` + `public/hero/`), trocando apenas as fontes e removendo o selo ilustrativo.
- Atualizar testes que fixam texto/telefone/identidade, mantendo o comportamento funcional.
- Não renomear arquivos `brs.ts`, `components/brs/` ou rotas para limitar o diff.

## 7. Riscos e Dependências

| Risco ou dependência | Impacto | Probabilidade | Mitigação | Responsável |
| -------------------- | ------- | ------------- | --------- | ----------- |
| Fotos reais de PDR e pares antes/depois ausentes | Médio | Alta | Manter ilustrativas com rótulo explícito e registrar pendência | Implementação |
| Logo com fundo preto sobre header quase preto | Baixo | Média | Usar versão trimada e testar contraste visual | Design |
| Dados de avaliação Google ambíguos | Baixo | Média | Não publicar contagem de avaliações no JSON-LD; usar apenas dados confirmados | Produto |
| Testes existentes fixam BRS/Bruno | Médio | Alta | Atualizar expectativas para MASTER sem afrouxar comportamento | QA |

## 8. Aprovação

| Papel      | Nome                                           | Decisão  | Data       | Notas                                      |
| ---------- | ---------------------------------------------- | -------- | ---------- | ------------------------------------------ |
| Produto    | Solicitação humana explícita                    | Approved | 2026-10-19 | Nova proposta MASTER com dados fornecidos  |
| Engenharia | Senior Full Stack / UX-UI Engineer (SDD)        | Approved | 2026-10-19 | Implementação em branch isolada            |
