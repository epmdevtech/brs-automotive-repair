export const company = {
  name: "BRS Reparações Automotivas",
  phone: "(45) 2035-9440",
  phoneHref: "tel:+554520359440",
  instagram: "https://www.instagram.com/brsreparacoes/",
  city: "Toledo, Paraná",
  whatsappConfirmed: false,
};
export const navigation = [
  ["Início", "#inicio"],
  ["Serviços", "#servicos"],
  ["Nosso trabalho", "#trabalho"],
  ["Para corretores", "#corretores"],
  ["A BRS", "#sobre"],
  ["Contato", "#contato"],
] as const;
export const services = [
  {
    title: "Funilaria automotiva",
    short: "Funilaria",
    description:
      "Reparação de danos na lataria, com atenção às linhas, aos encaixes e à recuperação visual do veículo.",
  },
  {
    title: "Pintura automotiva",
    short: "Pintura",
    description:
      "Preparação e pintura voltadas à uniformidade de cor, à qualidade do acabamento e à integração visual da peça reparada.",
  },
  {
    title: "Martelinho de ouro",
    short: "Martelinho de ouro",
    description:
      "Reparação de amassados que pode preservar a pintura original, quando as características do dano permitem.",
  },
];
export type ContactValues = {
  name: string;
  phone: string;
  vehicle: string;
  service: string;
  description: string;
  audience: string;
};
export function validateContact(values: ContactValues) {
  const errors: Partial<Record<keyof ContactValues, string>> = {};
  if (!values.name.trim()) errors.name = "Informe seu nome.";
  const digits = values.phone.replace(/\D/g, "").length;
  if (digits < 10 || digits > 13) errors.phone = "Informe um telefone válido com DDD.";
  if (!values.description.trim()) errors.description = "Conte brevemente o que você precisa.";
  return errors;
}
export function contactMessage(values: ContactValues) {
  const intro =
    values.audience === "corretor"
      ? "Olá! Gostaria de conversar sobre uma possível parceria para atendimento de segurados."
      : "Olá! Conheci a BRS pelo site e gostaria de solicitar uma avaliação para meu veículo.";
  return [
    intro,
    `Nome: ${values.name.trim()}`,
    `Telefone: ${values.phone.trim()}`,
    values.vehicle && `Veículo: ${values.vehicle.trim()}`,
    values.service && `Serviço: ${values.service}`,
    `Atendimento: ${values.audience}`,
    `Descrição: ${values.description.trim()}`,
  ]
    .filter(Boolean)
    .join("\n");
}
