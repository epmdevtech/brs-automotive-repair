import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ETAPAS_OPERACIONAIS,
  ETAPA_CONFIG_MAP,
  normalizarPapel,
  rotuloPapel,
  LIMITE_SEM_ATUALIZACAO_MIN,
  type Papel,
  type EtapaId,
} from "../features/booking/config/etapas.config";
import {
  estadoEtapas,
  etapaAtual,
  progresso,
  situacao,
  podeExecutar,
  podeDesfazer,
  podeReverter,
  podePedirAtualizacao,
  formatarTimestampEtapa,
  formatarConclusaoEtapa,
  formatarTempoRelativo,
  concluirEtapa,
  desfazerUltimaAcao,
  reverterEtapa,
  pedirAtualizacao,
  getEtapaEventsForAppointment,
  writeAllEtapaEvents,
  type EventoEtapa,
} from "../features/booking/domain/etapas";
import { TimelineOperacional } from "../features/booking/ui/admin/timeline-operacional";
import type { Appointment } from "../features/booking/domain/types";

describe("SPEC-057: Matriz de Permissões RBAC (Papel × Etapa × Ação)", () => {
  it("normaliza strings variadas de papéis para o enum seguro ('admin' | 'tecnico' | 'atendimento')", () => {
    expect(normalizarPapel("Administrador / Oficina")).toBe("admin");
    expect(normalizarPapel("admin")).toBe("admin");
    expect(normalizarPapel("Técnico Funilaria")).toBe("tecnico");
    expect(normalizarPapel("tecnico")).toBe("tecnico");
    expect(normalizarPapel("Atendimento")).toBe("atendimento");
    expect(normalizarPapel("Recepção")).toBe("atendimento");
    expect(normalizarPapel(undefined)).toBe("atendimento");
    expect(normalizarPapel("desconhecido")).toBe("atendimento");
  });

  it("rotula papéis em português claro e legível", () => {
    expect(rotuloPapel("admin")).toBe("Administrador");
    expect(rotuloPapel("tecnico")).toBe("Técnico avaliador");
    expect(rotuloPapel("atendimento")).toBe("Recepção / Atendimento");
  });

  describe("Papel: Técnico", () => {
    const papel: Papel = "tecnico";

    it("NÃO pode concluir etapa 1 (Cadastro e agendamento confirmado)", () => {
      expect(podeExecutar(papel, "agendamento_confirmado").pode).toBe(false);
    });

    it("pode concluir etapa 2 (Veículo recebido na oficina)", () => {
      // Cria evento da etapa 1 para que a etapa 2 esteja como 'atual'
      const eventos: EventoEtapa[] = [
        {
          id: "ev1",
          agendamentoId: "app-t1",
          etapa: "agendamento_confirmado",
          tipo: "concluida",
          porNome: "Sistema",
          papel: "admin",
          em: new Date().toISOString(),
        },
      ];
      expect(podeExecutar(papel, "veiculo_recebido", undefined, eventos).pode).toBe(true);
    });

    it("pode concluir etapa 3 (Vistoria técnica e diagnóstico)", () => {
      const eventos: EventoEtapa[] = [
        {
          id: "ev1",
          agendamentoId: "app-t1",
          etapa: "agendamento_confirmado",
          tipo: "concluida",
          porNome: "Sistema",
          papel: "admin",
          em: new Date().toISOString(),
        },
        {
          id: "ev2",
          agendamentoId: "app-t1",
          etapa: "veiculo_recebido",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
      ];
      expect(podeExecutar(papel, "vistoria_diagnostico", undefined, eventos).pode).toBe(true);
    });

    it("NÃO pode concluir etapa 4 (Aprovação do orçamento - restrito a atendimento/admin)", () => {
      const eventos: EventoEtapa[] = [
        {
          id: "ev1",
          agendamentoId: "app-t1",
          etapa: "agendamento_confirmado",
          tipo: "concluida",
          porNome: "Sistema",
          papel: "admin",
          em: new Date().toISOString(),
        },
        {
          id: "ev2",
          agendamentoId: "app-t1",
          etapa: "veiculo_recebido",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
        {
          id: "ev3",
          agendamentoId: "app-t1",
          etapa: "vistoria_diagnostico",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
      ];
      expect(podeExecutar(papel, "aprovacao_orcamento", undefined, eventos).pode).toBe(false);
    });

    it("pode concluir etapa 5 (Execução: desamassamento PDR)", () => {
      const eventos: EventoEtapa[] = [
        {
          id: "ev1",
          agendamentoId: "app-t1",
          etapa: "agendamento_confirmado",
          tipo: "concluida",
          porNome: "Sistema",
          papel: "admin",
          em: new Date().toISOString(),
        },
        {
          id: "ev2",
          agendamentoId: "app-t1",
          etapa: "veiculo_recebido",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
        {
          id: "ev3",
          agendamentoId: "app-t1",
          etapa: "vistoria_diagnostico",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
        {
          id: "ev4",
          agendamentoId: "app-t1",
          etapa: "aprovacao_orcamento",
          tipo: "concluida",
          porNome: "Carla",
          papel: "atendimento",
          em: new Date().toISOString(),
        },
      ];
      expect(podeExecutar(papel, "execucao_pdr", undefined, eventos).pode).toBe(true);
    });

    it("etapa 6: pode aprovar qualidade (6a), mas NÃO pode registrar entrega (6b)", () => {
      const eventos: EventoEtapa[] = [
        {
          id: "e1",
          agendamentoId: "app-t1",
          etapa: "agendamento_confirmado",
          tipo: "concluida",
          porNome: "Sistema",
          papel: "admin",
          em: new Date().toISOString(),
        },
        {
          id: "e2",
          agendamentoId: "app-t1",
          etapa: "veiculo_recebido",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
        {
          id: "e3",
          agendamentoId: "app-t1",
          etapa: "vistoria_diagnostico",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
        {
          id: "e4",
          agendamentoId: "app-t1",
          etapa: "aprovacao_orcamento",
          tipo: "concluida",
          porNome: "Carla",
          papel: "atendimento",
          em: new Date().toISOString(),
        },
        {
          id: "e5",
          agendamentoId: "app-t1",
          etapa: "execucao_pdr",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
      ];
      // 6a: técnico pode
      expect(podeExecutar(papel, "qualidade_entrega", "aprovar_qualidade", eventos).pode).toBe(
        true,
      );

      // Com 6a já aprovado, 6b: técnico NÃO pode (restrito a atendimento/admin)
      const eventosCom6a: EventoEtapa[] = [
        ...eventos,
        {
          id: "e6a",
          agendamentoId: "app-t1",
          etapa: "qualidade_entrega",
          acao: "aprovar_qualidade",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
      ];
      expect(podeExecutar(papel, "qualidade_entrega", "registrar_entrega", eventosCom6a).pode).toBe(
        false,
      );
    });

    it("NUNCA pode reverter etapas para evitar que técnicos desfaçam fluxos auditados", () => {
      expect(podeReverter(papel).pode).toBe(false);
    });
  });

  describe("Papel: Recepção / Atendimento", () => {
    const papel: Papel = "atendimento";

    it("pode concluir etapa 1 (Cadastro e agendamento confirmado)", () => {
      expect(podeExecutar(papel, "agendamento_confirmado").pode).toBe(true);
    });

    it("pode concluir etapa 2 (Veículo recebido na oficina)", () => {
      const eventos: EventoEtapa[] = [
        {
          id: "ev1",
          agendamentoId: "app-t2",
          etapa: "agendamento_confirmado",
          tipo: "concluida",
          porNome: "Sistema",
          papel: "admin",
          em: new Date().toISOString(),
        },
      ];
      expect(podeExecutar(papel, "veiculo_recebido", undefined, eventos).pode).toBe(true);
    });

    it("NÃO pode concluir etapa 3 (Vistoria técnica - exclusiva de técnicos/admin)", () => {
      const eventos: EventoEtapa[] = [
        {
          id: "ev1",
          agendamentoId: "app-t2",
          etapa: "agendamento_confirmado",
          tipo: "concluida",
          porNome: "Sistema",
          papel: "admin",
          em: new Date().toISOString(),
        },
        {
          id: "ev2",
          agendamentoId: "app-t2",
          etapa: "veiculo_recebido",
          tipo: "concluida",
          porNome: "Carla",
          papel: "atendimento",
          em: new Date().toISOString(),
        },
      ];
      expect(podeExecutar(papel, "vistoria_diagnostico", undefined, eventos).pode).toBe(false);
    });

    it("pode concluir etapa 4 (Aprovação do orçamento)", () => {
      const eventos: EventoEtapa[] = [
        {
          id: "ev1",
          agendamentoId: "app-t2",
          etapa: "agendamento_confirmado",
          tipo: "concluida",
          porNome: "Sistema",
          papel: "admin",
          em: new Date().toISOString(),
        },
        {
          id: "ev2",
          agendamentoId: "app-t2",
          etapa: "veiculo_recebido",
          tipo: "concluida",
          porNome: "Carla",
          papel: "atendimento",
          em: new Date().toISOString(),
        },
        {
          id: "ev3",
          agendamentoId: "app-t2",
          etapa: "vistoria_diagnostico",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
      ];
      expect(podeExecutar(papel, "aprovacao_orcamento", undefined, eventos).pode).toBe(true);
    });

    it("NÃO pode concluir etapa 5 (Execução técnica PDR)", () => {
      const eventos: EventoEtapa[] = [
        {
          id: "ev1",
          agendamentoId: "app-t2",
          etapa: "agendamento_confirmado",
          tipo: "concluida",
          porNome: "Sistema",
          papel: "admin",
          em: new Date().toISOString(),
        },
        {
          id: "ev2",
          agendamentoId: "app-t2",
          etapa: "veiculo_recebido",
          tipo: "concluida",
          porNome: "Carla",
          papel: "atendimento",
          em: new Date().toISOString(),
        },
        {
          id: "ev3",
          agendamentoId: "app-t2",
          etapa: "vistoria_diagnostico",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
        {
          id: "ev4",
          agendamentoId: "app-t2",
          etapa: "aprovacao_orcamento",
          tipo: "concluida",
          porNome: "Carla",
          papel: "atendimento",
          em: new Date().toISOString(),
        },
      ];
      expect(podeExecutar(papel, "execucao_pdr", undefined, eventos).pode).toBe(false);
    });

    it("etapa 6: NÃO pode aprovar qualidade (6a), mas pode registrar entrega (6b)", () => {
      const eventosCom6a: EventoEtapa[] = [
        {
          id: "e1",
          agendamentoId: "app-t2",
          etapa: "agendamento_confirmado",
          tipo: "concluida",
          porNome: "Sistema",
          papel: "admin",
          em: new Date().toISOString(),
        },
        {
          id: "e2",
          agendamentoId: "app-t2",
          etapa: "veiculo_recebido",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
        {
          id: "e3",
          agendamentoId: "app-t2",
          etapa: "vistoria_diagnostico",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
        {
          id: "e4",
          agendamentoId: "app-t2",
          etapa: "aprovacao_orcamento",
          tipo: "concluida",
          porNome: "Carla",
          papel: "atendimento",
          em: new Date().toISOString(),
        },
        {
          id: "e5",
          agendamentoId: "app-t2",
          etapa: "execucao_pdr",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
        {
          id: "e6a",
          agendamentoId: "app-t2",
          etapa: "qualidade_entrega",
          acao: "aprovar_qualidade",
          tipo: "concluida",
          porNome: "Bruno",
          papel: "tecnico",
          em: new Date().toISOString(),
        },
      ];
      expect(podeExecutar(papel, "qualidade_entrega", "aprovar_qualidade", eventosCom6a).pode).toBe(
        false,
      );
      expect(podeExecutar(papel, "qualidade_entrega", "registrar_entrega", eventosCom6a).pode).toBe(
        true,
      );
    });

    it("pode reverter etapas com justificativa auditada quando houver etapa concluída", () => {
      const eventos: EventoEtapa[] = [
        {
          id: "e1",
          agendamentoId: "app-t2",
          etapa: "agendamento_confirmado",
          tipo: "concluida",
          porNome: "Sistema",
          papel: "admin",
          em: new Date().toISOString(),
        },
        {
          id: "e2",
          agendamentoId: "app-t2",
          etapa: "veiculo_recebido",
          tipo: "concluida",
          porNome: "Carla",
          papel: "atendimento",
          em: new Date().toISOString(),
        },
      ];
      expect(podeReverter(papel, eventos).pode).toBe(true);
    });
  });

  describe("Papel: Administrador", () => {
    const papel: Papel = "admin";

    it("pode concluir qualquer etapa e ação", () => {
      expect(podeExecutar(papel, "agendamento_confirmado").pode).toBe(true);
    });

    it("pode reverter qualquer etapa", () => {
      const eventos: EventoEtapa[] = [
        {
          id: "e1",
          agendamentoId: "app-t3",
          etapa: "agendamento_confirmado",
          tipo: "concluida",
          porNome: "Sistema",
          papel: "admin",
          em: new Date().toISOString(),
        },
      ];
      expect(podeReverter(papel, eventos).pode).toBe(true);
    });
  });
});

describe("SPEC-057: Derivações Puras (estadoEtapas, etapaAtual, progresso, situacao)", () => {
  const agora = new Date();

  const criarEvento = (
    id: string,
    etapa: EtapaId,
    tipo: EventoEtapa["tipo"],
    minutosAtras: number,
    papel: Papel = "admin",
    autor = "Admin",
    subAcao?: EventoEtapa["acao"],
  ): EventoEtapa => ({
    id,
    agendamentoId: "app-deriva-1",
    etapa,
    tipo,
    acao: subAcao,
    porUsuarioId: "usr-1",
    porNome: autor,
    papel,
    em: new Date(agora.getTime() - minutosAtras * 60 * 1000).toISOString(),
  });

  it("calcula corretamente estado de etapas, etapa atual e progresso em fluxo inicial", () => {
    const eventos: EventoEtapa[] = [
      criarEvento("evt-1", "agendamento_confirmado", "concluida", 60),
    ];

    const estados = estadoEtapas(eventos);
    expect(estados[0].estado).toBe("concluida");
    expect(estados[1].estado).toBe("atual");

    expect(etapaAtual(eventos)).toBe(2);
    // 1 de 6 concluída ≈ 17%
    const prog = progresso(eventos);
    expect(prog.porcentagem).toBe(17);
    expect(prog.concluidas).toBe(1);
    expect(prog.atual).toBe(2);
  });

  it("calcula progresso de 100% quando todas as etapas são concluídas", () => {
    const eventos: EventoEtapa[] = [
      criarEvento("e1", "agendamento_confirmado", "concluida", 120),
      criarEvento("e2", "veiculo_recebido", "concluida", 100),
      criarEvento("e3", "vistoria_diagnostico", "concluida", 80),
      criarEvento("e4", "aprovacao_orcamento", "concluida", 60),
      criarEvento("e5", "execucao_pdr", "concluida", 40),
      criarEvento(
        "e6a",
        "qualidade_entrega",
        "concluida",
        20,
        "tecnico",
        "Bruno",
        "aprovar_qualidade",
      ),
      criarEvento(
        "e6b",
        "qualidade_entrega",
        "concluida",
        5,
        "atendimento",
        "Carla",
        "registrar_entrega",
      ),
    ];

    const prog = progresso(eventos);
    expect(prog.porcentagem).toBe(100);
    expect(prog.concluidas).toBe(6);
    expect(situacao(eventos)).toBe("concluido");
  });

  it("detecta alerta de inatividade quando a etapa atual do tipo 'atividade' está sem atualização há > 120 min", () => {
    const eventos: EventoEtapa[] = [
      criarEvento("e1", "agendamento_confirmado", "concluida", 200),
      criarEvento("e2", "veiculo_recebido", "concluida", 150), // 150 minutos sem novidades na etapa 3
    ];

    const estados = estadoEtapas(eventos);
    const etapa3 = estados.find((e) => e.etapaId === "vistoria_diagnostico");
    expect(etapa3?.estado).toBe("atual");
    expect(etapa3?.precisaAlertaInatividade).toBe(true);
    expect(etapa3?.tempoInativoMinutos).toBeGreaterThanOrEqual(150);
  });

  it("não dispara alerta de inatividade se a última atualização tem < 120 min", () => {
    const eventos: EventoEtapa[] = [
      criarEvento("e1", "agendamento_confirmado", "concluida", 60),
      criarEvento("e2", "veiculo_recebido", "concluida", 30),
    ];

    const estados = estadoEtapas(eventos);
    const etapa3 = estados.find((e) => e.etapaId === "vistoria_diagnostico");
    expect(etapa3?.precisaAlertaInatividade).toBe(false);
  });
});

describe("SPEC-057: Formatadores Seguros de Data e Hora (Sem Fragmentos Órfãos)", () => {
  it("formatarTimestampEtapa trata datas com clareza", () => {
    const outroAno = new Date("2024-05-10T14:30:00Z");
    const strOutroAno = formatarTimestampEtapa(outroAno.toISOString());
    expect(strOutroAno).toContain("2024");

    expect(formatarTimestampEtapa("data-invalida")).toBe("");
    expect(formatarTimestampEtapa(undefined)).toBe("");
  });

  it("formatarConclusaoEtapa une horário e autor sem partículas soltas 'às' ou 'por'", () => {
    const hoje = new Date();
    const formatadoCompleto = formatarConclusaoEtapa(hoje.toISOString(), "Bruno Silva");
    expect(formatadoCompleto.textoVisual).toMatch(/^Concluído · \d{2}:\d{2} · por Bruno Silva$/);
    expect(formatadoCompleto.textoVisual).not.toContain(" às ");

    const formatadoSemAutor = formatarConclusaoEtapa(hoje.toISOString(), undefined);
    expect(formatadoSemAutor.textoVisual).toMatch(/^Concluído · \d{2}:\d{2}$/);
    expect(formatadoSemAutor.textoVisual).not.toContain(" por ");

    const formatadoSemData = formatarConclusaoEtapa(undefined, "Bruno Silva");
    expect(formatadoSemData.textoVisual).toBe("Concluído · por Bruno Silva");

    const formatadoVazio = formatarConclusaoEtapa(undefined, undefined);
    expect(formatadoVazio.textoVisual).toBe("Concluído");
  });

  it("formatarTempoRelativo expressa intervalos em minutos e horas", () => {
    const agora = Date.now();
    expect(formatarTempoRelativo(new Date(agora).toISOString())).toBe("agora mesmo");
    expect(formatarTempoRelativo(new Date(agora - 5 * 60 * 1000).toISOString())).toBe("há 5 min");
    expect(formatarTempoRelativo(new Date(agora - 65 * 60 * 1000).toISOString())).toBe("há 1 h");
    expect(formatarTempoRelativo(new Date(agora - 120 * 60 * 1000).toISOString())).toBe("há 2 h");
  });
});

describe("SPEC-057: Mutações com Idempotência, Pré-condições e Auditoria", () => {
  const agendamentoId = "app-mutacoes-test";

  beforeEach(() => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("concluirEtapa avança com sucesso quando etapaEsperada coincide", () => {
    const eventosIniciais: EventoEtapa[] = [
      {
        id: "ev1",
        agendamentoId,
        etapa: "agendamento_confirmado",
        tipo: "concluida",
        porNome: "Sistema",
        papel: "admin",
        em: new Date(Date.now() - 3600_000).toISOString(),
      },
    ];
    writeAllEtapaEvents(eventosIniciais);

    const resultado = concluirEtapa({
      agendamentoId,
      etapa: "veiculo_recebido",
      etapaEsperada: "veiculo_recebido",
      autorId: "usr-tech",
      autorNome: "Bruno Técnico",
      papel: "tecnico",
    });

    expect(resultado.sucesso).toBe(true);

    const eventosAtuais = getEtapaEventsForAppointment(agendamentoId);
    expect(eventosAtuais.length).toBe(2);
    expect(eventosAtuais[1].etapa).toBe("veiculo_recebido");
    expect(eventosAtuais[1].porNome).toBe("Bruno Técnico");
  });

  it("concluirEtapa rejeita avanço se a etapaEsperada divergir (concorrência entre abas)", () => {
    const eventosIniciais: EventoEtapa[] = [
      {
        id: "ev1",
        agendamentoId,
        etapa: "agendamento_confirmado",
        tipo: "concluida",
        porNome: "Sistema",
        papel: "admin",
        em: new Date().toISOString(),
      },
    ];
    writeAllEtapaEvents(eventosIniciais);

    // Tentativa de concluir etapa 3 quando a atual real é etapa 2
    const resultado = concluirEtapa({
      agendamentoId,
      etapa: "vistoria_diagnostico",
      etapaEsperada: "vistoria_diagnostico", // Mas a atual no banco ainda é veiculo_recebido!
      autorId: "usr-tech",
      autorNome: "Bruno Técnico",
      papel: "tecnico",
    });

    expect(resultado.sucesso).toBe(false);
    expect(resultado.erro).toContain("já foi atualizada");
  });

  it("concluirEtapa é idempotente para duplo clique imediato (< 2s)", () => {
    const eventosIniciais: EventoEtapa[] = [
      {
        id: "ev1",
        agendamentoId,
        etapa: "agendamento_confirmado",
        tipo: "concluida",
        porNome: "Sistema",
        papel: "admin",
        em: new Date().toISOString(),
      },
    ];
    writeAllEtapaEvents(eventosIniciais);

    const res1 = concluirEtapa({
      agendamentoId,
      etapa: "veiculo_recebido",
      etapaEsperada: "veiculo_recebido",
      autorId: "usr-tech",
      autorNome: "Bruno Técnico",
      papel: "tecnico",
    });
    expect(res1.sucesso).toBe(true);

    // Segundo clique idêntico imediato
    const res2 = concluirEtapa({
      agendamentoId,
      etapa: "veiculo_recebido",
      etapaEsperada: "veiculo_recebido",
      autorId: "usr-tech",
      autorNome: "Bruno Técnico",
      papel: "tecnico",
    });
    // Não duplica no storage
    expect(res2.sucesso).toBe(true);
    expect(getEtapaEventsForAppointment(agendamentoId).length).toBe(2);
  });

  it("desfazerUltimaAcao funciona dentro da janela de 10s e falha após 10s", () => {
    const agora = Date.now();
    const eventosDentroJanela: EventoEtapa[] = [
      {
        id: "ev1",
        agendamentoId,
        etapa: "agendamento_confirmado",
        tipo: "concluida",
        porNome: "Sistema",
        papel: "admin",
        em: new Date(agora - 60_000).toISOString(),
      },
      {
        id: "ev2",
        agendamentoId,
        etapa: "veiculo_recebido",
        tipo: "concluida",
        porUsuarioId: "usr-tech",
        porNome: "Bruno",
        papel: "tecnico",
        em: new Date(agora - 2_000).toISOString(), // 2 segundos atrás
      },
    ];
    writeAllEtapaEvents(eventosDentroJanela);

    // Pode desfazer por ser o mesmo usuário e dentro de 10s
    expect(podeDesfazer(eventosDentroJanela, "usr-tech", "tecnico").pode).toBe(true);

    const resDesfazer = desfazerUltimaAcao(agendamentoId, "usr-tech", "Bruno", "tecnico");
    expect(resDesfazer.sucesso).toBe(true);

    // Agora testamos com evento ocorrido há 15 segundos
    const eventosExpirados: EventoEtapa[] = [
      {
        id: "ev1",
        agendamentoId,
        etapa: "agendamento_confirmado",
        tipo: "concluida",
        porNome: "Sistema",
        papel: "admin",
        em: new Date(agora - 60_000).toISOString(),
      },
      {
        id: "ev3",
        agendamentoId,
        etapa: "veiculo_recebido",
        tipo: "concluida",
        porUsuarioId: "usr-tech",
        porNome: "Bruno",
        papel: "tecnico",
        em: new Date(agora - 15_000).toISOString(), // 15 segundos atrás (>10s)
      },
    ];
    writeAllEtapaEvents(eventosExpirados);

    expect(podeDesfazer(eventosExpirados, "usr-tech", "tecnico").pode).toBe(false);
    const resFalha = desfazerUltimaAcao(agendamentoId, "usr-tech", "Bruno", "tecnico");
    expect(resFalha.sucesso).toBe(false);
  });

  it("reverterEtapa exige justificativa com no mínimo 10 caracteres e bloqueia técnicos", () => {
    const eventos: EventoEtapa[] = [
      {
        id: "ev1",
        agendamentoId,
        etapa: "agendamento_confirmado",
        tipo: "concluida",
        porNome: "Sistema",
        papel: "admin",
        em: new Date().toISOString(),
      },
      {
        id: "ev2",
        agendamentoId,
        etapa: "veiculo_recebido",
        tipo: "concluida",
        porUsuarioId: "usr-tech",
        porNome: "Bruno",
        papel: "admin",
        em: new Date().toISOString(),
      },
    ];
    writeAllEtapaEvents(eventos);

    // Justificativa curta (<10 chars) deve falhar
    const resCurta = reverterEtapa({
      agendamentoId,
      etapa: "veiculo_recebido",
      justificativa: "Curta",
      autorId: "admin-1",
      autorNome: "Admin",
      papel: "admin",
    });
    expect(resCurta.sucesso).toBe(false);
    expect(resCurta.erro).toContain("mínimo 10 caracteres");

    // Técnico não pode reverter
    const resTecnico = reverterEtapa({
      agendamentoId,
      etapa: "veiculo_recebido",
      justificativa: "Justificativa longa e detalhada da correção",
      autorId: "tech-1",
      autorNome: "Técnico",
      papel: "tecnico",
    });
    expect(resTecnico.sucesso).toBe(false);
    expect(resTecnico.erro).toContain("não possuem permissão");

    // Atendimento com justificativa válida reverte com sucesso
    const resSucesso = reverterEtapa({
      agendamentoId,
      etapa: "veiculo_recebido",
      justificativa: "Veículo levado para lavagem antes da vistoria correta",
      autorId: "atend-1",
      autorNome: "Carla Atendimento",
      papel: "atendimento",
    });
    expect(resSucesso.sucesso).toBe(true);

    const eventosAposReversao = getEtapaEventsForAppointment(agendamentoId);
    const ultimo = eventosAposReversao[eventosAposReversao.length - 1];
    expect(ultimo.tipo).toBe("revertida");
    expect(ultimo.justificativa).toBe("Veículo levado para lavagem antes da vistoria correta");
  });

  it("pedirAtualizacao respeita o cooldown de 15 minutos", () => {
    const agora = Date.now();
    const eventos: EventoEtapa[] = [
      {
        id: "ev1",
        agendamentoId,
        etapa: "agendamento_confirmado",
        tipo: "concluida",
        porNome: "Sistema",
        papel: "admin",
        em: new Date(agora - 3600_000).toISOString(),
      },
      {
        id: "ev2",
        agendamentoId,
        etapa: "veiculo_recebido",
        tipo: "concluida",
        porNome: "Bruno",
        papel: "tecnico",
        em: new Date(agora - 1800_000).toISOString(),
      },
    ];
    writeAllEtapaEvents(eventos);

    // Primeiro pedido tem sucesso (etapa 3 é atividade e está atual)
    expect(podePedirAtualizacao("atendimento", eventos).pode).toBe(true);
    const res1 = pedirAtualizacao({
      agendamentoId,
      autorId: "atend-1",
      autorNome: "Carla",
      papel: "atendimento",
    });
    expect(res1.sucesso).toBe(true);

    // Pedido imediato em seguida falha por cooldown
    const eventosComPedido = getEtapaEventsForAppointment(agendamentoId);
    expect(podePedirAtualizacao("atendimento", eventosComPedido).pode).toBe(false);

    const res2 = pedirAtualizacao({
      agendamentoId,
      autorId: "atend-1",
      autorNome: "Carla",
      papel: "atendimento",
    });
    expect(res2.sucesso).toBe(false);
    expect(res2.erro).toContain("Aguarde");
  });
});

describe("SPEC-057: Componente UI TimelineOperacional (WCAG 2.2 AA & Stepper)", () => {
  const mockApp: Appointment = {
    id: "app-ui-timeline-test",
    protocol: "#BRS-9090",
    serviceId: "avaliacao-funilaria",
    professionalId: "bruno-tecnico",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    status: "CONFIRMED",
    customer: {
      name: "Fernanda Costa",
      phone: "+5545999887766",
      consentLgpd: true,
    },
    intake: {
      vehicle: { make: "Toyota", model: "Corolla", plate: "BRA-2E19" },
      affectedAreas: ["porta-traseira-direita"],
      damageType: "colisao-com-vinco",
    },
    logistics: { type: "presencial" },
    createdAt: new Date(Date.now() - 7200 * 1000).toISOString(),
    idempotencyKey: "idem-ui-9090",
  };

  beforeEach(() => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("renderiza cabeçalho operacional com contagem de etapas e barra de progresso", () => {
    render(
      <TimelineOperacional
        agendamentoId={mockApp.id}
        clienteNome={mockApp.customer.name}
        agendamentoCreatedAt={mockApp.createdAt}
        usuarioPapelCustom="admin"
      />,
    );

    expect(screen.getByText(/Linha do tempo operacional/i)).toBeInTheDocument();
    // Pelo menos 1 concluída (Agendamento confirmado gerado na inicialização)
    expect(screen.getByText(/Etapa 2 de 6 · 1 concluída/i)).toBeInTheDocument();
  });

  it("renderiza todas as 6 etapas no stepper com títulos em sentence case", () => {
    render(
      <TimelineOperacional
        agendamentoId={mockApp.id}
        clienteNome={mockApp.customer.name}
        agendamentoCreatedAt={mockApp.createdAt}
        usuarioPapelCustom="admin"
      />,
    );

    expect(screen.getAllByText(/Cadastro e agendamento confirmado/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Veículo recebido na oficina/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Vistoria técnica e diagnóstico/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Aprovação do orçamento/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Execução: desamassamento PDR/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Controle de qualidade e entrega/i)[0]).toBeInTheDocument();
  });

  it("habilita botão de avanço para técnico na etapa 2 (Veículo recebido na oficina)", () => {
    render(
      <TimelineOperacional
        agendamentoId={mockApp.id}
        clienteNome={mockApp.customer.name}
        agendamentoCreatedAt={mockApp.createdAt}
        usuarioPapelCustom="tecnico"
      />,
    );

    const btnAvancar = screen.getByRole("button", {
      name: /Concluir etapa 2/i,
    });
    expect(btnAvancar).toBeInTheDocument();
    expect(btnAvancar).not.toBeDisabled();
  });

  it("bloqueia avanço da etapa 4 para técnico e exibe mensagem de autoridade necessária", () => {
    // Configura eventos até a etapa 4 (Aprovação do orçamento)
    const eventos: EventoEtapa[] = [
      {
        id: "e1",
        agendamentoId: mockApp.id,
        etapa: "agendamento_confirmado",
        tipo: "concluida",
        porNome: "Sistema",
        papel: "admin",
        em: new Date(Date.now() - 3000_000).toISOString(),
      },
      {
        id: "e2",
        agendamentoId: mockApp.id,
        etapa: "veiculo_recebido",
        tipo: "concluida",
        porUsuarioId: "tech-1",
        porNome: "Bruno",
        papel: "tecnico",
        em: new Date(Date.now() - 2000_000).toISOString(),
      },
      {
        id: "e3",
        agendamentoId: mockApp.id,
        etapa: "vistoria_diagnostico",
        tipo: "concluida",
        porUsuarioId: "tech-1",
        porNome: "Bruno",
        papel: "tecnico",
        em: new Date(Date.now() - 1000_000).toISOString(),
      },
    ];
    writeAllEtapaEvents(eventos);

    render(
      <TimelineOperacional
        agendamentoId={mockApp.id}
        clienteNome={mockApp.customer.name}
        agendamentoCreatedAt={mockApp.createdAt}
        usuarioPapelCustom="tecnico"
      />,
    );

    // O botão principal de conclusão da etapa 4 não deve estar habilitado para técnico
    expect(screen.queryByRole("button", { name: /Concluir etapa 4/i })).not.toBeInTheDocument();
    expect(screen.getByText(/Aguardando:/i)).toBeInTheDocument();
    expect(screen.getByText(/Recepção \/ Atendimento ou Administrador/i)).toBeInTheDocument();
  });
});
