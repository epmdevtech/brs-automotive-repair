# SPEC-044: Padronização da Hierarquia Tipográfica e Títulos Monocromáticos (Eliminação de Bicolorismo de IA)

## Status
- **Status**: APROVADO
- **Data**: 2026-10-14
- **Autor**: Engenheiro Frontend Sênior & Lead UI/UX Designer
- **Task Ref**: TASK-044-01

---

## 1. Contexto e Motivação

Em várias rotas do projeto BRS (`/`, `/servicos`, `/para-corretores`, `/sobre`, `/contato`, `/privacidade`), os títulos principais (`h1`, `h2`) vinham aplicando um padrão visual redundante típico de templates gerados por inteligência artificial: divisão de frases em duas cores (a primeira metade em branco e a segunda em dourado/âmbar `text-primary`).

Como o tom dourado/âmbar é a cor de destaque exclusiva dos botões de ação e conversão (CTAs primários como o botão de "Avaliação" no Header), sua presença indiscriminada em grandes massas de texto nos títulos gera concorrência visual severa, degrada o *affordance* dos botões de conversão e prejudica a legibilidade e a sobriedade técnica exigida por uma oficina automotiva premium.

---

## 2. Escopo Normativo

1. **Monocromatismo em Branco para Títulos (`h1`, `h2`)**:
   - Todo título principal em heróis de página e seções institucionais deve ser estritamente monocromático em branco (`text-white` ou `text-zinc-100`).
   - Eliminação de quebras artificiais de cor com `<span>` filhas contendo `text-primary`, `text-amber-*`, `text-yellow-*` ou `text-[#c59a5b]`.

2. **Reserva Estrita da Cor Dourada/Âmbar (`text-primary` / `bg-primary`)**:
   - Botões de conversão principais (CTA primário / `.btn--primary`).
   - Eyebrows e badges técnicos de seção (ex: `ESPECIALIDADES TÉCNICAS DA OFICINA`).
   - Micro-ícones de suporte ou detalhes pontuais de status (LED indicador, checkmarks).

3. **Mapeamento de Ajustes Canônicos**:
   - **Home (`/`)**: No Hero, título unificado para `BRS Reparações Automotivas.` totalmente em branco.
   - **Serviços (`/servicos`)**: No Hero, título unificado para `Recuperação técnica de precisão. Preservação do padrão de fábrica.` totalmente em branco.
   - **Para Corretores (`/para-corretores`)**: No Hero, título unificado para `Tranquilidade para o Corretor. Cuidado Rigoroso com o Segurado.` totalmente em branco.
   - **Sobre / A BRS (`/sobre`)**: No Hero, título unificado para `Oficina Técnica Especializada em Toledo, Paraná.` totalmente em branco.
   - **Contato (`/contato`)**: No Hero, títulos unificados para strings puras em branco (`Canal Direto para Corretores. Agilidade e Respaldo Técnico.` ou `O primeiro passo é um diagnóstico transparente.`).
   - **Privacidade (`/privacidade`)**: No Hero, título unificado para `Transparência e Respeito à sua Privacidade.` totalmente em branco.
   - **Filosofia / Princípios (`src/components/brs/philosophy.tsx`)**: No `h2`, unificar `Critério técnico e cuidado em cada etapa.` sem destaque dourado.

---

## 3. Critérios de Aceitação (AC)

- **AC-044-01**: O H1 da Home (`Hero`) deve renderizar `BRS Reparações Automotivas.` de forma contínua em branco, sem spans com `text-primary` ou `text-amber-*`.
- **AC-044-02**: Os heróis das rotas internas (`/servicos`, `/para-corretores`, `/sobre`, `/contato`, `/privacidade`) devem renderizar seus títulos `h1` como texto monocromático em branco.
- **AC-044-03**: Nenhum título de seção `h2` em `philosophy.tsx` ou heróis deve possuir spans decorativos em dourado/âmbar.
- **AC-044-04**: A cor `text-primary` permanece intacta nos eyebrows, botões de ação e micro-ícones de status.
- **AC-044-05**: Cobertura de testes unitários garantindo a ausência de classes de cor secundária em headings de heróis e páginas chave.
