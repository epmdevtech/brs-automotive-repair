# SPEC: Substituição do Favicon Lovable pelo Ícone Oficial BRS Reparações Automotivas

## Metadados

| Campo                               | Valor                                                         |
| ----------------------------------- | ------------------------------------------------------------- |
| ID                                  | SPEC-011                                                      |
| Status                              | Implemented                                                   |
| Responsável                         | Engenharia Front-end EPMDEVTECH                               |
| Revisores                           | Produto / Design / Engenharia / QA EPMDEVTECH                 |
| Criado                              | 2026-10-11                                                    |
| Atualizado                          | 2026-10-11                                                    |
| Lançamento alvo                     | `0.1.0`                                                       |
| Briefing de UX relacionado          | Remoção de Resíduo Lovable e Identidade Visual de Favicon BRS |
| Especificação de design relacionada | Dark Automotive Premium Design System                         |
| ADRs relacionadas                   | N/A                                                           |

---

## 1. Problema e Resultado

A auditoria visual realizada na aba do navegador evidenciou que o favicon da aplicação ainda utilizava o ícone legado de template gerado pela plataforma Lovable (um coração estilizado em degradê rosa/laranja/azul).

### Resultado Esperado

1. **Expurgo do Favicon Legado**: Remoção definitiva do arquivo binário `public/favicon.ico` herdado do template.
2. **Identidade Visual Autêntica da BRS**:
   - Criação de um conjunto completo de favicons e ícones de aplicação com o monograma/marca da **BRS Reparações Automotivas**:
     - `public/favicon.svg`: Vetor SVG nítido e responsivo para navegadores modernos, com fundo grafite automotivo arredondado, borda sutil metálica em âmbar dourado (`#f59e0b`) e letras "BRS" em tipografia geométrica de alta legibilidade.
     - `public/favicon.ico`: Pacote ICO multiresolução (16x16, 32x32, 48x48) gerado a partir do design canônico para máxima compatibilidade legada.
     - `public/apple-touch-icon.png`: Ícone de 180x180 para dispositivos iOS e atalhos móveis.
     - `public/favicon-96x96.png`: Ícone de alta densidade para desktops e dispositivos modernos.
     - `public/site.webmanifest`: Manifesto PWA/Web com nome "BRS Reparações Automotivas", theme-color `#0b0d10` e referências aos ícones.
3. **Metadados em `src/routes/__root.tsx`**:
   - Inclusão dos links `icon` (`/favicon.ico`, `/favicon.svg`), `apple-touch-icon` (`/apple-touch-icon.png`) e `manifest` (`/site.webmanifest`).
4. **Garantia de Qualidade**: Suíte de testes automatizados e aprovação de todos os Quality Gates (`make check`).

---

## 2. Escopo

### No escopo (In scope)

- Remover o favicon legado da Lovable em `public/favicon.ico`.
- Projetar e gerar os novos assets de identidade da BRS: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `favicon-96x96.png`, `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png`.
- Criar `public/site.webmanifest` com definições completas da marca.
- Atualizar a tag `<head>` em `src/routes/__root.tsx` com as tags de favicon canônicas.
- Criar suíte de testes `src/test/favicon.test.tsx`.
- Validar via `make check` (Vitest, ESLint, Prettier, Build SSR e rastreabilidade).

### Fora do escopo (Out of scope)

- Alterações em regras de negócio ou componentes internos da landing page.

---

## 3. Critérios de Aceitação

- [AC-011-01] O favicon legado da Lovable com o coração colorido deve ser totalmente eliminado do projeto.
- [AC-011-02] O novo favicon vetorial `public/favicon.svg` deve representar fielmente a identidade da BRS Reparações Automotivas com monograma BRS, fundo grafite escuro e acabamento âmbar dourado.
- [AC-011-03] O arquivo `public/favicon.ico` deve conter múltiplas camadas de resolução (16x16, 32x32, 48x48) perfeitamente renderizadas e legíveis.
- [AC-011-04] Devem ser disponibilizados `apple-touch-icon.png`, `favicon-96x96.png` e `public/site.webmanifest`.
- [AC-011-05] `src/routes/__root.tsx` deve declarar os links de ícone SVG, ICO, Apple Touch Icon e manifesto.
- [AC-011-06] Todos os Quality Gates (`make check`) devem passar com 100% de sucesso.
