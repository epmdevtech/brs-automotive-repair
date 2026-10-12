import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Reveal } from "./reveal";

export function FAQAccordion() {
  const questions = [
    [
      "Quais serviços a BRS realiza?",
      "A BRS atua com funilaria automotiva, pintura automotiva em estufa e martelinho de ouro. A indicação do procedimento adequado depende da avaliação presencial da chapa e do verniz.",
    ],
    [
      "Como solicitar uma avaliação do veículo?",
      "Você pode ligar diretamente para (45) 2035-9440 ou iniciar o contato pelo Instagram oficial @brsreparacoes. Utilize o formulário abaixo para estruturar sua mensagem e enviá-la com praticidade.",
    ],
    [
      "É possível enviar fotos antes da avaliação presencial?",
      "Sim. Pelo Instagram oficial você pode enviar fotos das avarias para uma triagem inicial, embora danos estruturais ou detalhes de pintura possam demandar uma inspeção presencial.",
    ],
    [
      "A BRS atende corretores de seguros?",
      "Sim. A BRS está aberta a parcerias com corretores de Toledo e região para atendimento de sinistros e reparos de segurados com total transparência e pontualidade.",
    ],
    [
      "Como funciona o serviço de leva e traz?",
      "Disponibilizamos a opção de busca e entrega de veículos em Toledo. Entre em contato por telefone para verificar a disponibilidade e as condições de atendimento.",
    ],
    [
      "Qual é a previsão de prazo para os reparos?",
      "O prazo varia conforme a gravidade da colisão, necessidade de peças e tempo de cura da pintura. O tempo estimado é sempre alinhado de forma transparente no momento do orçamento.",
    ],
    [
      "Qual é o canal oficial de contato?",
      "O telefone fixo oficial é (45) 2035-9440 e o perfil oficial no Instagram é @brsreparacoes. Não realizamos atendimento por WhatsApp até homologação formal desse canal.",
    ],
  ];

  return (
    <section className="section-space border-y border-border bg-secondary/40">
      <div className="page-width grid md:grid-cols-[.8fr_1.2fr] gap-10 md:gap-20">
        <Reveal staggerIndex={0}>
          <p className="eyebrow mb-5">Dúvidas frequentes</p>
          <h2 className="section-title">
            Informação clara e direta.
            <br />
            <span className="text-muted-foreground">Sem surpresas.</span>
          </h2>
          <p className="body-copy mt-5">
            Cada veículo apresenta particularidades técnicas. Caso sua dúvida não esteja respondida
            aqui, converse diretamente com nossa equipe.
          </p>
        </Reveal>
        <Reveal staggerIndex={1} delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {questions.map(([question, answer], i) => (
              <AccordionItem value={`faq-${i}`} key={question} className="border-border">
                <AccordionTrigger className="py-5 text-sm font-medium text-left gap-4 hover:no-underline hover:text-primary transition-colors">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="body-copy text-xs pr-6 pb-5 leading-relaxed text-pretty">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
