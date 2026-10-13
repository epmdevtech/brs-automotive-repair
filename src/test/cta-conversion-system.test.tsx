import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ContactForm } from "@/components/brs/contact-form";

describe("SPEC-021 — Sistema Premium de CTAs, Conversão e Microinterações", () => {
  describe("1. Componente Canônico de Botão e Eliminação de Bevel (SPEC-022)", () => {
    it("renderiza botão primário com classe canônica btn--primary sem chanfro", () => {
      render(<Button variant="primary">SOLICITAR AVALIAÇÃO</Button>);
      const btn = screen.getByRole("button", { name: "SOLICITAR AVALIAÇÃO" });

      expect(btn).toHaveClass("btn");
      expect(btn).toHaveClass("btn--primary");
      expect(btn).not.toHaveClass("btn-bevel-4");
    });

    it("renderiza botão secundário com classe canônica btn--secondary sem chanfro", () => {
      render(<Button variant="secondary">CONHECER FUNILARIA</Button>);
      const btn = screen.getByRole("button", { name: "CONHECER FUNILARIA" });

      expect(btn).toHaveClass("btn");
      expect(btn).toHaveClass("btn--secondary");
      expect(btn).not.toHaveClass("btn-bevel-4");
    });

    it("renderiza botão compacto com classe canônica btn--sm sem chanfro", () => {
      render(<Button variant="compact">Avaliar</Button>);
      const btn = screen.getByRole("button", { name: "Avaliar" });

      expect(btn).toHaveClass("btn");
      expect(btn).toHaveClass("btn--sm");
      expect(btn).not.toHaveClass("btn-bevel-4-sm");
    });

    it("renderiza botão link/terciário sem fundo e sem chanfro", () => {
      render(<Button variant="tertiary">Mais informações</Button>);
      const btn = screen.getByRole("button", { name: "Mais informações" });

      expect(btn).not.toHaveClass("btn-bevel-4");
      expect(btn).toHaveClass("btn--link");
    });

    it("assegura aplicação da classe base de botão .btn", () => {
      const { rerender } = render(<Button size="default">Default</Button>);
      let btn = screen.getByRole("button", { name: "Default" });
      expect(btn).toHaveClass("btn");

      rerender(<Button size="lg">Large</Button>);
      btn = screen.getByRole("button", { name: "Large" });
      expect(btn).toHaveClass("btn");
    });
  });

  describe("2. Microinteração Magnética Desktop (AC-021-02)", () => {
    it("renderiza container para o botão sem travar a árvore DOM", () => {
      render(
        <MagneticButton maxDistance={5}>
          <Button variant="primary">CTA Magnético</Button>
        </MagneticButton>,
      );

      expect(screen.getByRole("button", { name: "CTA Magnético" })).toBeInTheDocument();
    });

    it("respeita prefers-reduced-motion renderizando container neutro estático", () => {
      const { container } = render(
        <MagneticButton className="magnetic-wrapper">
          <Button variant="primary">Botão Acessível</Button>
        </MagneticButton>,
      );

      const wrapper = container.querySelector(".magnetic-wrapper");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("3. Formulário de Contato e Máquina de Estados (AC-021-03)", () => {
    it("renderiza o formulário com o botão em estado inicial (idle)", () => {
      render(<ContactForm partner={false} />);
      const submitBtn = screen.getByRole("button", { name: /preparar mensagem/i });

      expect(submitBtn).toBeInTheDocument();
      expect(submitBtn).not.toBeDisabled();
      expect(submitBtn).toHaveClass("btn--primary");
      expect(submitBtn).not.toHaveClass("btn-bevel-4");
    });

    it("exibe erros de validação e não abre o modal em caso de campos vazios", () => {
      render(<ContactForm partner={false} />);
      const submitBtn = screen.getByRole("button", { name: /preparar mensagem/i });

      fireEvent.click(submitBtn);

      expect(screen.getByText(/informe seu nome/i)).toBeInTheDocument();
      expect(screen.getByText(/informe um telefone válido com ddd/i)).toBeInTheDocument();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("transiciona para submitting e gera mensagem com modal ao preencher campos válidos", async () => {
      vi.useFakeTimers();
      render(<ContactForm partner={false} />);

      const nameInput = screen.getByPlaceholderText(/como podemos chamar você/i);
      const phoneInput = screen.getByPlaceholderText(/\(45\) 90000-0000/i);
      const descInput = screen.getByPlaceholderText(/descreva a peça afetada/i);

      fireEvent.change(nameInput, { target: { value: "Carlos Silva" } });
      fireEvent.change(phoneInput, { target: { value: "(45) 99888-7766" } });
      fireEvent.change(descInput, {
        target: { value: "Amassado leve na lateral sem romper pintura." },
      });

      const submitBtn = screen.getByRole("button", { name: /preparar mensagem/i });
      fireEvent.click(submitBtn);

      // Deve estar desativado e exibindo estado de processamento
      expect(submitBtn).toBeDisabled();
      expect(screen.getByText(/gerando mensagem.../i)).toBeInTheDocument();

      // Avança o timer de transição suave
      act(() => {
        vi.advanceTimersByTime(400);
      });

      // Modal aberto com a mensagem formatada
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(screen.getByText("Mensagem pronta para envio")).toBeInTheDocument();

      // Botões do modal seguem as variantes canônicas sem chanfro
      const copyBtn = screen.getByRole("button", { name: /copiar mensagem/i });
      expect(copyBtn).toHaveClass("btn--secondary");
      expect(copyBtn).not.toHaveClass("btn-bevel-4");

      const instagramBtn = screen.getByRole("link", { name: /abrir instagram/i });
      expect(instagramBtn).toHaveClass("btn--primary");
      expect(instagramBtn).not.toHaveClass("btn-bevel-4");

      vi.useRealTimers();
    });
  });
});
