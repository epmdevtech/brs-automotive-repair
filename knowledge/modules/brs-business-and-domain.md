# Módulo de Conhecimento: Regras de Negócio e Domínio BRS

## Metadados
- **Módulo**: `knowledge/modules/brs-business-and-domain.md`
- **Domínio**: Oficina de Reparações Automotivas
- **Responsável**: Engenharia & Produto EPMDEVTECH
- **Revisado em**: 2026-10-11
- **Aplicabilidade**: Qualquer alteração de texto, formulário, serviços ou canais de contato

---

## 1. Identidade e Localização da Empresa
- **Razão / Nome Fantasia**: BRS Reparações Automotivas
- **Cidade e Estado**: Toledo, Paraná (Brasil)
- **Telefone Público**: (45) 2035-9440 (`tel:+554520359440`)
- **Canal Oficial Confirmado**: Instagram [`@brsreparacoes`](https://www.instagram.com/brsreparacoes/)
- **Status do WhatsApp**: Não confirmado formalmente pelo proprietário (`whatsappConfirmed: false` em `src/lib/brs.ts`). Não deve haver botões ou promessas de atendimento por WhatsApp até liberação explícita.

---

## 2. Catálogo Oficial de Serviços Confirmados
A oficina oferece estritamente 3 especialidades confirmadas:
1. **Funilaria automotiva**: Reparação de danos na lataria, atenção aos encaixes de painéis e integridade estrutural.
2. **Pintura automotiva**: Preparação, colorimetria e pintura com controle de uniformidade e qualidade de verniz.
3. **Martelinho de ouro**: Desamassamento fino que preserva a pintura original quando a integridade do verniz permite.

Serviços complementares divulgados:
- **Leva e Traz**: Comodidade opcional de busca e entrega de veículos na região de Toledo-PR.

---

## 3. Públicos de Atendimento e Fluxo de Mensagens
O site atende a dois segmentos:
- **Particular**: Proprietários que buscam orçamento para reparos em seus próprios veículos.
- **Corretor**: Corretores de seguro interessados em parcerias comerciais para direcionamento de segurados e agilidade em sinistros.

O gerador de mensagens em `src/lib/brs.ts` adapta a introdução conforme o público selecionado:
- Para corretores: *"Olá! Gostaria de conversar sobre uma possível parceria para atendimento de segurados."*
- Para particulares: *"Olá! Conheci a BRS pelo site e gostaria de solicitar uma avaliação para meu veículo."*

---

## 4. Política de Mídia e Imagens Ilustrativas
- As fotos atuais de serviços e oficina são categorizadas como **ilustrativas**.
- É terminantemente proibido descrever as fotos ilustrativas como se fossem a sede física real da BRS ou fotos reais de clientes até que o acervo oficial seja entregue pelo proprietário.
- Comparativos do tipo "Antes e Depois" só poderão ser ativados mediante fornecimento de fotos reais autorizadas.
