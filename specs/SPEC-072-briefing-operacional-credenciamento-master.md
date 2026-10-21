# SPEC-072 — Briefing Operacional e Preparação para Credenciamento da Master

| Campo     | Valor                                                                 |
| --------- | --------------------------------------------------------------------- |
| ID        | `SPEC-072`                                                            |
| Título    | Briefing operacional, comercial e documental da Master Chapeação      |
| Status    | Approved                                                              |
| Data      | 2026-10-20                                                            |
| Autor     | Senior Full Stack / UX-UI Engineer (Universal SDD)                    |
| Escopo    | Reconstrução da rota `/briefing` como coletor guiado em 15 etapas      |
| Refs      | Solicitação humana de 2026-10-20; `PROJECT.md`; `src/lib/brs.ts`        |

---

## 1. Problema e Resultado

A rota `/briefing` atual é um protótipo de 9 etapas voltado à configuração de site e agenda, com dados canônicos pré-preenchidos e exportação de `booking-config.json`. O proprietário da Master precisa registrar informações reais da operação, da documentação e do interesse em credenciamento, sem que dados não confirmados sejam tratados como fatos.

**Resultado esperado:** uma rota privada, acessível apenas por código de acesso de demonstração, com formulário guiado em 15 etapas, rascunho local, revisão, identificação explícita de pendências e exportação de um pacote JSON/relatório legível para revisão da EPM DevTech.

**Medidas de sucesso:** nenhuma informação é publicada automaticamente; toda resposta desconhecida pode ser marcada como pendente; o rascunho sobrevive ao recarregamento no mesmo navegador; a rota permanece fora dos menus públicos e com `noindex`; lint, testes e build aprovados.

## 2. Escopo

### No escopo

- Substituir a UI da rota `/briefing` por um briefing operacional em 15 etapas.
- Modelo de dados estruturado por etapa, com respostas, pendências e metadados de fotos.
- Barreira de acesso por código de demonstração, com sessão de 8 horas no `sessionStorage`.
- Rascunho local versionado em `localStorage`, com validação na leitura e aviso de que os dados não saem do navegador.
- Validação de campos obrigatórios, permitindo marcar respostas como pendentes.
- Indicador de progresso, navegação entre etapas, revisão e correção.
- Categorias de fotos com registro de nome, descrição e autorização, sem upload real.
- Exportação de JSON estruturado e relatório textual/impressão.
- Testes de domínio e de interface, documentação e rastreabilidade.

### Fora do escopo

- Backend, banco de dados, armazenamento de arquivos, envio automático, e-mail transacional ou integração com seguradoras.
- Autenticação de produção, convites assinados no servidor, auditoria ou controle de acesso real.
- Upload, processamento, armazenamento ou publicação de imagens.
- Publicação automática de qualquer resposta no site público.
- Alteração de DNS, domínio, rotas públicas, identidade visual ou deploy de produção.
- Matriz de requisitos de seguradoras com fontes oficiais (será um artefato interno posterior).

## 3. Comportamento Funcional

### Acesso

- A rota exibe uma tela de acesso antes do formulário.
- O código padrão de demonstração é `MASTER-2026`, substituível por `VITE_BRIEFING_ACCESS_CODE` no build.
- A autorização é registrada no `sessionStorage` por 8 horas e pode ser encerrada pelo usuário.
- A tela informa que a barreira é de demonstração e que a proteção real exige backend.

### Formulário

- 15 etapas com os títulos definidos na solicitação.
- Campos agrupados por etapa; matrizes repetitivas usam seletores de status.
- Respostas “Não possui”, “Não se aplica”, “Não sei” e “Precisa confirmar” disponíveis por contexto.
- Campos obrigatórios podem ser marcados como pendentes, exceto declarações finais.
- O avanço é bloqueado somente quando um campo obrigatório não possui resposta nem pendência.
- O rascunho é salvo automaticamente com debounce e pode ser limpo.
- A revisão lista respostas por etapa, pendências e autorizações, permitindo voltar e corrigir.
- A conclusão gera um pacote local e informa explicitamente que nada foi enviado a servidores.

### Fotos

- Categorias de portfólio com status e seleção local de arquivos.
- Apenas metadados (nome, tamanho, tipo e descrição) são persistidos.
- Autorização de publicação inicia desmarcada.
- Arquivos não são lidos, enviados, armazenados nem publicados.

## 4. Requisitos Não-Funcionais

