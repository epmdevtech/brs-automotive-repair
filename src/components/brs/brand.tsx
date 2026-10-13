import { Link } from "@tanstack/react-router";

export function Brand() {
  return (
    <Link to="/" aria-label="BRS Reparações Automotivas: início" className="brand">
      <strong>
        BRS<span className="sr-only"> Reparações Automotivas</span>
      </strong>
      <span aria-hidden="true">REPARAÇÕES AUTOMOTIVAS</span>
    </Link>
  );
}
