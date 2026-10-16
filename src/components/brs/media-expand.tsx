import painting from "@/assets/pintura-depois.jpg";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

/**
 * Transição cinematográfica entre o hero e os serviços (SPEC-005, SPEC-032):
 * A fotografia expande com suavidade inercial do Lenis conforme a rolagem nativa (variável `--p`, de 0 a 1).
 * Sem JavaScript, com movimento reduzido ou economia de dados, a imagem já aparece expandida.
 */
export function MediaExpand() {
  const ref = useScrollProgress<HTMLElement>();

  return (
    <section
      ref={ref}
      className="media-expand relative"
      aria-label="Acabamento em pintura automotiva"
    >
      {/* Halo de luz ambiente sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-primary/5 blur-[140px]"
      />

      <div className="page-width relative z-10">
        <figure className="media-expand-frame border border-white/10 shadow-2xl shadow-black/80">
          <img
            src={painting}
            alt="Veículo com verniz espelhado de alto sólidos sob iluminação técnica de estufa (fotografia ilustrativa)"
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            className="media-expand-image"
          />
          <figcaption className="media-expand-caption">
            <span className="eyebrow">Pintura automotiva em estufa</span>
            <span className="media-expand-title">Acabamento uniforme, do preparo ao verniz.</span>
          </figcaption>
          <span className="media-expand-note image-note">Fotografia ilustrativa</span>
        </figure>
      </div>
    </section>
  );
}
