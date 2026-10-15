import type { Appointment } from "./types";
import { type BlockedPeriod, seedBlockedPeriods } from "./blocks";
import { parseTimeOnDate, addMinutesToDate, isSameCivilDay } from "./time";
import { localBookingRepository } from "../data/local/local-repository";

/**
 * Gera a lista de agendamentos fictícios realistas distribuídos entre hoje,
 * amanhã e ontem, alinhados às colunas dos técnicos e horários da grade.
 */
export function generateDemoAppointments(baseDate: Date = new Date()): Appointment[] {
  const today = new Date(baseDate);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Auxiliar para gerar intervalo ISO alinhado aos slots da grade (ex: 08:00, 09:00, 10:00, 14:00, 15:00)
  const interval = (date: Date, timeStr: string, minutes: number) => {
    const start = parseTimeOnDate(date, timeStr);
    const end = addMinutesToDate(start, minutes);
    return {
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      // Criação retroativa realista (1 a 4 horas antes do horário do agendamento)
      createdAt: new Date(
        start.getTime() - (120 + Math.floor(Math.random() * 60)) * 60 * 1000,
      ).toISOString(),
    };
  };

  const app1Times = interval(today, "09:00", 60);
  const app2Times = interval(today, "14:00", 60);
  const app3Times = interval(today, "10:00", 60);
  const app4Times = interval(today, "15:00", 60);
  const app5Times = interval(today, "08:00", 120);
  const app6Times = interval(tomorrow, "10:00", 60);
  const app7Times = interval(yesterday, "14:00", 60);

  return [
    // 1. Bruno - Funilaria Hoje 09:00 (Presencial)
    {
      id: "seed-app-1",
      protocol: "#BRS-8412",
      serviceId: "avaliacao-funilaria",
      professionalId: "bruno-tecnico",
      startTime: app1Times.startTime,
      endTime: app1Times.endTime,
      status: "CONFIRMED",
      customer: {
        name: "Roberto Albuquerque",
        phone: "+5545998214320",
        rawPhone: "(45) 99821-4320",
        notes: "Cliente indicado pela seguradora Porto Seguro. Avaliação presencial de funilaria.",
        consentLgpd: true,
      },
      intake: {
        vehicle: {
          make: "Toyota",
          model: "Corolla Altis",
          year: "2022",
          plate: "RHZ-9B21",
          color: "Cinza Granito",
          finishType: "metalica",
        },
        affectedAreas: ["para-choque-dianteiro", "para-lama-esq"],
        damageType: "colisao-com-vinco",
        description:
          "Colisão em cruzamento com amassado e vinco pronunciado no para-lama dianteiro esquerdo e travessas do para-choque desalinhadas.",
        isInsurance: true,
      },
      logistics: {
        type: "presencial",
        vehicleDrivable: true,
      },
      createdAt: app1Times.createdAt,
      idempotencyKey: "seed-idem-1",
    },

    // 2. Bruno - Funilaria Hoje 14:00 (Leva e Traz - Toledo/PR)
    {
      id: "seed-app-2",
      protocol: "#BRS-8415",
      serviceId: "avaliacao-funilaria",
      professionalId: "bruno-tecnico",
      startTime: app2Times.startTime,
      endTime: app2Times.endTime,
      status: "CONFIRMED",
      customer: {
        name: "Mariana Siqueira",
        phone: "+5545991348890",
        rawPhone: "(45) 99134-8890",
        notes: "Solicitou serviço Leva e Traz em domicílio corporativo no Centro de Toledo.",
        consentLgpd: true,
      },
      intake: {
        vehicle: {
          make: "Jeep",
          model: "Compass Longitude",
          year: "2023",
          plate: "QJF-4C10",
          color: "Branco Polar",
          finishType: "perolizada",
        },
        affectedAreas: ["lateral-direita", "porta-traseira-dir"],
        damageType: "colisao-com-vinco",
        description:
          "Raspagem lateral em coluna de estacionamento com vinco na porta traseira direita.",
        isInsurance: false,
      },
      logistics: {
        type: "leva-e-traz",
        address: "Rua Santos Dumont, 1420",
        neighborhood: "Centro",
        city: "Toledo",
        referencePoint: "Próximo à Praça Willy Barth",
        vehicleDrivable: true,
        contactPerson: "Mariana ou recepção do condomínio",
      },
      createdAt: app2Times.createdAt,
      idempotencyKey: "seed-idem-2",
    },

    // 3. Técnico Martelinho - Hoje 10:00 (Presencial - Granizo)
    {
      id: "seed-app-3",
      protocol: "#BRS-7391",
      serviceId: "martelinho-express",
      professionalId: "tecnico-martelinho",
      startTime: app3Times.startTime,
      endTime: app3Times.endTime,
      status: "CONFIRMED",
      customer: {
        name: "Carlos Eduardo Mendes",
        phone: "+5545997421100",
        rawPhone: "(45) 99742-1100",
        notes: "Danos de granizo no Lago Municipal. Exige manter pintura original 100%.",
        consentLgpd: true,
      },
      intake: {
        vehicle: {
          make: "Honda",
          model: "Civic G10 Touring",
          year: "2021",
          plate: "BCX-2A34",
          color: "Prata Platinum",
          finishType: "metalica",
        },
        affectedAreas: ["capo", "teto"],
        damageType: "granizo",
        description:
          "Cerca de 20 pequenas mossas de granizo no capô e teto solar. Sem dano ao verniz original de fábrica.",
        isInsurance: false,
      },
      logistics: {
        type: "presencial",
        vehicleDrivable: true,
      },
      createdAt: app3Times.createdAt,
      idempotencyKey: "seed-idem-3",
    },

    // 4. Técnico Martelinho - Hoje 15:00 (Leva e Traz - Jd. La Salle)
    {
      id: "seed-app-4",
      protocol: "#BRS-7394",
      serviceId: "martelinho-express",
      professionalId: "tecnico-martelinho",
      startTime: app4Times.startTime,
      endTime: app4Times.endTime,
      status: "CONFIRMED",
      customer: {
        name: "Fernanda Castilho",
        phone: "+5545998773321",
        rawPhone: "(45) 99877-3321",
        notes: "Leva e Traz com coleta agendada na Parigot de Souza.",
        consentLgpd: true,
      },
      intake: {
        vehicle: {
          make: "Volkswagen",
          model: "T-Cross Highline",
          year: "2024",
          plate: "SDF-8E99",
          color: "Azul Norway",
          finishType: "metalica",
        },
        affectedAreas: ["porta-dianteira-dir"],
        damageType: "amassado-sem-risco",
        description:
          "Pequena mossa ocasionada por batida de porta de outro veículo. Chapa perfeitamente recuperável sem repintura.",
        isInsurance: false,
      },
      logistics: {
        type: "leva-e-traz",
        address: "Avenida Parigot de Souza, 850",
        neighborhood: "Jd. La Salle",
        city: "Toledo",
        referencePoint: "Edifício Horizon, em frente ao Teatro Municipal",
        vehicleDrivable: true,
        contactPerson: "Fernanda",
      },
      createdAt: app4Times.createdAt,
      idempotencyKey: "seed-idem-4",
    },

    // 5. Técnico Pintura em Estufa - Hoje 08:00 (Pintura Especializada com Estufa)
    {
      id: "seed-app-5",
      protocol: "#BRS-9102",
      serviceId: "avaliacao-pintura",
      professionalId: "tecnico-pintura",
      startTime: app5Times.startTime,
      endTime: app5Times.endTime,
      status: "CONFIRMED",
      customer: {
        name: "Luciano Bortolotto",
        phone: "+5545999056712",
        rawPhone: "(45) 99905-6712",
        notes: "Reparação e pintura em estufa pressurizada com curagem por ondas curtas IV.",
        consentLgpd: true,
      },
      intake: {
        vehicle: {
          make: "Chevrolet",
          model: "Tracker Premier",
          year: "2023",
          plate: "RAY-5H71",
          color: "Vermelho Carmim",
          finishType: "perolizada",
        },
        affectedAreas: ["para-choque-traseiro", "tampa-traseira"],
        damageType: "risco-profundo-descascamento",
        description:
          "Arranhão profundo com perda de massa e descascamento após manobra. Requer preparação e verniz alto sólidos.",
        isInsurance: true,
      },
      logistics: {
        type: "presencial",
        vehicleDrivable: true,
      },
      createdAt: app5Times.createdAt,
      idempotencyKey: "seed-idem-5",
    },

    // 6. Amanhã - Bruno Funilaria
    {
      id: "seed-app-6",
      protocol: "#BRS-8420",
      serviceId: "avaliacao-funilaria",
      professionalId: "bruno-tecnico",
      startTime: app6Times.startTime,
      endTime: app6Times.endTime,
      status: "CONFIRMED",
      customer: {
        name: "Guilherme Sampaio",
        phone: "+5545999881234",
        rawPhone: "(45) 99988-1234",
        notes: "Cliente frotista do agronegócio.",
        consentLgpd: true,
      },
      intake: {
        vehicle: {
          make: "Ford",
          model: "Ranger Limited V6",
          year: "2024",
          plate: "RTM-7D12",
          color: "Preto Gales",
          finishType: "metalica",
        },
        affectedAreas: ["tampa-traseira", "para-choque-traseiro"],
        damageType: "colisao-com-vinco",
        description: "Impacto no engate e tampa da caçamba em área rural.",
        isInsurance: true,
      },
      logistics: {
        type: "presencial",
        vehicleDrivable: true,
      },
      createdAt: app6Times.createdAt,
      idempotencyKey: "seed-idem-6",
    },

    // 7. Ontem - Concluído para Histórico
    {
      id: "seed-app-7",
      protocol: "#BRS-7380",
      serviceId: "martelinho-express",
      professionalId: "tecnico-martelinho",
      startTime: app7Times.startTime,
      endTime: app7Times.endTime,
      status: "COMPLETED",
      customer: {
        name: "Juliana Peixoto",
        phone: "+5545999445566",
        rawPhone: "(45) 99944-5566",
        notes: "Atendimento concluído com sucesso e polimento técnico entregue.",
        consentLgpd: true,
      },
      intake: {
        vehicle: {
          make: "Hyundai",
          model: "Creta Ultimate",
          year: "2023",
          plate: "BDF-3K90",
          color: "Branco Atlas",
          finishType: "solida",
        },
        affectedAreas: ["lateral-esquerda"],
        damageType: "amassado-sem-risco",
        description: "Recuperação artesanal sem repintura na coluna dianteira.",
        isInsurance: false,
      },
      logistics: {
        type: "presencial",
        vehicleDrivable: true,
      },
      createdAt: app7Times.createdAt,
      idempotencyKey: "seed-idem-7",
    },
  ];
}

