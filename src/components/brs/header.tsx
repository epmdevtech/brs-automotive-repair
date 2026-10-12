import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/brs";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
      {/* Cápsula flutuante centralizada */}
      <div
        className={cn(
          "pointer-events-auto mx-auto max-w-6xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-full border shadow-2xl backdrop-blur-md flex items-center justify-between",
          scrolled
            ? "bg-neutral-950/90 border-white/15 py-2 px-5 sm:px-6 shadow-black/60"
            : "bg-neutral-950/75 border-white/10 py-2.5 sm:py-3 px-5 sm:px-8 shadow-black/40",
        )}
      >
        <Brand />

        {/* Links centrais da navegação */}
        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex items-center gap-7 xl:gap-8"
        >
          {navigation.map(([label, href]) => (
            <a
              className="text-[13px] text-neutral-300 hover:text-white transition-colors font-medium tracking-wide"
              key={href}
              href={href}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Ações da direita: Botão CTA dourado refinado e alternador móvel */}
        <div className="flex gap-3 items-center">
          <Button
            variant="automotive"
            asChild
            className="hidden sm:inline-flex h-9 text-xs px-5 rounded-full font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_18px_rgba(212,175,55,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:scale-[0.98] transition-all duration-300 shadow-md shadow-primary/10"
          >
            <a href="/contato">
              Solicitar avaliação <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10 rounded-full size-9"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
          </Button>
        </div>
      </div>

      {/* Painel do menu móvel (quando aberto) */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Navegação móvel"
          className="pointer-events-auto mx-auto max-w-6xl mt-2 rounded-2xl bg-neutral-950/95 backdrop-blur-lg border border-white/10 px-6 py-5 grid gap-4 lg:hidden animate-in fade-in slide-in-from-top-2 shadow-2xl shadow-black/70"
        >
          {navigation.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-neutral-200 hover:text-primary transition-colors py-1"
            >
              {label}
            </a>
          ))}
          <Button
            variant="automotive"
            asChild
            className="bg-primary text-primary-foreground font-semibold text-xs tracking-wide rounded-full hover:bg-primary/90 hover:shadow-[0_0_18px_rgba(212,175,55,0.22)] mt-2"
          >
            <a href="/contato" onClick={() => setOpen(false)}>
              Solicitar avaliação <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
            </a>
          </Button>
        </nav>
      )}
    </header>
  );
}
