# SPEC: Implementar Footer Premium Minimal BRS

## Metadados

| Campo                               | Valor                                                   |
| ----------------------------------- | ------------------------------------------------------- |
| ID                                  | SPEC-013                                                |
| Status                              | Implemented                                             |
| Responsável                         | Engenharia Front-end EPMDEVTECH                         |
| Revisores                           | Produto / Design / Engenharia / QA EPMDEVTECH           |
| Criado                              | 2026-10-11                                              |
| Atualizado                          | 2026-10-11                                              |
| Lançamento alvo                     | `0.1.0`                                                 |
| Briefing de UX relacionado          | Implementação de Footer Premium Estilo 21st.dev Minimal |
| Especificação de design relacionada | Dark Automotive Premium Design System                   |
| ADRs relacionadas                   | N/A                                                     |

---

## 1. Problema e Resultado

O rodapé existente necessita de elevação estética, alinhando-se aos padrões de microinteração e design editorial contemporâneo (referência 21st.dev Minimal Footer), sem perder a sobriedade automotiva da BRS Reparações Automotivas.

### Diretrizes de Implementação

1. **Estética Editorial Automotiva**:
   - Fundo escuro profundo integrado à paleta do site (`bg-background` / slate grafite).
   - Divisores sutis (`border-border`), tipografia com títulos em Sora (`font-display font-semibold`) e corpo em Manrope (`font-sans`).
   - Acentos discretos em ouro âmbar (`text-primary`, `hover:text-primary`).
   - Sem gradientes chamativos, excesso de brilho ou estética genérica de landing page SaaS.
2. **Componente Reutilizável**:
   - Criar `src/components/ui/minimal-footer.tsx` e integrá-lo em `src/components/brs/footer.tsx` e `src/components/brs/website.tsx`, garantindo que **exatamente um footer** seja renderizado no DOM.
3. **Dados Reais e Confiáveis**:
   - Logotipo oficial da BRS (`<Brand />`).
   - Descrição institucional autêntica: _"Funilaria, pintura automotiva e martelinho de ouro com atenção aos detalhes e cuidado em cada etapa."_
   - Links apenas para âncoras reais existentes (`#inicio`, `#servicos`, `#trabalho`, `#corretores`, `#sobre`, `#contato`).
   - Canais de contato reais: Telefone `(45) 2035-9440` com link `tel:` normalizado e Instagram oficial `@brsreparacoes` com `target="_blank"` e `rel="noopener noreferrer"`.
   - Sem menção a WhatsApp não confirmado, redes sociais falsas (sem Twitter, Facebook ou GitHub) ou certificações fictícias.
4. **Rodapé Legal e Acessibilidade**:
   - Ano atual calculado dinamicamente (`new Date().getFullYear()`).
   - Identificação institucional e nota de transparência sobre fotos ilustrativas.
   - Navegação por teclado com anéis de foco acessíveis e tags semânticas `footer`, `nav` e `h3`.

---

## 2. Escopo

### No escopo (In scope)

- Criar `src/components/ui/minimal-footer.tsx` com design responsivo desktop e mobile.
- Refatorar `src/components/brs/footer.tsx` para consumir o `MinimalFooter`.
- Integrar navegação ancorada, catálogo de serviços e canais oficiais confirmados.
- Criar suíte de testes em `src/test/minimal-footer.test.tsx`.
- Validar via `make check`.

### Fora do escopo (Out of scope)

- Criar páginas externas de termos/política inexistentes.
- Adicionar listeners contínuos de scroll ou efeitos pesados de cortina/parallax.

---

## 3. Critérios de Aceitação

- [AC-013-01] O componente `MinimalFooter` deve ser criado em `src/components/ui/minimal-footer.tsx` e renderizado sem duplicações na landing page.
- [AC-013-02] O footer deve exibir a marca oficial da BRS e o texto institucional aprovado sem dados corporativos falsos.
- [AC-013-03] Todos os links de navegação e serviços devem apontar para âncoras existentes (`#inicio`, `#servicos`, `#trabalho`, `#corretores`, `#sobre`, `#contato`).
- [AC-013-04] O canal social deve conter exclusivamente o Instagram oficial (`@brsreparacoes`) e o telefone `(45) 2035-9440` com link `tel:`.
- [AC-013-05] O copyright deve exibir o ano dinamicamente e nota de transparência sobre acervo ilustrativo temporário.
- [AC-013-06] Todos os Quality Gates (`make check`) devem passar com 100% de sucesso.
