import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { primaryNavigation } from "@/lib/brs";
import { getHasPlayedHeroIntro } from "@/lib/hero-cinematic-state";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";

/** Início só é ativo na raiz; as demais seções também são ativas nas subrotas (ex.: /servicos/funilaria). */
function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export interface HeaderProps {
  isHome?: boolean;
}

export function Header({ isHome: isHomeProp }: HeaderProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [introSkipped, setIntroSkipped] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const isHome = isHomeProp !== undefined ? isHomeProp : pathname === "/" || pathname === "";
  const shouldAnimateHeader = isHome && !getHasPlayedHeroIntro() && !introSkipped;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleSkip = () => setIntroSkipped(true);
    window.addEventListener("brs:hero-intro-skip", handleSkip);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("brs:hero-intro-skip", handleSkip);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] w-full max-w-full",
        shouldAnimateHeader && "header-cinematic-intro",
      )}
    >
      {/* Cápsula flutuante centralizada */}
      <div
        className={cn(
          "pointer-events-auto mx-auto max-w-6xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-xl border shadow-2xl backdrop-blur-md flex items-center justify-between w-full",
          scrolled
            ? "bg-neutral-950/90 border-white/15 py-2 px-3 sm:px-6 shadow-black/60"
            : "bg-neutral-950/75 border-white/10 py-2 sm:py-3 px-3 sm:px-8 shadow-black/40",
        )}
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <Brand />

        {/* Links centrais da navegação */}
        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex items-center gap-7 xl:gap-8"
        >
          {primaryNavigation.map(([label, href]) => {
            const active = isActivePath(pathname, href);
            return (
              <Link
                key={href}
                to={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-[13px] transition-colors font-medium tracking-wide border-b border-transparent pb-0.5",
                  active ? "text-white border-primary/70" : "text-neutral-300 hover:text-white",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Ações da direita: Botão CTA dourado normativo (.btn--sm) visível em tablets/desktops e alternador móvel */}
        <div className="flex gap-2 sm:gap-3 items-center">
          <MagneticButton className="hidden sm:inline-flex">
            <Button variant="primary" size="sm" asChild className="text-[11px]">
              <Link to="/contato">
                <span className="hidden xs:inline">Solicitar avaliação</span>
                <span className="xs:hidden">Avaliação</span>
                <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
              </Link>
            </Button>
          </MagneticButton>

          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center text-white hover:bg-white/10 rounded-sm size-11 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 cursor-pointer border-0 bg-transparent p-0"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
          </button>
        </div>
      </div>

      {/* Painel do menu móvel (quando aberto) */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Navegação móvel"
          className="pointer-events-auto mx-auto max-w-6xl mt-2 rounded-xl bg-neutral-950/95 backdrop-blur-lg border border-white/10 px-6 py-5 grid gap-4 lg:hidden animate-in fade-in slide-in-from-top-2 shadow-2xl shadow-black/70"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          {primaryNavigation.map(([label, href]) => {
            const active = isActivePath(pathname, href);
            return (
              <Link
                key={href}
                to={href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors py-1",
                  active ? "text-primary" : "text-neutral-200 hover:text-primary",
                )}
              >
                {label}
              </Link>
            );
          })}
          <Button
            variant="primary"
            asChild
            className="w-full text-xs font-semibold tracking-wider uppercase mt-2 h-11"
          >
            <Link to="/contato" onClick={() => setOpen(false)}>
              Avaliação <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
            </Link>
          </Button>
        </nav>
      )}
    </header>
  );
}
