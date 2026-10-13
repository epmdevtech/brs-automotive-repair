import painting from "@/assets/pintura-depois.jpg";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

/**
 * Transição entre o hero e os serviços: a fotografia expande de forma limitada
 * conforme a rolagem nativa (variável `--p`, de 0 a 1). Sem JavaScript, com
 * movimento reduzido ou economia de dados, a imagem já aparece expandida.
 */
export function MediaExpand() {
  const ref = useScrollProgress<HTMLElement>();

  return (
    <section ref={ref} className="media-expand" aria-label="Acabamento em pintura automotiva">
      <div className="page-width">
        <figure className="media-expand-frame">
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
            <span className="eyebrow">Pintura automotiva</span>
            <span className="media-expand-title">Acabamento uniforme, do preparo ao verniz.</span>
          </figcaption>
          <span className="media-expand-note image-note">Fotografia ilustrativa</span>
        </figure>
      </div>
    </section>
  );
}
