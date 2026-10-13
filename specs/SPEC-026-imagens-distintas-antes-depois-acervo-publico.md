# SPEC-026 — Imagens Distintas para Comparadores Antes/Depois e Eliminação de Repetição Visual no Acervo Público

## Metadados

| Campo         | Valor                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------- |
| Identificador | `SPEC-026`                                                                                          |
| Título        | Imagens Distintas para Comparadores Antes/Depois e Eliminação de Repetição Visual no Acervo Público |
| Autor         | Staff Frontend Engineer & UX/UI Designer (EPMDEVTECH)                                               |
| Status        | Aprovado                                                                                            |
| Data          | 2026-10-12                                                                                          |
| Versão        | 1.0.0                                                                                               |

---

## 1. Contexto e Motivação

Durante a inspeção do acervo visual do site da **BRS Reparações Automotivas**, identificou-se que os comparadores de imagem **Antes e Depois** (`HomeBeforeAfter` e `ProjectGallery`) estavam utilizando a mesma imagem de base para o estado "Antes" e "Depois", aplicando apenas filtros CSS artificiais (`filter contrast-125 saturate-50 brightness-90`). Essa abordagem comprometia a credibilidade da demonstração técnica e gerava frustração visual.

Além disso, as mesmas três imagens de arquivo (`funilaria.jpg`, `pintura.jpg`, `martelinho.jpg`) e `brs-hero.jpg` eram repetidas exaustivamente em múltiplos componentes e rotas (Hero, CTA final, seções de serviços na Home, página de corretores e rotas individuais de serviços).

Esta especificação define a substituição por pares de imagens genuinamente distintos para o Antes e Depois de cada especialidade, além da diversificação fotográfica editorial em todo o site, respeitando a identidade visual automotiva escura e luxuosa da BRS.

---

## 2. Requisitos e Critérios de Aceitação

### AC-026-01: Pares Genuinamente Distintos para Comparação Técnica

1. **Funilaria de Precisão**:
   - **Antes**: Veículo com deformação evidente na lataria, vinco amassado e desalinhamento estrutural em painel automotivo.
   - **Depois**: Painel com geometria recuperada, vincos alinhados e acabamento de montagem milimétrico.
2. **Pintura em Estufa**:
   - **Antes**: Superfície preparada, lixada, com fundo primer ou desgaste de verniz pronto para aplicação.
   - **Depois**: Aplicação de verniz espelhado de alto sólidos sob iluminação técnica de estufa, com reflexo puro e uniforme.
3. **Martelinho de Ouro (PDR)**:
   - **Antes**: Mossa/amassado característico de porta ou impacto leve com distorção de linhas de reflexo.
   - **Depois**: Superfície nivelada, sem amassados, preservando integralmente o verniz e a pintura original de fábrica.
4. **Remoção de Filtros Artificiais**:
   - Eliminar as classes de filtro CSS que simulavam avarias sobre a mesma foto. As duas camadas do comparador devem exibir arquivos de mídia independentes e autênticos.

### AC-026-02: Diversificação do Acervo e Eliminação de Repetições no Site

1. **Galeria de Trabalhos (`/trabalhos` - `ProjectGallery`)**:
   - Carregar os 3 pares distintos com metadados técnicos precisos para Funilaria, Pintura e Martelinho.
2. **Demonstração na Home (`HomeBeforeAfter`)**:
   - Exibir o par de destaque com contraste evidente de recuperação antes e depois.
3. **Páginas e Módulos Institucionais**:
   - Rotas dedicadas (`/servicos/funilaria`, `/servicos/pintura-automotiva`, `/servicos/martelinho-de-ouro`, `/para-corretores`) e seções de serviços devem ter fotografia contextual única, evitando duplicações desnecessárias.

### AC-026-03: Padrão Visual Premium e Conformidade Editorial

1. **Identidade Visual**:
   - Manter a paleta escura (preto profundo `#0a0a0a`, grafite `#141414`), acentos em ouro champanhe (`#C8A96A`) e iluminação técnica automotiva.
2. **Transparência e Honradez Comercial**:
   - Manter a identificação transparente de mídia ilustrativa de acervo técnico, sem atribuir falsas instalações ou trabalhos simulados.

### AC-026-04: Quality Gates e Acessibilidade

1. **Acessibilidade e Semântica**:
   - Manter atributos `alt` descritivos e diferenciados para as imagens de Antes e Depois em todos os pontos de uso.
2. **Testes e Build**:
   - 100% de aprovação na suíte Vitest (`bun run test`).
   - 100% de aprovação na suíte Playwright (`bunx playwright test`).
   - Linter (`bun run lint`) e Build SSR (`bun run build`) sem erros.
