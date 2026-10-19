import { Link } from "@tanstack/react-router";

export function Brand() {
  return (
    <Link to="/" aria-label="Master Chapeação e Pinturas: início" className="brand">
      <img
        src="/master/logo.webp"
        alt="Master Chapeação e Pinturas"
        width={512}
        height={172}
        className="brand-logo"
        decoding="async"
      />
    </Link>
  );
}
