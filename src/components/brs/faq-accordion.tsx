import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function FAQAccordion() {
  const questions = [
    [
      "Quais serviços a Master realiza?",
      "A Master atua com funilaria automotiva, pintura automotiva em estufa e martelinho de ouro. A indicação do procedimento adequado depende da avaliação presencial da chapa e do verniz.",
    ],
    [
      "Como solicitar uma avaliação do veículo?",
      "Você pode ligar diretamente para (45) 99954-5442 ou iniciar o contato pelo Instagram oficial @masterchapeacao2022 ou pela página da Master no Facebook. Utilize o formulário abaixo para estruturar sua mensagem e enviá-la com praticidade.",
    ],
    [
      "É possível enviar fotos antes da avaliação presencial?",
      "Sim. Pelo Instagram oficial você pode enviar fotos das avarias para uma triagem inicial, embora danos estruturais ou detalhes de pintura possam demandar uma inspeção presencial.",
    ],
    [
      "A Master atende corretores de seguros?",
      "Sim. A Master está aberta a parcerias com corretores de Toledo e região para atendimento de sinistros e reparos de segurados com total transparência e pontualidade.",
    ],
    [
      "A Master oferece serviço de guincho?",
      "Sim. A Master oferece atendimento com guincho para veículos que não podem rodar. Entre em contato por telefone para verificar a disponibilidade e as condições de atendimento.",
    ],
    [
      "Qual é a previsão de prazo para os reparos?",
      "O prazo varia conforme a gravidade da colisão, necessidade de peças e tempo de cura da pintura. O tempo estimado é sempre alinhado de forma transparente no momento do orçamento.",
    ],
    [
      "Qual é o canal oficial de contato?",
      "O telefone oficial é (45) 99954-5442, o Instagram oficial é @masterchapeacao2022 e a página no Facebook é Master Chapeação e Pinturas. Não realizamos atendimento por WhatsApp até homologação formal desse canal.",
    ],
  ];

  return (
    <section className="section-space border-y border-border bg-secondary/40">
      <div className="page-width grid md:grid-cols-[.8fr_1.2fr] gap-10 md:gap-20">
        <ScrollReveal
          data-reveal=""
          style={{ "--i": 0 } as React.CSSProperties}
          direction="up"
          delay={0.05}
        >
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
        </ScrollReveal>

        <ScrollReveal
          data-reveal=""
          style={{ "--i": 1 } as React.CSSProperties}
          direction="up"
          delay={0.15}
        >
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
        </ScrollReveal>
      </div>
    </section>
  );
}
