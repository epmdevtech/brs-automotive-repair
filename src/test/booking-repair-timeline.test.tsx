import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CustomerProcessDialog } from "../features/booking/ui/admin/customer-process-dialog";
import { RepairTimeline } from "../features/booking/ui/admin/repair-timeline";
import { LocalBookingRepository } from "../features/booking/data/local/local-repository";
import {
  maskPlate,
  MILESTONE_MESSAGES,
  buildMilestoneWhatsAppUrl,
  getEventsForAppointment,
  ensureInitialEvents,
} from "../features/booking/domain/events";
import type { Appointment, SyncMessage } from "../features/booking/domain/types";

describe("SPEC-050: Correção dos Botões no Modal de Processo (Fechar, Concluir, Cancelar)", () => {
  const baseAppointment: Appointment = {
    id: "app-test-50",
    protocol: "#BRS-5050",
    serviceId: "avaliacao-funilaria",
    professionalId: "bruno-tecnico",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    status: "CONFIRMED",
    customer: {
      name: "Ana Carolina Prado",
      phone: "+5545999112233",
      rawPhone: "(45) 99911-2233",
      notes: "Avaliação técnica de funilaria.",
      consentLgpd: true,
    },
    intake: {
      vehicle: {
        make: "Volkswagen",
        model: "Nivus Highline",
        year: "2023",
        plate: "RHZ-9B21",
        color: "Cinza Moonstone",
        finishType: "metalica",
      },
      affectedAreas: ["para-choque-dianteiro"],
      damageType: "colisao-com-vinco",
      description: "Colisão em garagem com vinco no para-choque.",
      isInsurance: false,
    },
    logistics: {
      type: "presencial",
      vehicleDrivable: true,
    },
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    idempotencyKey: "idem-test-5050",
  };

  beforeEach(() => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
    vi.clearAllMocks();
  });

  it("Fechar: fecha o modal previsivelmente sem alterar status nem dados persistidos", () => {
    const handleOpenChange = vi.fn();
    const handleStatusChange = vi.fn();

    render(
      <CustomerProcessDialog
        appointment={baseAppointment}
        open={true}
        onOpenChange={handleOpenChange}
        onStatusChange={handleStatusChange}
      />,
    );

    const closeBtn = screen.getByRole("button", { name: /^Fechar$/i });
    fireEvent.click(closeBtn);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
    expect(handleStatusChange).not.toHaveBeenCalled();
  });

  it("Concluir: valida FSM, bloqueia duplo clique com loading e só fecha após sucesso", async () => {
    let resolveMutation: (val: boolean) => void = () => {};
    const mutationPromise = new Promise<boolean>((resolve) => {
      resolveMutation = resolve;
    });

    const handleStatusChange = vi.fn().mockReturnValue(mutationPromise);
    const handleOpenChange = vi.fn();

    render(
      <CustomerProcessDialog
        appointment={baseAppointment}
        open={true}
        onOpenChange={handleOpenChange}
        onStatusChange={handleStatusChange}
      />,
    );

    const completeBtn = screen.getByRole("button", { name: /Concluir Atendimento/i });
    fireEvent.click(completeBtn);

    // O botão deve estar desabilitado durante o envio
    expect(completeBtn).toBeDisabled();
    expect(handleStatusChange).toHaveBeenCalledWith(
      "app-test-50",
      "COMPLETED",
      expect.objectContaining({
        actorName: "Bruno (Funilaria & Vistoria)",
      }),
    );

    // Modal ainda NÃO deve ter fechado antes da resposta
    expect(handleOpenChange).not.toHaveBeenCalled();

    // Resolve a mutação com sucesso
    resolveMutation(true);

    // Aguarda o feedback de sucesso
    await waitFor(() => {
      expect(screen.getByText(/Atendimento concluído com sucesso!/i)).toBeInTheDocument();
    });
  });

  it("Cancelar: abre AlertDialog acessível, não chama window.confirm e envia justificativa", async () => {
    const confirmSpy = vi.spyOn(window, "confirm");
    const handleStatusChange = vi.fn().mockResolvedValue(true);
    const handleOpenChange = vi.fn();

    render(
      <CustomerProcessDialog
        appointment={baseAppointment}
        open={true}
        onOpenChange={handleOpenChange}
        onStatusChange={handleStatusChange}
      />,
    );

    // Clica no botão Cancelar principal
    const cancelTrigger = screen.getByRole("button", { name: /Cancelar/i });
    fireEvent.click(cancelTrigger);

    // Não deve chamar window.confirm()
    expect(confirmSpy).not.toHaveBeenCalled();

    // Deve abrir o Radix AlertDialog acessível
    expect(screen.getByText(/Confirmar Cancelamento do Agendamento/i)).toBeInTheDocument();

    // Insere justificativa de cancelamento
    const reasonInput = screen.getByPlaceholderText(/Ex: Desistência do cliente/i);
    fireEvent.change(reasonInput, {
      target: { value: "Cliente precisou reagendar para o próximo mês" },
    });

    // Confirma no AlertDialog
    const confirmCancelBtn = screen.getByRole("button", { name: /Confirmar Cancelamento/i });
    fireEvent.click(confirmCancelBtn);

    await waitFor(() => {
      expect(handleStatusChange).toHaveBeenCalledWith(
        "app-test-50",
        "CANCELLED",
        expect.objectContaining({
          note: "Cliente precisou reagendar para o próximo mês",
        }),
      );
    });

    confirmSpy.mockRestore();
  });
});

