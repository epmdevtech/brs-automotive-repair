import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * SPEC-070 — Trava de continuidade do zoom do Hero.
 *
 * O "pulo" era causado pela redefinição da animação sob `.hero-intro-complete`
 * (mudança de `animation-delay` remapeia a linha do tempo de uma animação em curso).
 * Estes testes impedem a reintrodução do defeito.
 */
const css = fs.readFileSync(path.resolve(process.cwd(), "src/styles.css"), "utf8");

describe("SPEC-070: continuidade do zoom do Hero (src/styles.css)", () => {
  it("define o keyframe de zoom com translate3d(0,0,0) e escala por variável", () => {
    const keyframes = css.match(/@keyframes\s+heroSlowZoom\s*\{[\s\S]*?\n\}/);
    expect(keyframes).not.toBeNull();
    const block = keyframes![0];

    expect(block).toMatch(/translate3d\(\s*0,\s*0,\s*0\s*\)\s*scale\(\s*1\s*\)/);
    expect(block).toMatch(
      /translate3d\(\s*0,\s*0,\s*0\s*\)\s*scale\(\s*var\(--hero-cinematic-zoom-scale/,
    );
  });

  it("usa easing contínuo e mantém a escala final (forwards) na imagem do Hero", () => {
    const rule = css.match(/\.hero-photo-cinematic\s*\{[\s\S]*?\n\}/);
    expect(rule).not.toBeNull();
    const block = rule![0];

    expect(block).toMatch(/animation:\s*heroSlowZoom/);
    expect(block).toContain("cubic-bezier(0.25, 0.1, 0.25, 1)");
    expect(block).toMatch(/forwards/);
    expect(block).toContain("will-change: transform;");
    expect(block).toContain("backface-visibility: hidden;");
  });

  it("NÃO redefine a animação do zoom sob a classe hero-intro-complete (causa-raiz do pulo)", () => {
    expect(css).not.toMatch(/\.hero-intro-complete\s+\.hero-photo-cinematic/);
    // A regra de conclusão da abertura não deve mencionar o elemento da foto
    const completeBlock = css.match(/\.hero-intro-complete[^{]*\{[^}]*animation:\s*none/);
    if (completeBlock) {
      expect(completeBlock[0]).not.toContain("hero-photo-cinematic");
    }
  });
});
