# TASK-044-01: Padronização da Hierarquia Tipográfica e Títulos Monocromáticos

- **Spec Ref**: SPEC-044
- **Status**: CONCLUÍDO
- **Data**: 2026-10-14
- **Responsável**: Engenheiro Frontend Sênior & Lead UI/UX Designer

---

## 1. Descrição

Executar a varredura global e refatoração dos títulos principais (`h1`, `h2`) nas rotas e componentes do projeto BRS, eliminando a quebra visual artificial de frases em duas cores (branco + dourado/âmbar) e unificando-os em branco monocromático (`text-white`).

---

## 2. Checklist de Execução

- [x] **Home (`Hero`)**: Alterar o título em `src/components/brs/hero.tsx` e fallback de `src/components/brs/animated-hero.tsx` para `BRS Reparações Automotivas.` de forma unificada em branco.
- [x] **Serviços (`/servicos`)**: Atualizar o `title` do `PageHero` em `src/routes/servicos/index.tsx` para `Recuperação técnica de precisão. Preservação do padrão de fábrica.` totalmente em branco.
- [x] **Para Corretores (`/para-corretores`)**: Atualizar o `title` em `src/routes/para-corretores.tsx` para `Tranquilidade para o Corretor. Cuidado Rigoroso com o Segurado.` totalmente em branco.
- [x] **Sobre / A BRS (`/sobre`)**: Atualizar o `title` em `src/routes/sobre.tsx` para `Oficina Técnica Especializada em Toledo, Paraná.` totalmente em branco.
- [x] **Contato (`/contato`)**: Atualizar os títulos em `src/routes/contato.tsx` para remover spans de cor dourada.
- [x] **Privacidade (`/privacidade`)**: Atualizar o `title` em `src/routes/privacidade.tsx` para `Transparência e Respeito à sua Privacidade.` sem span dourado.
- [x] **Filosofia (`philosophy.tsx`)**: Remover o span `text-primary` do `h2` em `src/components/brs/philosophy.tsx`.
- [x] **Sincronização de Testes Existentes**: Atualizar `src/test/hero-colors.test.tsx`, `src/test/motion-system.test.tsx` e `src/test/ux-ui-consolidation-three-routes.test.tsx`.
- [x] **Nova Suite de Testes**: Criar `src/test/monochromatic-headings.test.tsx` para validar a ausência de spans e cores douradas nos títulos principais.
- [x] **Quality Gates**: Passar com 100% em Vitest, ESLint e Build Nitro SSR.
