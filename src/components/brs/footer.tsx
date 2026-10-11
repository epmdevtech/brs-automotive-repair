import { Instagram } from "lucide-react";
import { company, navigation, services } from "@/lib/brs";
import { Brand } from "./brand";

const external = { target: "_blank", rel: "noopener noreferrer" };

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="page-width py-14 grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10">
        <div className="col-span-2 md:col-span-1">
          <Brand />
          <p className="body-copy text-[11px] max-w-[250px] mt-5">
            Oficina especializada em funilaria, pintura automotiva e martelinho de ouro em Toledo,
            Paraná.
          </p>
        </div>
        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
            Navegação
          </h3>
          <div className="grid gap-2.5">
            {navigation.slice(0, 5).map(([label, href]) => (
              <a className="footer-link m-0" key={href} href={href}>
                {label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
            Especialidades
          </h3>
          <div className="grid gap-2.5">
            {services.map((s) => (
              <a className="footer-link m-0" href="#servicos" key={s.short}>
                {s.short}
              </a>
            ))}
            <a href="#sobre" className="footer-link m-0">
              Leva e traz
            </a>
          </div>
        </div>
        <div>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
            Contatos
          </h3>
          <div className="grid gap-2.5 text-xs text-muted-foreground">
            <a
              className="footer-link m-0 text-foreground hover:text-primary transition-colors"
              href={company.phoneHref}
            >
              {company.phone}
            </a>
            <span className="footer-link m-0">{company.city}</span>
            <a
              className="footer-link m-0 flex items-center gap-2 hover:text-primary transition-colors"
              href={company.instagram}
              {...external}
            >
              <Instagram size={13} aria-hidden="true" /> @brsreparacoes
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="page-width py-5 flex flex-col sm:flex-row justify-between gap-4 text-[9px] text-muted-foreground">
          <span>© 2026 BRS Reparações Automotivas. Todos os direitos reservados.</span>
          <span>
            Demonstração institucional oficial · Fotografias ilustrativas temporárias até conclusão
            do acervo fotográfico da oficina.
          </span>
        </div>
      </div>
    </footer>
  );
}
