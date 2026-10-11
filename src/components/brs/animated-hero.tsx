import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useReducedMotion } from "framer-motion";

export interface NavLink {
  label: string;
  href: string;
}

export interface HeroAction {
  text: string;
  onClick?: () => void;
  href?: string;
}

export interface AnimatedHeroProps {
  id?: string;
  backgroundImageUrl: string;
  logo: React.ReactNode;
  navLinks: NavLink[];
  topRightAction?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  ctaButton: HeroAction;
  secondaryCta?: HeroAction;
  bottomContent?: React.ReactNode;
  className?: string;
}

// Animation variants
const getContainerVariants = (reduced: boolean) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: reduced ? 0 : 0.15,
      delayChildren: reduced ? 0 : 0.2,
    },
  },
});

const getItemVariants = (reduced: boolean) => ({
  hidden: { y: reduced ? 0 : 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: reduced ? 0.01 : 0.6,
      ease: "easeOut",
    },
  },
});

export const AnimatedHero = ({
  id,
  backgroundImageUrl,
  logo,
  navLinks,
  topRightAction,
  eyebrow,
  title,
  description,
  ctaButton,
  secondaryCta,
  bottomContent,
  className,
}: AnimatedHeroProps) => {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const containerVariants = getContainerVariants(shouldReduceMotion);
  const itemVariants = getItemVariants(shouldReduceMotion);

  // Estilo de botão glass reutilizável com acabamento automotivo premium
  const glassButtonClassName =
    "bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 hover:border-primary/60 transition-colors font-medium";

  return (
    <section
      id={id}
      className={cn(
        "relative flex min-h-[760px] md:min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background text-foreground",
        className,
      )}
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className="absolute inset-0 bg-black/65 backdrop-contrast-105" />
      </div>

      <motion.header
        initial={{ y: shouldReduceMotion ? 0 : -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.8, ease: "easeOut" }}
        className="absolute top-0 z-20 flex h-24 w-full items-center justify-between px-6 md:px-12 border-b border-white/10 bg-linear-to-b from-black/70 to-transparent"
      >
        <div className="flex items-center gap-2">{logo}</div>
        <nav aria-label="Navegação do Hero" className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">{topRightAction}</div>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-start justify-center text-left px-6 md:px-12 max-w-5xl w-full pt-28 pb-16"
      >
        {eyebrow && (
          <motion.div variants={itemVariants} className="mb-2">
            {eyebrow}
          </motion.div>
        )}
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-display uppercase leading-[0.98]"
        >
          {title}
        </motion.h1>
        <motion.div
          variants={itemVariants}
          className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-muted-foreground"
        >
          {description}
        </motion.div>
        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-4">
          {ctaButton.href ? (
            <Button
              asChild
              size="lg"
              variant="automotive"
              className="h-12 px-7 text-xs font-semibold shadow-lg shadow-primary/20"
            >
              <a href={ctaButton.href} onClick={ctaButton.onClick}>
                {ctaButton.text}
              </a>
            </Button>
          ) : (
            <Button
              onClick={ctaButton.onClick}
              size="lg"
              variant="automotive"
              className="h-12 px-7 text-xs font-semibold shadow-lg shadow-primary/20"
            >
              {ctaButton.text}
            </Button>
          )}

          {secondaryCta &&
            (secondaryCta.href ? (
              <Button asChild size="lg" className={cn("h-12 px-7 text-xs", glassButtonClassName)}>
                <a href={secondaryCta.href} onClick={secondaryCta.onClick}>
                  {secondaryCta.text}
                </a>
              </Button>
            ) : (
              <Button
                onClick={secondaryCta.onClick}
                size="lg"
                className={cn("h-12 px-7 text-xs", glassButtonClassName)}
              >
                {secondaryCta.text}
              </Button>
            ))}
        </motion.div>
      </motion.div>

      {bottomContent && (
        <div className="relative z-10 w-full px-6 md:px-12 pb-6 mt-auto">{bottomContent}</div>
      )}
    </section>
  );
};
