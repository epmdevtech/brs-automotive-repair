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
import { HomeBeforeAfter } from "./home-before-after";
import { MediaExpand } from "./media-expand";
import { Services } from "./services";
import { Philosophy } from "./philosophy";
import { ProcessTimeline } from "./process-timeline";
import { HomePathways } from "./home-pathways";
import { FinalCTA } from "./final-cta";

/**
 * Página inicial: apresenta, contextualiza e encaminha. Cada tema aprofundado possui rota
 * própria (`/servicos`, `/trabalhos`, `/sobre`, `/para-corretores`, `/contato`); aqui há apenas
 * resumos com uma porta de entrada para cada uma.
 * Sincronização automática e instantânea habilitada via Docker HMR.
 */
export function HomePageContent() {
  return (
    <>
      <Hero />
      <Services />
      <HomeBeforeAfter />
      <MediaExpand />
      <Philosophy />
      <ProcessTimeline />
      <HomePathways />
      <FinalCTA />
    </>
  );
}
