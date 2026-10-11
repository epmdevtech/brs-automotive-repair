import { useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/brs";

// Re-exportação de submódulos para retrocompatibilidade
export { Brand } from "./brand";
export { Header } from "./header";
export { Hero } from "./hero";
export { MediaExpand } from "./media-expand";
export { Services } from "./services";
export { Philosophy } from "./philosophy";
export { ProjectGallery } from "./project-gallery";
export { ProcessTimeline } from "./process-timeline";
export { PartnerSection } from "./partner-section";
export { Pickup } from "./pickup";
export { About } from "./about";
export { FAQAccordion } from "./faq-accordion";
export { ContactForm } from "./contact-form";
export { Contact } from "./contact";
export { FinalCTA } from "./final-cta";
export { Footer } from "./footer";

import { Header } from "./header";
import { Hero } from "./hero";
import { MediaExpand } from "./media-expand";
import { Services } from "./services";
import { Philosophy } from "./philosophy";
import { ProjectGallery } from "./project-gallery";
import { ProcessTimeline } from "./process-timeline";
import { PartnerSection } from "./partner-section";
import { Pickup } from "./pickup";
import { About } from "./about";
import { FAQAccordion } from "./faq-accordion";
import { Contact } from "./contact";
import { FinalCTA } from "./final-cta";
import { Footer } from "./footer";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function Website() {
  const [partner, setPartner] = useState(false);
  useScrollReveal();

  const handlePartnerContact = () => {
    setPartner(true);
    document.getElementById("contato")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <>
      <a
        href="#servicos"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-primary text-primary-foreground p-3 font-medium text-xs rounded-sm"
      >
        Pular para o conteúdo principal
      </a>

      <Header />

      <main id="conteudo-principal">
        <Hero />
        <MediaExpand />
        <Services />
        <Philosophy />
        <ProjectGallery />
        <ProcessTimeline />
        <PartnerSection onPartner={handlePartnerContact} />
        <Pickup />
        <About />
        <FAQAccordion />
        <Contact partner={partner} />
        <FinalCTA />
      </main>

      <Footer />

      <Button
        variant="automotive"
        size="icon"
        asChild
        className="fixed bottom-5 right-5 z-20 size-12 rounded-full shadow-xl md:hidden"
      >
        <a href={company.phoneHref} aria-label="Ligar para a central de atendimento da BRS">
          <Phone size={20} aria-hidden="true" />
        </a>
      </Button>
    </>
  );
}
