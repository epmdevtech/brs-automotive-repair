# Inventário de imagens — Master Chapeação e Pinturas

Atualizado em 2026-10-26. Vinculado a `SPEC-077` / `TASK-077-01` e
`SPEC-078` / `TASK-078-01`.

## Resumo

| Grupo                                             | Quantidade | Situação                                      |
| ------------------------------------------------- | ---------: | --------------------------------------------- |
| Imagens oficiais da oficina recebidas              |          6 | 6 publicadas em `src/assets/cliente/`         |
| Fotografias antigas do cliente                     |          7 | 6 substituídas, 1 descartada (terreno vazio)  |
| Derivados antigos não tratados                     |          8 | Removidos de `src/assets/master/`             |
| Imagens ilustrativas do projeto                    |         14 | Mantidas, com rótulo quando publicadas        |
| Total inventariado                                 |         35 | -                                             |
| Recortes de hero                                   |          2 | Desktop 1280×720 e mobile 900×964             |
| Variantes públicas do hero                         |         10 | AVIF e WebP em 3 larguras desktop + 2 mobile  |
| Open Graph                                         |          1 | `public/master/og-master.jpg`                 |

Os originais ficam em `assets-originais/`, ignorado pelo Git. Nenhum nome
original de arquivo do cliente, texto, `alt`, metadado ou documento contém
placas veiculares.

## 1. Imagens oficiais da oficina

As seis imagens oficiais fornecidas pelo cliente já trazem as placas
substituídas pela marca **MASTER**. Elas substituem as fotos antigas com
desfoque amplo e são a base dos registros da oficina, do hero e do Open Graph.
A imagem sob céu nublado ainda tinha placas reais em veículos ao fundo, tratadas
na publicação.

| Original neutro                             | Arquivo publicado                             | Uso principal                                   | Tratamento                       |
| ------------------------------------------- | --------------------------------------------- | ----------------------------------------------- | -------------------------------- |
| `original-oficial-fachada-branco.png`      | `src/assets/cliente/oficina-fachada-01.jpg`   | `/`, `/trabalhos`, `/sobre`, `/servicos`, OG    | Placas da marca; sem placa real  |
| `original-oficial-fachada-vw.png`          | `src/assets/cliente/oficina-fachada-02.jpg`   | `/para-corretores`, `/trabalhos`                | Placas da marca; sem placa real  |
| `original-oficial-fachada-ceu-nublado.png` | `src/assets/cliente/oficina-fachada-03.jpg`   | `/sobre`, `/trabalhos`                          | 2 placas reais ao fundo tratadas |
| `original-oficial-fachada-02.jpg`          | `src/assets/cliente/oficina-fachada-04.jpg`   | `/trabalhos`                                    | Placas da marca; sem placa real  |
| `original-oficial-estufa-01.jpg`           | `src/assets/cliente/estufa-acabamento-01.jpg` | Hero, `/trabalhos`                              | Placas da marca; sem placa real  |
| `original-oficial-estufa-02.jpg`           | `src/assets/cliente/estufa-acabamento-02.jpg` | `/servicos`, pintura, `/trabalhos`              | Placas da marca; sem placa real  |

### Tratamento aplicado

- Coordenadas das placas reais registradas em `docs/image-treatment-report.json`.
- Pixelização em blocos, desfoque gaussiano e véu escuro localizados.
- Recortes `estufa-acabamento-01-desktop.jpg` e `estufa-acabamento-01-mobile.jpg`
  derivam da imagem oficial da estufa.
- Open Graph deriva da fachada com guincho branco.
- Inspeção visual em resolução cheia: nenhuma placa real legível nas imagens
  publicadas.

## 2. Fotografias antigas do cliente

As sete fotos recebidas antes das imagens oficiais foram inventariadas, mas
não são mais publicadas. As seis com aderência foram substituídas pelas imagens
oficiais; o terreno vazio permanece descartado.

