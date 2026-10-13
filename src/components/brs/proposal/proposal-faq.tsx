import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { CommercialProposal } from "@/lib/proposta";

interface ProposalFaqProps {
  proposal: CommercialProposal;
}

export function ProposalFaq({ proposal }: ProposalFaqProps) {
  const { faq } = proposal;

  return (
    <section id="faq" className="section-space border-b border-border/80 bg-neutral-950/40">
      <div className="page-width grid md:grid-cols-[.8fr_1.2fr] gap-10 md:gap-16">
        <div>
          <p className="eyebrow mb-3">Esclarecimentos</p>
          <h2 className="section-title text-2xl sm:text-3xl text-white">
            Perguntas Frequentes Sobre a Proposta
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
            Respostas diretas sobre escopo, pagamentos e o processo de transição para o briefing.
            Caso tenha dúvidas adicionais, nossa equipe está à disposição.
          </p>
        </div>

        <div>
          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, idx) => (
              <AccordionItem value={`prop-faq-${idx}`} key={idx} className="border-white/10">
                <AccordionTrigger className="py-4 text-sm sm:text-base font-medium text-left gap-4 hover:no-underline hover:text-primary transition-colors text-white">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-neutral-400 leading-relaxed pr-6 pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
