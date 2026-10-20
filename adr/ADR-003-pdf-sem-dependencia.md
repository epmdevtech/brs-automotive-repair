# ADR-003 — Geração de PDF sem dependência externa, no servidor

| Campo      | Valor                                                        |
| ---------- | ------------------------------------------------------------ |
| ID         | ADR-003                                                      |
| Status     | Accepted                                                     |
| Data       | 2026-10-20                                                  |
| Decisores  | Engenharia EPMDEVTECH                                       |
| Refs:      | SPEC-075; TASK-075-02                                       |

## Contexto

O painel administrativo precisa baixar a evidência de um briefing em PDF. O
runtime de produção é o Node da Vercel, sem Chromium instalado; o Playwright é
apenas dependência de desenvolvimento e não pode ser usado em produção. As
bibliotecas de PDF mais usuais (`pdfkit`, `pdf-lib`, `jspdf`) acrescentariam
dependência e, no caso de renderização em navegador, shipping de um runtime no
cliente. Um gerador por script com Chromium (o caminho usado na SPEC-074) exige
Chromium no servidor.

## Decisão

Implementar um **escritor de PDF mínimo, sem dependência, executado no
servidor**:

1. PDF 1.4 com fontes padrão (Helvetica, Helvetica-Bold, Courier) e
   codificação WinAnsi/CP1252, o que preserva a acentuação do português.
2. Tabelas de objetos com `xref` e `trailer` calculados sobre o buffer em
   latin1, sem compressão — o documento é pequeno e a simplicidade reduz risco.
3. Camada de composição separada da camada de escrita: `pdf-writer.ts` (primitivas
   de texto, linhas, retângulos, paginação) e `briefing-document.ts` (conteúdo do
   documento de evidência).
4. A exportação é uma Server Function que exige sessão e papel `admin`, lê o
   registro no servidor e devolve o arquivo em base64; o navegador apenas
   dispara o download.
5. Validação automatizada por extração de texto com ferramenta externa
   (`pdftotext`) quando disponível no ambiente, além de asserções estruturais
   (cabeçalho, objetos, contagem de páginas) que rodam em qualquer ambiente.

### Alternativas consideradas

| Alternativa | Motivo da recusa |
| ------------ | ---------------- |
| `pdfkit` ou `pdf-lib` | Dependência nova em produção sem necessidade demonstrada; o conjunto de recursos exigido é pequeno. |
| Playwright/Chromium no servidor | Não disponível no runtime da Vercel e pesado para uma função. |
| `jspdf` no cliente | Envia ao navegador a geração de documento com dados do cliente, o que amplia a superfície de exposição e o bundle. |
| Impressão do navegador (Ctrl+P) | Não entrega arquivo baixável com nome previsível e não atende a exigência de "exportar o PDF" pelo painel. |
| HTML como "PDF" | Não é PDF e não é aceito por fluxos documentais. |

## Consequências

**Positivas**

- Sem dependência nova e sem binário adicional em produção.
- Geração no servidor: nenhum dado do briefing trafega para o cliente além do
  documento final, e a autorização é verificada antes da leitura.
- Testável de ponta a ponta com extração de texto.

**Negativas**

- O escritor não cobre imagens, tabelas complexas, hyperlinks ou compressão.
- Mudanças de layout exigem trabalho no escritor, não em um parâmetro.
- A validação por `pdftotext` depende de ferramenta externa presente no
  ambiente de teste; onde faltar, restam as asserções estruturais.

## Situação de implantação

Implementado na branch `feature/master-briefing-ux`, com testes de unidade do
escritor e do documento, teste de autorização e percurso E2E do download.