- **Acessibilidade:** labels associados, fieldsets/legends, foco visível, navegação por teclado, `aria-invalid`, mensagens de erro e status em região viva.
- **Responsividade:** uma coluna no mobile, duas/três no desktop, sem overflow horizontal.
- **Desempenho:** sem novas dependências; renderização local; debounce no autosave.
- **Segurança:** nenhum segredo no código; nenhum dado sensível em `localStorage`; nenhum upload; aviso explícito de limitação.
- **Compatibilidade:** React 19, TanStack Start, Vite 8, Bun e porta 5210.
- **Privacidade:** rota `noindex, nofollow`, fora dos menus; dados restritos ao navegador até integração de backend.

## 5. Critérios de Aceite

### AC-072-01

```yaml
id: AC-072-01
title: Rota privada com 15 etapas
preconditions:
  - Build local disponível
action: Acessar /briefing sem sessão, informar o código e percorrer as etapas
expected_result: Acesso bloqueado sem código; após o código, 15 etapas navegáveis com progresso e títulos corretos
evidence_type: automated
```

### AC-072-02

```yaml
id: AC-072-02
title: Pendências e validação
preconditions:
  - Formulário aberto
action: Avançar sem preencher campo obrigatório; marcar o campo como pendente e avançar
expected_result: Avanço bloqueado com mensagem clara; após marcar pendência, o avanço é permitido e a revisão lista o item
evidence_type: automated
```

### AC-072-03

```yaml
id: AC-072-03
title: Rascunho local e retomada
preconditions:
  - Formulário aberto
action: Preencher um campo, aguardar o autosave e recarregar a página
expected_result: O valor é restaurado do localStorage no mesmo navegador; nenhuma requisição de envio é feita
evidence_type: automated
```

### AC-072-04

```yaml
id: AC-072-04
title: Exportação honesta
preconditions:
  - Revisão preenchida
action: Concluir o briefing e exportar
expected_result: JSON e relatório são gerados com status, pendências e aviso de que não houve envio; nenhuma confirmação falsa de submissão
evidence_type: automated
```

### AC-072-05

```yaml
id: AC-072-05
title: Fotos sem upload real
preconditions:
  - Etapa de fotos aberta
action: Selecionar arquivos e marcar autorização
expected_result: Apenas metadados são registrados; a interface informa que os arquivos não foram enviados nem armazenados
evidence_type: automated
```

### AC-072-06

```yaml
id: AC-072-06
title: Isolamento da demonstração pública
preconditions:
  - Rotas públicas existentes
action: Inspecionar menus, SEO e navegação
expected_result: /briefing continua fora dos menus e com noindex; nenhuma rota pública é alterada
evidence_type: automated
```

## 6. Abordagem Técnica

- Criar `src/features/briefing/` com domínio (schema Zod, definições de etapas, progresso, storage, acesso e exportação) e UI (gate, stepper, campos, fotos, revisão e container).
- Manter `src/lib/briefing.ts` para as funções legadas de booking e testes existentes; remover a UI antiga de 9 etapas.
- Substituir o componente importado em `src/routes/briefing.tsx`.
- Não criar novas dependências nem endpoints.
- Atualizar `src/test/briefing-route.test.tsx` e criar testes de domínio do novo briefing.

## 7. Riscos e Dependências

| Risco ou dependência | Impacto | Probabilidade | Mitigação | Responsável |
| -------------------- | ------- | ------------- | --------- | ----------- |
| Ausência de backend e armazenamento seguro | Alto | Certa | Rascunho local, exportação manual, aviso explícito e documentação da infraestrutura necessária | Engenharia |
| Código de acesso no bundle | Alto | Certa | Barreira de demonstração, aviso na UI e requisito de auth server-side antes do uso real | Engenharia |
| Volume de campos (15 etapas) | Médio | Média | Definições data-driven, componentes reutilizáveis e testes de progresso | Engenharia |
| Dados não confirmados tratados como fato | Médio | Média | Pendências explícitas, autorizações desmarcadas e revisão obrigatória | Produto |
| Upload de imagens sem storage seguro | Alto | Média | Não aceitar conteúdo; registrar apenas metadados e instruir envio por canal seguro | Engenharia |

## 8. Aprovação

| Papel      | Nome                                    | Decisão  | Data       | Notas                                      |
| ---------- | --------------------------------------- | -------- | ---------- | ------------------------------------------ |
| Produto    | Solicitação humana explícita             | Approved | 2026-10-20 | Briefing operacional em 15 etapas          |
| Engenharia | Senior Full Stack / UX-UI Engineer (SDD) | Approved | 2026-10-20 | Implementação em branch isolada            |
