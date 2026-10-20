import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  path?: "/servicos" | "/trabalhos" | "/para-corretores" | "/sobre" | "/contato";
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-neutral-400 ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <li className="flex items-center gap-1.5">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
          >
            <Home size={13} className="text-brand-accent" aria-hidden="true" />
            <span>Início</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.name} className="flex items-center gap-1.5 sm:gap-2">
              <ChevronRight size={12} className="text-neutral-600 shrink-0" aria-hidden="true" />
              {isLast || !item.path ? (
                <span
                  className="text-foreground font-medium truncate max-w-[200px] sm:max-w-none"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