describe("SPEC-050: Sincronização Multi-Aba Estruturada & Web Locks (LocalBookingRepository)", () => {
  let repository: LocalBookingRepository;

  beforeEach(() => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
    repository = new LocalBookingRepository(
      "test_brs_appts_sync",
      "test_brs_lock_sync",
      "test_brs_channel_sync",
    );
  });

  it("registra transição de status no histórico append-only de eventos", async () => {
    const app: Appointment = {
      id: "app-sync-1",
      protocol: "#BRS-1010",
      serviceId: "avaliacao-funilaria",
      professionalId: "bruno-tecnico",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      status: "CONFIRMED",
      customer: {
        name: "Carlos Silveira",
        phone: "+5545999001122",
        consentLgpd: true,
      },
      intake: {
        vehicle: { make: "Ford", model: "Ka", plate: "ABC-1234" },
        affectedAreas: ["capo"],
        damageType: "colisao-com-vinco",
      },
      logistics: { type: "presencial" },
      createdAt: new Date().toISOString(),
      idempotencyKey: "idem-sync-1",
    };

    repository.clearAndSeed([app]);

    const res = await repository.updateStatus("app-sync-1", "COMPLETED", {
      actorId: "bruno-tecnico",
      actorName: "Bruno",
      note: "Pintura em estufa concluída e polida.",
    });

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value.status).toBe("COMPLETED");
    }

    // Verifica se o evento foi gravado no histórico append-only
    const events = getEventsForAppointment("app-sync-1");
    expect(events.length).toBeGreaterThanOrEqual(1);
    const completedEvt = events.find((e) => e.type === "COMPLETED");
    expect(completedEvt).toBeDefined();
    expect(completedEvt?.note).toBe("Pintura em estufa concluída e polida.");
  });

  it("rejeita transições de status inválidas de acordo com a FSM", async () => {
    const app: Appointment = {
      id: "app-invalid-1",
      protocol: "#BRS-2020",
      serviceId: "avaliacao-funilaria",
      professionalId: "bruno-tecnico",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      status: "COMPLETED",
      customer: {
        name: "Marina Lima",
        phone: "+5545999003344",
        consentLgpd: true,
      },
      intake: {
        vehicle: { make: "Jeep", model: "Renegade", plate: "XYZ-9876" },
        affectedAreas: ["lateral-direita"],
        damageType: "colisao-com-vinco",
      },
      logistics: { type: "presencial" },
      createdAt: new Date().toISOString(),
      idempotencyKey: "idem-invalid-1",
    };

    repository.clearAndSeed([app]);

    // Transição de COMPLETED para CONFIRMED é proibida pela FSM
    const res = await repository.updateStatus("app-invalid-1", "CONFIRMED");
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error).toContain("Transição inválida");
    }
  });
});

