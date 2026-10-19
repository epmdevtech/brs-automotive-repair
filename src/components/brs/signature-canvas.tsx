import * as React from "react";
import { Sparkles, Eye } from "lucide-react";
import { isReducedMotionPreferred } from "@/lib/motion-system";
import { cn } from "@/lib/utils";

export type CanvasMode = "verniz" | "laser";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface SignatureCanvasProps {
  className?: string;
  interactive?: boolean;
}

const GOLD_PALETTE = [
  "rgba(212, 175, 55, ", // Gold metallic
  "rgba(230, 195, 85, ", // Light gold
  "rgba(200, 169, 106, ", // Canonical Master Gold
  "rgba(255, 255, 255, ", // High-light specular
];

/**
 * SignatureCanvas — Experiência interativa WebGL/Canvas signature (SPEC-033).
 *
 * Simula a física óptica de partículas metálicas de verniz automotivo e feixes laser
 * de alinhamento estrutural, reagindo à posição e velocidade do cursor.
 * Não intercepta cliques da interface (pointer-events pass-through) e suspende a execução
 * quando o elemento sai da tela ou a aba é ocultada.
 */
export function SignatureCanvas({ className, interactive = true }: SignatureCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mode, setMode] = React.useState<CanvasMode>("verniz");
  const [hudVisible, setHudVisible] = React.useState(true);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isReduced = isReducedMotionPreferred();

    let animationFrameId: number;
    let isVisible = true;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Ajuste de DPI para nitidez em telas Retina/4K
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const mouse = {
      x: width * 0.5,
      y: height * 0.45,
      prevX: width * 0.5,
      prevY: height * 0.45,
      speed: 0,
      radius: 140,
      active: false,
    };

    // Inicialização do conjunto de partículas metálicas automotivas
    const particleCount = isReduced ? 25 : Math.floor(Math.min(width * 0.065, 80));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const baseAlpha = 0.25 + Math.random() * 0.6;
      particles.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: 1.2 + Math.random() * 2.2,
        baseSize: 1.2 + Math.random() * 2.2,
        color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
        alpha: baseAlpha,
        baseAlpha,
        pulseSpeed: 0.015 + Math.random() * 0.025,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Onda de pulso ao clique
    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
    }
    const ripples: Ripple[] = [];

    const triggerRipple = (x: number, y: number) => {
      if (isReduced) return;
      ripples.push({
        x,
        y,
        radius: 0,
        maxRadius: Math.min(width, height) * 0.4,
        alpha: 0.6,
      });
    };

    // Eventos de cursor ouvidos no container ou janela para não bloquear os botões da UI
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const dx = currentX - mouse.prevX;
      const dy = currentY - mouse.prevY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);

      mouse.x = currentX;
      mouse.y = currentY;
      mouse.prevX = currentX;
      mouse.prevY = currentY;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      triggerRipple(e.clientX - rect.left, e.clientY - rect.top);
    };

    if (interactive && typeof window !== "undefined") {
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      window.addEventListener("pointerleave", handlePointerLeave, {
        passive: true,
      });
      window.addEventListener("click", handleClick, { passive: true });
    }

    // Redimensionamento com ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Pausa em aba oculta
    const handleVisibility = () => {
      isVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Loop de renderização cinemático
    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Renderiza ondas de choque de alinhamento estrutural
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += 5.5;
        rip.alpha -= 0.015;

        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
          ripples.splice(r, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212, 175, 55, ${rip.alpha * 0.7})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Traçados de feixe laser conectivos entre partículas próximas
      if (mode === "laser") {
        ctx.lineWidth = 0.65;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 110) {
              const lineAlpha = (1 - dist / 110) * 0.22;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha})`;
              ctx.stroke();
            }
          }
        }
      }

      // 3. Renderiza e atualiza partículas metálicas
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!isReduced) {
          // Pulso natural de brilho
          p.pulsePhase += p.pulseSpeed;
          p.alpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.2;

          // Movimento inercial suave
          p.x += p.vx;
          p.y += p.vy;

          // Limites do canvas com wrap-around suave
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Interação dinâmica com o cursor
          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
              const force = (1 - dist / mouse.radius) * 0.08;
              const angle = Math.atan2(dy, dx);
              // Modo verniz: repulsão fluida; Modo laser: atração para o feixe
              const dir = mode === "laser" ? 1 : -1;
              p.x += Math.cos(angle) * force * 15 * dir;
              p.y += Math.sin(angle) * force * 15 * dir;
              p.alpha = Math.min(1, p.alpha + 0.3);
            }
          }
        }

        // Desenho da partícula com brilho especular
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.alpha))})`;
        ctx.fill();

        // Brilho difuso em partículas maiores
        if (p.size > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha * 0.15})`;
          ctx.fill();
        }
      }

      // 4. Feixe de laser no ponto do cursor (quando ativo)
      if (mouse.active && !isReduced) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212, 175, 55, 0.85)";
        ctx.fill();

        // Linhas de mira óptica técnica (crosshair)
        ctx.strokeStyle = "rgba(212, 175, 55, 0.28)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(mouse.x - 14, mouse.y);
        ctx.lineTo(mouse.x + 14, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 14);
        ctx.lineTo(mouse.x, mouse.y + 14);
        ctx.stroke();
        ctx.restore();
      }

      if (!isReduced) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      if (interactive && typeof window !== "undefined") {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerleave", handlePointerLeave);
        window.removeEventListener("click", handleClick);
      }
    };
  }, [interactive, mode]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 pointer-events-none select-none overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full h-full block opacity-75 transition-opacity duration-1000"
      />

      {/* Mini-HUD de controle da experiência (Awwwards Signature HUD) */}
      {hudVisible && (
        <div className="pointer-events-auto absolute bottom-20 right-3 sm:right-10 z-20 flex items-center gap-1.5 p-1 rounded-sm glass-panel-luxury text-[10px] font-mono tracking-wider border border-white/10 shadow-xl shadow-black/80 max-w-[calc(100vw-24px)]">
          <div className="flex items-center gap-1 px-2 py-0.5 text-neutral-400">
            <Sparkles size={11} className="text-primary" />
            <span>OPTICAL HUD</span>
          </div>

          <div className="flex items-center gap-1 border-l border-white/10 pl-1">
            <button
              type="button"
              onClick={() => setMode("verniz")}
              className={cn(
                "px-2 py-0.5 rounded-xs transition-colors cursor-pointer",
                mode === "verniz"
                  ? "bg-primary text-black font-semibold"
                  : "text-neutral-400 hover:text-white",
              )}
              title="Modo Partículas de Verniz e Pigmento Metálico"
            >
              VERNIZ
            </button>
            <button
              type="button"
              onClick={() => setMode("laser")}
              className={cn(
                "px-2 py-0.5 rounded-xs transition-colors cursor-pointer",
                mode === "laser"
                  ? "bg-primary text-black font-semibold"
                  : "text-neutral-400 hover:text-white",
              )}
              title="Modo Matriz e Feixes de Alinhamento a Laser"
            >
              LASER
            </button>
          </div>

          <button
            type="button"
            onClick={() => setHudVisible(false)}
            aria-label="Ocultar HUD de controle óptico"
            className="text-neutral-500 hover:text-neutral-300 p-1 cursor-pointer"
            title="Minimizar HUD"
          >
            <Eye size={11} />
          </button>
        </div>
      )}
    </div>
  );
}
