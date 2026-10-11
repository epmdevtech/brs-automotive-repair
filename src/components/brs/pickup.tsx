import { Phone, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/brs";
import { reveal } from "@/lib/motion";

export function Pickup() {
  return (
    <section className="border-y border-border bg-secondary">
      <div
        className="page-width py-10 flex flex-col md:flex-row md:items-center gap-7 justify-between"
        {...reveal(0)}
      >
        <div className="flex gap-6 items-start md:items-center">
          <Truck size={36} strokeWidth={1.3} className="text-primary shrink-0" aria-hidden="true" />
          <div>
            <p className="eyebrow mb-2">Comodidade</p>
            <h2 className="text-xl sm:text-2xl font-semibold font-display tracking-tight text-foreground text-balance">
              Serviço de leva e traz para seu veículo.
            </h2>
            <p className="body-copy text-xs mt-1.5 text-pretty">
              Consulte a disponibilidade de busca e entrega para a sua região em Toledo e arredores.
            </p>
          </div>
        </div>
        <Button variant="automotiveOutline" asChild className="h-12 px-6 text-xs shrink-0">
          <a href={company.phoneHref}>
            Consultar disponibilidade <Phone className="ml-1" size={14} aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  );
}
