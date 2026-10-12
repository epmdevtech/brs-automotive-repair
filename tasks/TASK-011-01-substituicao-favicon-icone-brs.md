# TASK: Substituição do Favicon Lovable pelo Ícone Oficial BRS Reparações Automotivas

## Metadados

| Campo        | Valor                                                            |
| ------------ | ---------------------------------------------------------------- |
| ID           | TASK-011-01                                                      |
| Status       | Done                                                             |
| Responsável  | Engenharia Front-end EPMDEVTECH                                  |
| SPEC         | SPEC-011                                                         |
| Critérios    | AC-011-01, AC-011-02, AC-011-03, AC-011-04, AC-011-05, AC-011-06 |
| Dependências | SPEC-011                                                         |

---

## Objetivo

Expurgar definitivamente o favicon residual da Lovable e implementar o sistema oficial de ícones e favicons da BRS Reparações Automotivas em formato SVG, ICO multiresolução e PNG para PWA/mobile, atualizando os metadados do documento em `src/routes/__root.tsx`.

---

## Escopo

### Incluído

- Remoção do binário legado `public/favicon.ico`.
- Geração do `public/favicon.svg` com a identidade visual da BRS (grafite escuro, contorno dourado metálico, tipografia "BRS").
- Renderização e geração de `public/favicon.ico` com múltiplas resoluções (16x16, 32x32, 48x48).
- Geração de `public/apple-touch-icon.png` (180x180), `public/favicon-96x96.png`, `public/web-app-manifest-192x192.png` e `public/web-app-manifest-512x512.png`.
- Criação de `public/site.webmanifest`.
- Atualização das tags `<link>` no Head de `src/routes/__root.tsx`.
- Criação da suíte de testes `src/test/favicon.test.tsx`.
- Validação total dos Quality Gates via `make check`.

### Não incluído

- Alterações no catálogo de serviços ou números de telefone da BRS.

---

## Validação

| Critério/risco | Teste, comando ou revisão              | Evidência esperada                                                |
| -------------- | -------------------------------------- | ----------------------------------------------------------------- |
| AC-011-01      | Inspeção do hash e conteúdo do favicon | Arquivo Lovable de 20KB removido; novo ICO gerado                 |
| AC-011-02      | Inspeção de `public/favicon.svg`       | SVG válido com padrão escuro e monograma BRS                      |
| AC-011-03      | Inspeção de `public/favicon.ico`       | ICO multiresolução (16x16, 32x32, 48x48)                          |
| AC-011-04      | Verificação de arquivos em `public/`   | Ícones PNG e `site.webmanifest` presentes                         |
| AC-011-05      | Inspeção de `src/routes/__root.tsx`    | Tags `<link rel="icon">`, `apple-touch-icon` e `manifest` no Head |
| AC-011-06      | `make check`                           | Vitest, ESLint, TypeScript e Build 100% aprovados                 |

---

## Condição de conclusão

- [x] Favicon legado da Lovable removido.
- [x] `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` e ícones PWA gerados com sucesso.
- [x] `public/site.webmanifest` criado.
- [x] `src/routes/__root.tsx` atualizado com as tags de favicon.
- [x] Suíte de testes `src/test/favicon.test.tsx` criada e aprovada.
- [x] Quality gates aprovados com `make check`.
- [x] `REVIEW-011` criado e aprovado.
