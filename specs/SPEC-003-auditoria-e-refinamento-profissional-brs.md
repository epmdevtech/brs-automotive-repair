# SPEC: Auditoria Técnica, Remoção de Artefatos de IA e Refinamento Profissional

## Metadados

| Campo                               | Valor                                         |
| ----------------------------------- | --------------------------------------------- |
| ID                                  | SPEC-003                                      |
| Status                              | Implemented                                   |
| Responsável                         | Engenharia de Software EPMDEVTECH             |
| Revisores                           | Produto / Design / Engenharia / QA EPMDEVTECH |
| Criado                              | 2026-10-11                                    |
| Atualizado                          | 2026-10-11                                    |
| Lançamento alvo                     | `0.1.0`                                       |
| Briefing de UX relacionado          | Diretrizes de Posicionamento e Identidade BRS |
| Especificação de design relacionada | Dark Automotive Premium Design System         |
| ADRs relacionadas                   | N/A                                           |

---

## Problema e resultado

O website institucional da BRS Reparações Automotivas foi previamente estruturado com auxílio de ferramentas de geração de código. A plataforma necessita de uma auditoria minuciosa para eliminar referências explícitas a geradores no código público, telas de erro e metadados, modularizar a base de código monolítica (`website.tsx` com quase 1000 linhas), remover vícios de escrita de IA (como travessões "—" em excesso e clichês publicitários), unificar o sistema iconográfico automotivo e aperfeiçoar SEO, sem alterar as regras de negócio reais nem criar dependências artificiais.

---

## Escopo

### No escopo (In scope)

- **Remoção de marcas de geração**: Eliminar referências públicas/visuais nas telas de erro, rotas e metadados; refatorar o tratamento de erro para módulo neutro e profissional (`src/lib/error-reporting.ts`).
- **Localização e Identidade das Telas de Erro**: Refatorar `NotFoundComponent`, `ErrorComponent` e `src/lib/error-page.ts` para português brasileiro com paleta escura condizente com a marca BRS.
- **Modularização do Componente Principal**: Decompor o monólito `src/components/brs/website.tsx` em submódulos coesos em `src/components/brs/` (Header, Hero, Services, Philosophy, ProjectGallery, ProcessTimeline, PartnerSection, Pickup, About, FAQAccordion, ContactForm, FinalCTA, Footer), mantendo `website.tsx` como orquestrador.
- **Refinamento de Textos e Remoção de Vícios de IA**: Substituir travessões longos "—" em textos visíveis e atributos por pontuação natural; remover expressões artificiais (como "Mais do que reparar", "solução completa"), tornando o tom de voz técnico, direto e crível.
- **Padronização Iconográfica**: Utilizar ícones consistentes, proporcionais e com acessibilidade (`aria-hidden` para decorativos e rótulos acessíveis para interativos).
- **SEO & Metadados**: Adicionar imagem Open Graph (`og:image`) nas rotas e enriquecer dados estruturados Schema.org.

### Fora do escopo (Out of scope)

- Remoção de pacotes essenciais do runtime de build (como `@lovable.dev/vite-tanstack-config`).
- Modificação das regras de negócio validadas (número de telefone, proibição de WhatsApp falso, Instagram oficial).
- Criação de novos serviços ou inclusão de dados fictícios.

---

## Critérios de Aceitação

- [AC-003-01] Nenhuma referência ao Lovable ou marcadores de IA devem aparecer nas telas públicas de erro, 404, títulos ou atributos da interface.
- [AC-003-02] O arquivo `src/components/brs/website.tsx` deve ser modularizado em componentes menores e desacoplados, mantendo 100% de compatibilidade com a rota `src/routes/index.tsx`.
- [AC-003-03] As telas de erro (`src/lib/error-page.ts` e `src/routes/__root.tsx`) devem ser traduzidas para português brasileiro e alinhadas ao design system escuro da BRS.
- [AC-003-04] Todos os textos da interface devem adotar pontuação natural em português brasileiro, eliminando travessões "—" desnecessários e chavões de IA.
- [AC-003-05] Os metadados devem incluir `og:image`, `canonical`, `twitter:card` e Schema.org válido.
- [AC-003-06] Todos os Quality Gates locais (`make check`, testes Vitest, ESLint e build de produção) devem passar com 100% de sucesso.
