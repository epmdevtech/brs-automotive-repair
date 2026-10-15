# SPEC-038 — Remoção de Artefatos Genéricos de IA (OFICINA ATIVA, Badges LED Pulsantes e Botões All-Caps)

## Metadados

| Campo        | Valor                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| ID           | `SPEC-038`                                                                                            |
| Título       | Remoção de Artefatos Genéricos de IA (OFICINA ATIVA, Badges LED Pulsantes e Botões All-Caps)          |
| Data Criação | 2026-10-14                                                                                            |
| Status       | Approved (Aprovada)                                                                                   |
| Autor        | Engenheiro de Software Sênior & Especialista em Design Systems EPM DevTech                            |
| Prioridade   | Alta (P0)                                                                                             |
| Impacto      | `src/routes/sobre.tsx`, `src/components/brs/hero.tsx`, `src/components/brs/final-cta.tsx`, `servicos` |

---

## 1. Contexto e Motivação

Identificou-se através de capturas visuais da interface elementos gráficos estereotipados de geração por IA que empobrecem o posicionamento de uma oficina de reparação automotiva premium e de alta precisão em Toledo-PR:

1. **Badge de status de servidor "OFICINA ATIVA" (`Captura de tela de 2026-10-14 17-55-02.png`)**:
   - Localizado em `src/routes/sobre.tsx`.
   - Simula um widget de telemetria / uptime de servidor de TI (`OFICINA ATIVA` com ponto verde `bg-emerald-400 animate-pulse` e rótulo `BRS.HQ // TOLEDO-PR`). Esse padrão é um clichê de IA incompatível com o setor automotivo artesanal.
2. **Caixa pill decorativa com LED pulsante no Hero (`Captura de tela de 2026-10-14 17-55-14.png`)**:
   - Localizado em `src/components/brs/hero.tsx`.
   - Um container em estilo HUD (`bg-black/45 backdrop-blur-md border border-white/10`) com bullet LED pulsante dourado (`led-status-pulse`). Disputa atenção com a proposta de valor e remete a templates genéricos de SaaS.
3. **Botões em Caixa Alta Forçada "SOLICITAR AVALIAÇÃO" (`Captura de tela de 2026-10-14 17-55-23.png`)**:
   - Localizados em `src/components/brs/final-cta.tsx` e `src/routes/servicos/index.tsx`.
   - O uso de letras maiúsculas integrais ("SOLICITAR AVALIAÇÃO") destoa da tipografia refinada e acolhedora do restante do site ("Solicitar avaliação", "Conhecer os serviços", "Ver galeria completa").

---

## 2. Requisitos e Critérios de Aceite

### AC-038-01 — Remoção do Badge "OFICINA ATIVA" em `/sobre`

- Excluir o selo verde pulsante `OFICINA ATIVA` e o identificador `BRS.HQ // TOLEDO-PR` em `src/routes/sobre.tsx`.
- Substituir por um cabeçalho institucional sóbrio e autêntico: `Oficina em Toledo, Paraná`.

### AC-038-02 — Limpeza do Eyebrow do Hero

- Eliminar o container em caixa escurecida com borda e o ponto `led-status-pulse` em `src/components/brs/hero.tsx`.
- Substituir por um eyebrow tipográfico direto e elegante utilizando a classe normativa `.eyebrow` ou tipografia primária limpa (`Oficina Técnica Especializada • Toledo, PR`).

### AC-038-03 — Padronização Tipográfica dos Botões (Anti-All-Caps)

- Substituir o texto all-caps `SOLICITAR AVALIAÇÃO` por `Solicitar avaliação` (sentence case com inicial maiúscula) em `src/components/brs/final-cta.tsx` e `src/routes/servicos/index.tsx`.
- Garantir coerência visual em toda a interface institucional.

### AC-038-04 — Quality Gates e Testes Automatizados

- Implementar suite de testes `src/test/anti-ai-artifacts.test.tsx` garantindo que:
  - O texto "OFICINA ATIVA" não existe no DOM da página `/sobre`.
  - O Hero não renderiza classes de animação pulsante artificial (`led-status-pulse`) nem containers de pill no eyebrow.
  - O botão de CTA final utiliza texto em sentence case ("Solicitar avaliação").
- Garantir 100% dos testes Vitest passando, 0 erros no ESLint e build Nitro SSR com sucesso.
