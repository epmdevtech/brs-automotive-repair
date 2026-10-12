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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md border-b",
        scrolled ? "bg-black/90 border-white/10 shadow-xl py-3" : "bg-black/40 border-white/5 py-4",
      )}
    >
      <div className="page-width flex items-center justify-between">
        <Brand />
        <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-8">
          {navigation.map(([label, href]) => (
            <a
              className="text-[13px] text-neutral-300 hover:text-white transition-colors font-medium"
              key={href}
              href={href}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex gap-3 items-center">
          <Button
            variant="automotive"
            asChild
            className="hidden sm:inline-flex h-9 text-xs px-5 font-semibold tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md shadow-primary/10"
          >
            <a href="/contato">
              Solicitar avaliação <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Navegação móvel"
          className="bg-black/95 backdrop-blur-lg border-t border-white/10 px-6 py-5 grid gap-5 lg:hidden animate-in fade-in slide-in-from-top-2"
        >
          {navigation.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-neutral-200 hover:text-primary transition-colors"
            >
              {label}
            </a>
          ))}
          <Button
            variant="automotive"
            asChild
            className="bg-primary text-primary-foreground font-semibold text-xs tracking-wide hover:bg-primary/90"
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
