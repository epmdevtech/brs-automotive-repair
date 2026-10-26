import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeBeforeAfter } from "@/components/brs/home-before-after";
import { ProjectGallery } from "@/components/brs/project-gallery";
import funilariaAntes from "@/assets/funilaria-antes.jpg";
import funilariaDepois from "@/assets/funilaria-depois.jpg";
import pinturaAntes from "@/assets/pintura-antes.jpg";
import pinturaDepois from "@/assets/pintura-depois.jpg";
import martelinhoAntes from "@/assets/martelinho-antes.jpg";
import martelinhoDepois from "@/assets/martelinho-depois.jpg";
import funilariaServico from "@/assets/funilaria-servico.jpg";
import pinturaServico from "@/assets/pintura-servico.jpg";
import martelinhoServico from "@/assets/martelinho-servico.jpg";
import oficinaFachada02 from "@/assets/cliente/oficina-fachada-02.jpg";

describe("SPEC-026 — Imagens Distintas para Antes e Depois e Eliminação de Repetição Visual", () => {
  it("garante que os pares de antes e depois são arquivos de imagem distintos", () => {
    // Par de Funilaria
    expect(funilariaAntes).not.toBe(funilariaDepois);
    expect(typeof funilariaAntes).toBe("string");
    expect(typeof funilariaDepois).toBe("string");

    // Par de Pintura em Estufa
    expect(pinturaAntes).not.toBe(pinturaDepois);
    expect(typeof pinturaAntes).toBe("string");
    expect(typeof pinturaDepois).toBe("string");

    // Par de Martelinho de Ouro
    expect(martelinhoAntes).not.toBe(martelinhoDepois);
    expect(typeof martelinhoAntes).toBe("string");
    expect(typeof martelinhoDepois).toBe("string");
  });

  it("garante que as fotografias de serviço e corretores são distintas entre si e dos pares", () => {
    const assets = [
      funilariaAntes,
      funilariaDepois,
      pinturaAntes,
      pinturaDepois,
      martelinhoAntes,
      martelinhoDepois,
      funilariaServico,
      pinturaServico,
      martelinhoServico,
      oficinaFachada02,
    ];

    const uniqueAssets = new Set(assets);
    expect(uniqueAssets.size).toBe(assets.length);
  });

  it("renderiza o comparador da Home com imagens distintas de antes e depois sem filtro CSS simulado", () => {
    const { container } = render(<HomeBeforeAfter />);

    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThanOrEqual(2);

    const srcList = Array.from(images).map((img) => img.getAttribute("src"));
    // Deve conter funilariaAntes e funilariaDepois
    expect(srcList).toContain(funilariaAntes);
    expect(srcList).toContain(funilariaDepois);

    // Nenhuma imagem deve possuir classe de filtro CSS artificial que simule avaria
    images.forEach((img) => {
      const className = img.getAttribute("class") || "";
      expect(className).not.toContain("filter contrast-125");
      expect(className).not.toContain("filter blur");
    });
  });

  it("renderiza os 3 comparadores da ProjectGallery com imagens distintas e sem filtros simulados", () => {
    const { container } = render(<ProjectGallery />);

    const images = container.querySelectorAll("img");
    expect(images.length).toBeGreaterThanOrEqual(6);

    const srcList = Array.from(images).map((img) => img.getAttribute("src"));
    expect(srcList).toContain(funilariaAntes);
    expect(srcList).toContain(funilariaDepois);
    expect(srcList).toContain(pinturaAntes);
    expect(srcList).toContain(pinturaDepois);
    expect(srcList).toContain(martelinhoAntes);
    expect(srcList).toContain(martelinhoDepois);

    images.forEach((img) => {
      const className = img.getAttribute("class") || "";
      expect(className).not.toContain("filter contrast-125");
      expect(className).not.toContain("filter contrast-150");
      expect(className).not.toContain("filter blur");
    });
  });
});
