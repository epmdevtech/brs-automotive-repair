import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/brs";
import { Brand } from "./brand";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="page-width header-inner">
        <Brand />
        <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-6">
          {navigation.map(([label, href]) => (
            <a className="nav-link" key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="flex gap-3 items-center">
          <Button
            variant="automotive"
            asChild
            className="hidden sm:inline-flex h-10 text-[11px] px-5"
          >
            <a href="#contato">
              Solicitar avaliação <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
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
          className="bg-background border-t border-border px-6 py-5 grid gap-5 lg:hidden"
        >
          {navigation.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="text-sm">
              {label}
            </a>
          ))}
          <Button variant="automotive" asChild>
            <a href="#contato" onClick={() => setOpen(false)}>
              Solicitar avaliação <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
            </a>
          </Button>
        </nav>
      )}
    </header>
  );
}
