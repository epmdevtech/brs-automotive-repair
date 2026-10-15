import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { Appointment } from "@/features/booking/domain/types";
import {
  toPublicCustomerTrackingDto,
  mascararPlacaPublica,
  extrairPrimeiroNomeTecnico,
  CONTATO_OFICINA,
} from "@/features/booking/domain/tracking-public";
import type { EventoEtapa } from "@/features/booking/domain/etapas";

describe("Página Pública de Acompanhamento (SPEC-058 / TASK-058-01)", () => {
  const baseAppointment: Appointment = {
    id: "app-test-civic",
    protocol: "#BRS-7391",
    serviceId: "martelinho-express",
    professionalId: "bruno-tecnico",
    startTime: "2026-10-15T08:00:00.000Z",
    endTime: "2026-10-15T09:30:00.000Z",
    status: "CONFIRMED",
    customer: {
      name: "Rodrigo Mendonça",
      phone: "+5545999881122",
      rawPhone: "(45) 99988-1122",
      notes: "Nota interna da oficina estritamente confidencial",
      consentLgpd: true,
    },
    intake: {
      vehicle: {
        make: "Honda",
        model: "Civic G10 Touring",
        year: "2021",
        plate: "BCX-2A34",
        color: "Cinza Cósmico",
        finishType: "metalica",
      },
      affectedAreas: ["porta-traseira-esquerda"],
      damageType: "amassado-sem-recolocacao",
      description: "Amassado leve na linha de vinco da porta traseira.",
      isInsurance: false,
    },
    logistics: {
      type: "leva-e-traz",
      address: "Rua Santos Dumont, 1200",
      city: "Toledo",
      vehicleDrivable: true,
      contactPerson: "Rodrigo",
    },
    createdAt: "2026-10-15T07:30:00.000Z",
    idempotencyKey: "test-civic-7391",
  };

  const eventosEtapa2: EventoEtapa[] = [
    {
      id: "ev-1",
      agendamentoId: "app-test-civic",
      etapa: "agendamento_confirmado",
      tipo: "concluida",
      origem: "automatico",
      porUsuarioId: null,
      porNome: "Sistema",
      papel: "sistema",
      em: "2026-10-15T07:42:00.000Z",
    },
  ];

  describe("Privacidade, Segurança e DTO Público (F9, D10)", () => {
    it("mascara a placa do veículo conforme LGPD (BCX-2A34 -> BCX-***4)", () => {
      expect(mascararPlacaPublica("BCX-2A34")).toBe("BCX-***4");
      expect(mascararPlacaPublica("abc1234")).toBe("ABC-***4");
      expect(mascararPlacaPublica("ABC-1D23")).toBe("ABC-***3");
      expect(mascararPlacaPublica(undefined)).toBe("Placa não informada");
    });

    it("extrai o primeiro nome de técnico legítimo e omite cargos genéricos", () => {
      expect(extrairPrimeiroNomeTecnico("Bruno (Funilaria & Vistoria)")).toBe("Bruno");
      expect(extrairPrimeiroNomeTecnico("Lucas Martins")).toBe("Lucas");
      expect(extrairPrimeiroNomeTecnico("Técnico Martelinho de Ouro")).toBeUndefined();
      expect(extrairPrimeiroNomeTecnico("Técnico Pintura em Estufa")).toBeUndefined();
      expect(extrairPrimeiroNomeTecnico("Administrador")).toBeUndefined();
      expect(extrairPrimeiroNomeTecnico(null)).toBeUndefined();
    });

    it("projeta o DTO sem vazar notas confidenciais, telefones completos ou documentos do cliente", () => {
      const dto = toPublicCustomerTrackingDto(baseAppointment, eventosEtapa2);

      expect(dto.protocolo).toBe("#BRS-7391");
      expect(dto.veiculoResumo).toBe("Honda Civic G10 Touring (2021)");
      expect(dto.placaMascarada).toBe("BCX-***4");
      expect(dto.servicoTitulo).toBe("Martelinho de ouro (PDR)");
      expect(dto.tecnicoPrimeiroNome).toBe("Bruno");

      // Garantir que notas confidenciais e dados sensíveis não estão nas propriedades do DTO
      const dtoStr = JSON.stringify(dto);
      expect(dtoStr).not.toContain("Nota interna da oficina estritamente confidencial");
      expect(dtoStr).not.toContain("999881122");
      expect(dtoStr).not.toContain("Rua Santos Dumont");
    });
  });

  describe("Cálculo de Progresso e 6 Etapas Operacionais (F4, D4)", () => {
    it("identifica corretamente a etapa 2 como atual quando 1 etapa está concluída", () => {
      const dto = toPublicCustomerTrackingDto(baseAppointment, eventosEtapa2);

      expect(dto.etapaAtualOrdem).toBe(2);
      expect(dto.etapasConcluidasQtd).toBe(1);
      expect(dto.statusGeral).toBe("em_andamento");
      expect(dto.etapaAtualTitulo).toBe("Veículo recebido na oficina");

      // Deve ter exatamente 6 etapas projetadas
      expect(dto.etapas).toHaveLength(6);
      expect(dto.etapas[0].estado).toBe("concluida");
      expect(dto.etapas[1].estado).toBe("atual");
      expect(dto.etapas[2].estado).toBe("pendente");
      expect(dto.etapas[3].estado).toBe("pendente");
      expect(dto.etapas[4].estado).toBe("pendente");
      expect(dto.etapas[5].estado).toBe("pendente");

      // Requer ação do cliente deve ser falso pois não está na etapa de orçamento
      expect(dto.requerAcaoCliente).toBe(false);
    });

    it("ativa requerAcaoCliente exclusivamente quando a etapa atual for a 4 (Orçamento)", () => {
      const eventosEtapa4: EventoEtapa[] = [
        ...eventosEtapa2,
        {
          id: "ev-2",
          agendamentoId: "app-test-civic",
          etapa: "veiculo_recebido",
          tipo: "concluida",
          origem: "manual",
          porUsuarioId: "u-2",
          porNome: "Recepção",
          papel: "secretaria",
          em: "2026-10-15T08:10:00.000Z",
        },
        {
          id: "ev-3",
          agendamentoId: "app-test-civic",
          etapa: "vistoria_diagnostico",
          tipo: "concluida",
          origem: "manual",
          porUsuarioId: "u-1",
          porNome: "Bruno",
          papel: "avaliador",
          em: "2026-10-15T09:00:00.000Z",
        },
      ];

      const dto = toPublicCustomerTrackingDto(baseAppointment, eventosEtapa4);
      expect(dto.etapaAtualOrdem).toBe(4);
      expect(dto.etapaAtualTitulo).toBe("Aprovação do orçamento");
      expect(dto.requerAcaoCliente).toBe(true);

      const etapaOrcamento = dto.etapas.find((e) => e.id === "aprovacao_orcamento");
      expect(etapaOrcamento?.estado).toBe("atual");
      expect(etapaOrcamento?.requerAcaoCliente).toBe(true);
    });

    it("previsão de entrega é renderizada apenas quando informada no cadastro", () => {
      // Sem estimativa
      const dtoSemEstimativa = toPublicCustomerTrackingDto(baseAppointment, eventosEtapa2);
      expect(dtoSemEstimativa.previsaoEntrega).toBeUndefined();

      // Com estimativa formal
      const appComEstimativa = {
        ...baseAppointment,
        intake: {
          ...baseAppointment.intake,
          deliveryEstimate: "18/10 às 17h",
        },
      };
      const dtoComEstimativa = toPublicCustomerTrackingDto(appComEstimativa, eventosEtapa2);
      expect(dtoComEstimativa.previsaoEntrega).toBe("18/10 às 17h");
    });
  });

  describe("Canais de Atendimento e Links Rápidos (F6)", () => {
    it("constrói links corretos de WhatsApp com protocolo e texto contextualizado", () => {
      const linkGeral = CONTATO_OFICINA.construirLinkWhatsApp("#BRS-7391");
      expect(linkGeral).toContain("wa.me/554520359440");
      expect(linkGeral).toContain(encodeURIComponent("#BRS-7391"));

      const linkAprovacao = CONTATO_OFICINA.construirLinkWhatsAppAprovacao("#BRS-7391");
      expect(linkAprovacao).toContain("wa.me/554520359440");
      expect(linkAprovacao).toContain(encodeURIComponent("aprovar o orçamento"));
    });
  });

  describe("Isolamento de Layout em /acompanhar (F1, D1, D2)", () => {
    it("não renderiza menu flutuante de marketing em rotas de acompanhamento", async () => {
      const { SiteLayout } = await import("@/components/brs/site-layout");
      const tanstackRouter = await import("@tanstack/react-router");
      vi.spyOn(tanstackRouter, "useRouterState").mockReturnValue(
        "/acompanhar/BRS-7391" as unknown as ReturnType<typeof tanstackRouter.useRouterState>,
      );

      render(
        <SiteLayout>
          <div data-testid="tracking-content">Conteúdo da Rota de Acompanhamento</div>
        </SiteLayout>,
      );

      // O conteúdo principal é renderizado
      expect(screen.getByTestId("tracking-content")).toBeInTheDocument();

      // O botão de marketing "AVALIAÇÃO" e menus institucionais NÃO são montados
      expect(screen.queryByRole("link", { name: /avaliação/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /para corretores/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /nosso trabalho/i })).not.toBeInTheDocument();
    });
  });
});