describe("SPEC-050: Linha do Tempo Dinâmica & Acompanhamento LGPD", () => {
  it("mascara placas de veículos em conformidade com a LGPD", () => {
    expect(maskPlate("RHZ9B21")).toBe("RHZ-***1");
    expect(maskPlate("RHZ-9B21")).toBe("RHZ-***1");
    expect(maskPlate("BCX2A34")).toBe("BCX-***4");
    expect(maskPlate(undefined)).toBe("Placa não informada");
  });

  it("renderiza a timeline com eventos persistidos e identifica status das etapas", () => {
    const mockApp: Appointment = {
      id: "app-timeline-1",
      protocol: "#BRS-7777",
      serviceId: "martelinho-express",
      professionalId: "tecnico-martelinho",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      status: "CONFIRMED",
      customer: {
        name: "Julio Cesar",
        phone: "+5545999123456",
        consentLgpd: true,
      },
      intake: {
        vehicle: { make: "BMW", model: "320i", plate: "BMW-3200" },
        affectedAreas: ["teto"],
        damageType: "granizo",
      },
      logistics: { type: "presencial" },
      createdAt: new Date(Date.now() - 7200 * 1000).toISOString(),
      idempotencyKey: "idem-timeline-1",
    };

    render(<RepairTimeline appointment={mockApp} />);

    // Deve renderizar as etapas adaptadas a Martelinho / PDR
    expect(screen.getByText(/1. Cadastro & Agendamento Confirmado/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Veículo Recebido na Oficina/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Vistoria Técnica & Diagnóstico/i)).toBeInTheDocument();
    expect(screen.getByText(/5. Execução: Desamassamento PDR/i)).toBeInTheDocument();
    expect(screen.getByText(/6. Controle de Qualidade & Entrega/i)).toBeInTheDocument();
  });
});

describe("SPEC-050: Gerador de Mensagens WhatsApp Custo Zero (Sem APIs Pagas)", () => {
  const mockApp: Appointment = {
    id: "app-wa-1",
    protocol: "#BRS-8888",
    serviceId: "avaliacao-funilaria",
    professionalId: "bruno-tecnico",
    startTime: new Date(2026, 9, 20, 14, 0).toISOString(),
    endTime: new Date(2026, 9, 20, 14, 45).toISOString(),
    status: "CONFIRMED",
    customer: {
      name: "Rodrigo Fagundes",
      phone: "+5545999554433",
      consentLgpd: true,
    },
    intake: {
      vehicle: { make: "Chevrolet", model: "S10 High Country", plate: "BRS-1020" },
      affectedAreas: ["lateral-esquerda"],
      damageType: "colisao-com-vinco",
    },
    logistics: { type: "presencial" },
    createdAt: new Date().toISOString(),
    idempotencyKey: "idem-wa-1",
  };

  it("gera mensagens estruturadas para os 5 marcos da reparação automotiva", () => {
    expect(MILESTONE_MESSAGES.length).toBe(5);

    const m1 = MILESTONE_MESSAGES[0].generateText(mockApp);
    expect(m1).toContain("Confirmamos o agendamento da sua avaliação");
    expect(m1).toContain("#BRS-8888");
    expect(m1).toContain("Chevrolet S10 High Country");

    const m2 = MILESTONE_MESSAGES[1].generateText(mockApp);
    expect(m2).toContain("já foi recebido no pátio da *BRS Reparações*");

    const m3 = MILESTONE_MESSAGES[2].generateText(mockApp);
    expect(m3).toContain("A vistoria técnica detalhada");

    const m4 = MILESTONE_MESSAGES[3].generateText(mockApp);
    expect(m4).toContain("fase de");

    const m5 = MILESTONE_MESSAGES[4].generateText(mockApp);
    expect(m5).toContain("passou com sucesso pelo nosso controle de qualidade");
  });

  it("constrói link direto wa.me com número do cliente e texto encodado", () => {
    const text = "Olá, seu veículo está pronto!";
    const url = buildMilestoneWhatsAppUrl("+55 (45) 99955-4433", text);
    expect(url).toBe(
      "https://wa.me/5545999554433?text=Ol%C3%A1%2C%20seu%20ve%C3%ADculo%20est%C3%A1%20pronto!",
    );
  });
});
