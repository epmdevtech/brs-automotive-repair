# TASK: Execução da Auditoria Técnica e Refinamento Profissional

## Metadados

| Campo        | Valor                                                            |
| ------------ | ---------------------------------------------------------------- |
| ID           | TASK-003-01                                                      |
| Status       | Done                                                             |
| Responsável  | Engenharia de Software EPMDEVTECH                                |
| SPEC         | SPEC-003                                                         |
| Critérios    | AC-003-01, AC-003-02, AC-003-03, AC-003-04, AC-003-05, AC-003-06 |
| Dependências | SPEC-003                                                         |

---

## Objetivo

Executar a auditoria técnica de ponta a ponta: refatorar o tratamento de erros para neutralidade de plataforma, modularizar o componente `Website` em submódulos limpos, revisar a redação comercial e pontuação em português brasileiro, alinhar as telas de erro ao design system escuro e enriquecer os metadados de SEO e redes sociais.

---

## Escopo

### Incluído

- Criação de `src/lib/error-reporting.ts` e atualização de `src/routes/__root.tsx`.
- Localização e estilização de `src/lib/error-page.ts`.
- Decomposição modular de `src/components/brs/website.tsx` em:
  - `src/components/brs/brand.tsx`
  - `src/components/brs/header.tsx`
  - `src/components/brs/hero.tsx`
  - `src/components/brs/services.tsx`
  - `src/components/brs/philosophy.tsx`
  - `src/components/brs/project-gallery.tsx`
  - `src/components/brs/process-timeline.tsx`
  - `src/components/brs/partner-section.tsx`
  - `src/components/brs/pickup.tsx`
  - `src/components/brs/about.tsx`
  - `src/components/brs/faq-accordion.tsx`
  - `src/components/brs/contact-form.tsx`
  - `src/components/brs/contact.tsx`
  - `src/components/brs/final-cta.tsx`
  - `src/components/brs/footer.tsx`
  - Atualização de `src/components/brs/website.tsx` como orquestrador limpo.
- Revisão de textos, remoção de travessões longos "—" nos textos públicos e eliminação de clichês de IA.
- Inclusão de `og:image` e validação de acessibilidade.
- Execução dos testes e verificação de lint.

### Não incluído

- Alteração em regras comerciais ou criação de rotas fictícias.

---

## Validação

| Critério/risco        | Teste, comando ou revisão          | Evidência esperada                          |
| --------------------- | ---------------------------------- | ------------------------------------------- |
| AC-003-01 / AC-003-03 | Inspeção de rotas de erro e código | Textos em português, sem marcas de gerador  |
| AC-003-02             | Inspeção de arquivos e build       | Módulos desacoplados compilando normalmente |
| AC-003-04             | Grep de textos e inspeção visual   | Ausência de travessões em textos comerciais |
| AC-003-05             | Inspeção de `src/routes/index.tsx` | Metadados OG e Schema completos             |
| AC-003-06             | `make check`                       | Lint, testes e build 100% aprovados         |

---

## Condição de conclusão

- [x] Todas as referências desnecessárias a ferramentas de geração removidas da experiência pública.
- [x] Módulos refatorados e testados.
- [x] Textos e pontuação revisados.
- [x] Telas de erro localizadas e estilizadas.
- [x] `make check` aprovado sem erros.
