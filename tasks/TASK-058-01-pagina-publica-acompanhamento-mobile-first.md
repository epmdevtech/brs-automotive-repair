# TASK-058-01: Implementação da Página Pública de Acompanhamento do Reparo Mobile-First (WCAG 2.2 AA)

## Metadados

| Campo       | Valor                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------ |
| Task ID     | TASK-058-01                                                                                |
| Spec Ref    | SPEC-058                                                                                   |
| Título      | Implementação da Página Pública de Acompanhamento Mobile-First, Acessível e com DTO Seguro |
| Status      | Concluído                                                                                  |
| Data        | 2026-10-15                                                                                 |
| Responsável | Staff Product Designer & Engenheiro Front-end Sênior                                       |
| Módulo      | `routes/acompanhar` & `features/booking`                                                   |

---

## 1. Escopo de Implementação

1. **Isolamento de Layout**:
   - Ajustar `SiteLayout` (`src/components/brs/site-layout.tsx`) para ignorar `/acompanhar`.
   - Criar header dedicado enxuto, sólido, no fluxo (`position: sticky`, 56px/64px) sem links de marketing.
2. **Hero de Status Acima da Dobra (360×640)**:
   - Eyebrow mono com protocolo e botão de cópia com feedback acessível.
   - Fase atual em linguagem simples e linha de apoio para próxima etapa.
   - Barra de progresso segmentada de 6 etapas acessível.
   - Botão-âncora "Ver etapa atual" e variante para aprovação de orçamento.
3. **Card Compacto de Veículo e Protocolo**:
   - Pares rótulo/valor com placa mascarada (`BCX-***4`).
   - Técnico responsável com primeiro nome real ou omitido.
4. **Linha do Tempo Responsiva**:
   - Marcadores de 24px perfeitamente alinhados à primeira linha do título.
   - Conectores de 2px e ausência de selos "Aguardando" repetidos em etapas futuras.
   - Mobile recolhível para concluídas; desktop em grid de 2 colunas com sticky left.
5. **Contraste & Tema Dark Premium**:
   - `color-scheme: dark`, contrastes auditados acima de 4.5:1 em todos os textos.
6. **Contato Rápido & Barra Inferior**:
   - Telefone institucional e WhatsApp com mensagem pré-formatada do protocolo.
   - Barra inferior fixa no mobile com padding de compensação no main.
7. **Copy em Sentence Case & Sincronização**:
   - Indicador de última atualização, tratamento offline com reconexão e aria-live.
8. **Privacidade & DTO Público**:
   - Projeção de dados segura via função pura `toPublicCustomerTrackingDto`.
   - Metadados `noindex, nofollow`, `Referrer-Policy: no-referrer`, `Cache-Control: no-store`.
9. **Testes e Validação**:
   - Suíte de testes automatizados completa com 100% de aprovação.
   - Execução dos quality gates (Vitest, ESLint, Vite build).

---

## 2. Critérios de Aceite

- [x] Header não sobrepõe conteúdo em scrollY=0 nem após rolar ou usar âncoras.
- [x] Header sem links de marketing nem botão "Avaliação".
- [x] Em 360×640 px, informações vitais visíveis sem rolagem.
- [x] Sem rolagem horizontal de 320px a 2560px e com zoom até 400%.
- [x] Marcadores alinhados à primeira linha do título.
- [x] Textos com contraste ≥4.5:1 e alvos de toque ≥44px.
- [x] Etapas futuras sem selo "Aguardando" repetido.
- [x] Horário de atualização visível e tratamento offline ativo.
- [x] DTO público seguro sem vazamento de dados internos.
- [x] Testes e quality gates 100% aprovados.