| ID neutro             | Situação atual                                      |
| --------------------- | --------------------------------------------------- |
| `original-fachada-01` | Substituída por `oficina-fachada-01.jpg`            |
| `original-fachada-02` | Substituída por `oficina-fachada-02.jpg`            |
| `original-fachada-03` | Substituída por `oficina-fachada-03.jpg`            |
| `original-fachada-04` | Substituída por `oficina-fachada-01.jpg`            |
| `original-estufa-01`  | Substituída por `estufa-acabamento-01.jpg`          |
| `original-estufa-02`  | Substituída por `estufa-acabamento-02.jpg`          |
| `original-terreno-01` | Descartada: terreno vazio, sem aderência ao conteúdo |

## 3. Derivados antigos removidos

Os oito arquivos abaixo eram derivados não tratados das fotos antigas e foram
removidos de `src/assets/master/` porque não tinham mais importações:

`contato.jpg`, `estrutura.jpg`, `guincho.jpg`, `hero-fallback.jpg`,
`hero-mobile.jpg`, `pintura-servico.jpg`, `pintura.jpg`, `sobre.jpg`.

As versões oficiais estão em `src/assets/cliente/` e os recortes do hero em
`public/hero/`. O Open Graph foi regravado em `public/master/og-master.jpg`.

## 4. Imagens ilustrativas mantidas

| Arquivo                                                     | Uso                                                   | Rótulo                 |
| ----------------------------------------------------------- | ----------------------------------------------------- | ---------------------- |
| `src/assets/funilaria.jpg`                                  | Card de funilaria na home                             | Fotografia ilustrativa |
| `src/assets/pintura-servico.jpg`                            | Card de pintura na home                               | Fotografia ilustrativa |
| `src/assets/martelinho.jpg`                                 | Card de martelinho na home                            | Fotografia ilustrativa |
| `src/assets/funilaria-servico.jpg`                          | Lista de serviços e metadados                         | Fotografia ilustrativa |
| `src/assets/martelinho-servico.jpg`                         | Lista de serviços e metadados                         | Fotografia ilustrativa |
| `src/assets/funilaria-antes.jpg` / `funilaria-depois.jpg`   | Comparador de método                                  | Fotografia ilustrativa |
| `src/assets/pintura-antes.jpg` / `pintura-depois.jpg`       | Comparador de método                                  | Fotografia ilustrativa |
| `src/assets/martelinho-antes.jpg` / `martelinho-depois.jpg` | Comparador de método                                  | Fotografia ilustrativa |
| `src/assets/brs-hero.jpg`                                   | Reserva legada do hero; sem uso na home               | Não publicado          |
| `src/assets/pintura.jpg`                                    | Reserva ilustrativa; sem uso atual                    | Não publicado          |
| `src/assets/corretores-vistoria.jpg`                        | Ilustração de vistoria com placa fictícia, já tratada | Não publicado          |

Nenhum comparador ilustrativo é apresentado como caso real de cliente. A
página `/trabalhos` separa os registros oficiais da oficina das sequências de
método.

## 5. Uso por página

| Página                         | Registros oficiais                    | Imagens ilustrativas                     |
| ------------------------------ | ------------------------------------- | ---------------------------------------- |
| `/`                            | Hero com estufa oficial               | Cards de serviços e comparador de método |
| `/servicos`                    | Estufa (pintura) e fachada com guincho| Funilaria e martelinho                   |
| `/servicos/pintura-automotiva` | Estufa                                | -                                        |
| `/servicos/funilaria`          | -                                     | Funilaria                                |
| `/servicos/martelinho-de-ouro` | -                                     | Martelinho                               |
| `/trabalhos`                   | Galeria com 6 imagens oficiais        | Comparadores de método                   |
| `/sobre`                       | Fachada, guincho e céu nublado        | -                                        |
| `/contato`                     | Fachada e recepção                    | -                                        |
| `/para-corretores`             | Fachada com guincho Volkswagen        | -                                        |

## 6. Privacidade e transparência

- Nenhuma placa real é legível nas imagens publicadas.
- Nomes de arquivo, textos, `alt`, relatórios e documentação usam IDs neutros.
- A galeria informa que as placas de terceiros foram substituídas pela marca.
- Os originais não tratados permanecem fora do bundle e do controle de versão.
