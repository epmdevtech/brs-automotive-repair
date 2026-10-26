// Re-exportação de submódulos para retrocompatibilidade
export { Brand } from "./brand";
export { Header } from "./header";
export { Hero } from "./hero";
export { HomeBeforeAfter } from "./home-before-after";
export { MediaExpand } from "./media-expand";
export { Services } from "./services";
export { Philosophy } from "./philosophy";
export { ProjectGallery } from "./project-gallery";
export { ProcessTimeline } from "./process-timeline";
export { HomePathways } from "./home-pathways";
export { FAQAccordion } from "./faq-accordion";
export { ContactForm } from "./contact-form";
export { Contact } from "./contact";
export { FinalCTA } from "./final-cta";
export { Footer } from "./footer";
export { SiteLayout } from "./site-layout";

import { Hero } from "./hero";
import { Services } from "./services";
import { ProcessTimeline } from "./process-timeline";
import { HomePathways } from "./home-pathways";
import { FinalCTA } from "./final-cta";

/**
 * Página inicial estruturada em 6 blocos com função única (SPEC-064):
 * 1. Hero (Proposta de valor + CTA Solicitar avaliação)
 * 2. Serviços (3 especialidades com link único + linha compacta de estética)
 * 3. Confiança e Processo consolidados (3 diferenciais verificáveis + 4 etapas em linha)
 * 4. [Trabalhos mantido em /trabalhos, com registros oficiais e métodos ilustrativos]
 * 5. Corretores (Faixa horizontal discreta com link para /para-corretores)
 * 6. CTA Final (Solicitar avaliação + canais confirmados) e Rodapé (em SiteLayout)
 */
export function HomePageContent() {
  return (
    <>
      <Hero />
      <Services />
      <ProcessTimeline />
      <HomePathways />
      <FinalCTA />
    </>
  );
}