/**
 * Gera os períodos bloqueados padrão (ex: calibração da estufa de pintura).
 */
export function generateDemoBlockedPeriods(baseDate: Date = new Date()): BlockedPeriod[] {
  const start = parseTimeOnDate(baseDate, "14:00");
  const end = parseTimeOnDate(baseDate, "16:00");

  return [
    {
      id: "seed-blk-1",
      professionalId: "tecnico-pintura",
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      reason: "Calibração e Troca de Filtros da Estufa Pressurizada",
      createdAt: new Date().toISOString(),
    },
  ];
}

/**
 * Garante que os dados demonstrativos estejam presentes na base local.
 * Se force === true, sobrescreve mesmo se já houver dados.
 * Se force === false, verifica se hoje tem agendamentos e mescla os dados seed
 * para que a visualização da grade nunca fique zerada no ambiente demonstrativo.
 */
export function ensureSeedData(
  force = false,
  baseDate: Date = new Date(),
): { appointments: number; blocks: number } {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return { appointments: 0, blocks: 0 };
  }

  let seededAppsCount = 0;

  if (force) {
    const demoApps = generateDemoAppointments(baseDate);
    localBookingRepository.clearAndSeed(demoApps);
    seededAppsCount = demoApps.length;
  } else {
    try {
      const raw = localStorage.getItem("brs_appointments_v1");
      if (!raw || JSON.parse(raw).length === 0) {
        const demoApps = generateDemoAppointments(baseDate);
        localBookingRepository.clearAndSeed(demoApps);
        seededAppsCount = demoApps.length;
      } else {
        const currentList: Appointment[] = JSON.parse(raw);
        // Verifica se existem agendamentos ativos na data base (hoje)
        const hasAppointmentsToday = currentList.some(
          (a) => a.status !== "CANCELLED" && isSameCivilDay(new Date(a.startTime), baseDate),
        );

        if (!hasAppointmentsToday) {
          // Mantém agendamentos não-seed criados manualmente
          const nonSeed = currentList.filter((a) => !a.id.startsWith("seed-app-"));
          const demoApps = generateDemoAppointments(baseDate);
          localBookingRepository.clearAndSeed([...nonSeed, ...demoApps]);
          seededAppsCount = demoApps.length;
        }
      }
    } catch {
      const demoApps = generateDemoAppointments(baseDate);
      localBookingRepository.clearAndSeed(demoApps);
      seededAppsCount = demoApps.length;
    }
  }

  let seededBlocksCount = 0;
  if (force) {
    const demoBlocks = generateDemoBlockedPeriods(baseDate);
    seedBlockedPeriods(demoBlocks);
    seededBlocksCount = demoBlocks.length;
  } else {
    try {
      const raw = localStorage.getItem("brs_blocked_periods");
      if (!raw || JSON.parse(raw).length === 0) {
        const demoBlocks = generateDemoBlockedPeriods(baseDate);
        seedBlockedPeriods(demoBlocks);
        seededBlocksCount = demoBlocks.length;
      } else {
        const blocks: BlockedPeriod[] = JSON.parse(raw);
        const hasTodayBlock = blocks.some((b) => isSameCivilDay(new Date(b.startTime), baseDate));
        if (!hasTodayBlock) {
          const demoBlocks = generateDemoBlockedPeriods(baseDate);
          seedBlockedPeriods(demoBlocks);
          seededBlocksCount = demoBlocks.length;
        }
      }
    } catch {
      const demoBlocks = generateDemoBlockedPeriods(baseDate);
      seedBlockedPeriods(demoBlocks);
      seededBlocksCount = demoBlocks.length;
    }
  }

  return {
    appointments: seededAppsCount,
    blocks: seededBlocksCount,
  };
}
