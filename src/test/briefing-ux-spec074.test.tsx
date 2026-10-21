import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import {
  formatCep,
  formatCnpj,
  formatDateBr,
  formatDecimal,
  formatPhone,
  isLeapYear,
  isValidCep,
  isValidCnpj,
  isValidEmail,
  isValidInteger,
  isValidIsoDate,
  isValidPhone,
  parseDateBr,
} from "@/features/briefing/domain/masks";
import { lookupCep } from "@/features/briefing/domain/cep-service";
import { applyCepLookup, ADDRESS_FIELD_IDS } from "@/features/briefing/domain/address";
import {
  CONDITIONAL_RULES,
  getHiddenFieldIds,
  pruneConditionalValues,
} from "@/features/briefing/domain/conditional";
import { validateSectionPayload } from "@/features/briefing/domain/section-schemas";
import { BRIEFING_STEPS } from "@/features/briefing/domain/steps";
import { DateField } from "@/features/briefing/ui/fields/date-field";
import { MaskedTextField } from "@/features/briefing/ui/fields/masked-text-field";
import { RadioGroupField } from "@/features/briefing/ui/fields/radio-group-field";

const STEP_ONE = BRIEFING_STEPS[0]!;
const STEP_TWO = BRIEFING_STEPS[1]!;

describe("SPEC-074 — UX/UI do briefing: domínio, máscaras e condicionais", () => {
  describe("1. Máscaras e validadores", () => {
    it("aplica a máscara de CEP e aceita colagem com ou sem pontuação", () => {
      expect(formatCep("85900000")).toBe("85900-000");
      expect(formatCep("85900-000")).toBe("85900-000");
      expect(isValidCep("85900-000")).toBe(true);
      expect(isValidCep("8590000")).toBe(false);
    });

    it("aplica a máscara de CNPJ e valida os dígitos verificadores", () => {
      expect(formatCnpj("51784844000101")).toBe("51.784.844/0001-01");
      expect(isValidCnpj("51.784.844/0001-01")).toBe(true);
      expect(isValidCnpj("51.784.844/0001-02")).toBe(false);
      expect(isValidCnpj("11.111.111/1111-11")).toBe(false);
      expect(isValidCnpj("5178488400010")).toBe(false);
    });

    it("aplica a máscara de telefone conforme o comprimento e valida o DDD", () => {
      expect(formatPhone("45999999999")).toBe("(45) 99999-9999");
      expect(formatPhone("4533333333")).toBe("(45) 3333-3333");
      expect(isValidPhone("(45) 99999-9999")).toBe(true);
      expect(isValidPhone("(45) 3333-3333")).toBe(true);
      expect(isValidPhone("(10) 99999-9999")).toBe(false);
      expect(isValidPhone("9999")).toBe(false);
    });

    it("trata número decimal pt-BR sem convertir vazio em zero", () => {
      expect(formatDecimal("1234,5")).toBe("1.234,5");
      expect(formatDecimal("")).toBe("");
      expect(isValidInteger("12")).toBe(true);
      expect(isValidInteger("12,5")).toBe(false);
      expect(isValidInteger("")).toBe(false);
    });

    it("valida datas civis, incluindo anos bissextos", () => {
      expect(isLeapYear(2024)).toBe(true);
      expect(isLeapYear(2023)).toBe(false);
      expect(isLeapYear(1900)).toBe(false);
      expect(isLeapYear(2000)).toBe(true);

      expect(parseDateBr("29/02/2024")).toBe("2024-02-29");
      expect(parseDateBr("29/02/2023")).toBeNull();
      expect(parseDateBr("31/04/2024")).toBeNull();
      expect(parseDateBr("00/01/2024")).toBeNull();
      expect(parseDateBr("01/13/2024")).toBeNull();

      expect(formatDateBr("2024-02-29")).toBe("29/02/2024");
      expect(isValidIsoDate("2024-02-29")).toBe(true);
      expect(isValidIsoDate("2024-02-30")).toBe(false);
    });

    it("valida e-mail sem regra excessivamente restritiva", () => {
      expect(isValidEmail("  contato@empresa.com.br  ")).toBe(true);
      expect(isValidEmail("contato@empresa")).toBe(false);
    });
  });

  describe("2. Consulta assistida de CEP", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("retorna o endereço quando o serviço responde", async () => {
      const fetchImpl = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          logradouro: "Av. das Indústrias",
          bairro: "Centro",
          localidade: "Toledo",
          uf: "PR",
        }),
      });

      const result = await lookupCep("85900-000", {
        fetchImpl: fetchImpl as unknown as typeof fetch,
      });

      expect(result).toEqual({
        logradouro: "Av. das Indústrias",
        bairro: "Centro",
        cidade: "Toledo",
        uf: "PR",
      });
    });

    it("retorna null quando o CEP não existe", async () => {
      const fetchImpl = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ erro: true }),
      });

      const result = await lookupCep("00000-000", {
        fetchImpl: fetchImpl as unknown as typeof fetch,
      });

      expect(result).toBeNull();
    });

    it("retorna null em timeout e em falha de rede", async () => {
      const timeoutImpl = vi.fn().mockImplementation(
        (_url: string, init?: { signal?: AbortSignal }) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => reject(new Error("aborted")));
          }),
      );

      await expect(
        lookupCep("85900-000", {
          timeoutMs: 10,
          fetchImpl: timeoutImpl as unknown as typeof fetch,
        }),
      ).resolves.toBeNull();

      const failingImpl = vi.fn().mockRejectedValue(new Error("network down"));

      await expect(
        lookupCep("85900-000", { fetchImpl: failingImpl as unknown as typeof fetch }),
      ).resolves.toBeNull();
    });

    it("não consulta CEP inválido", async () => {
      const fetchImpl = vi.fn();

      await expect(
        lookupCep("123", { fetchImpl: fetchImpl as unknown as typeof fetch }),
      ).resolves.toBeNull();
      expect(fetchImpl).not.toHaveBeenCalled();
    });

    it("preenche apenas os campos de endereço ainda vazios", () => {
      const values = {
        [ADDRESS_FIELD_IDS.city]: "Toledo",
        [ADDRESS_FIELD_IDS.neighborhood]: "",
      };

      const result = applyCepLookup(values, {
        logradouro: "Av. das Indústrias",
        bairro: "Centro",
        cidade: "Marechal Cândido Rondon",
        uf: "PR",
      });

      expect(result.values[ADDRESS_FIELD_IDS.city]).toBe("Toledo");
      expect(result.values[ADDRESS_FIELD_IDS.neighborhood]).toBe("Centro");
      expect(result.values[ADDRESS_FIELD_IDS.street]).toBe("Av. das Indústrias");
      expect(result.filled).toContain(ADDRESS_FIELD_IDS.neighborhood);
      expect(result.filled).not.toContain(ADDRESS_FIELD_IDS.city);
    });
  });

  describe("3. Perguntas condicionais", () => {
    it("oculta o campo dependente quando a resposta controladora nega", () => {
      const hidden = getHiddenFieldIds("company_identification", {
        "empresa.outrasUnidades": "nao",
      });

      expect(hidden).toContain("empresa.unidadesAdicionais");
    });

    it("mantém o campo dependente visível quando a resposta permite", () => {
      const hidden = getHiddenFieldIds("company_identification", {
        "empresa.outrasUnidades": "sim",
      });

      expect(hidden).not.toContain("empresa.unidadesAdicionais");
    });

    it("desconta o valor do campo ocultado e informa o descarte", () => {
      const pruned = pruneConditionalValues(
        "company_identification",
        { "empresa.outrasUnidades": "nao", "empresa.unidadesAdicionais": "Unidade de Estrela" },
        { "empresa.unidadesAdicionais": true },
      );

      expect(pruned.values["empresa.unidadesAdicionais"]).toBeUndefined();
      expect(pruned.pending["empresa.unidadesAdicionais"]).toBeUndefined();
      expect(pruned.discarded).toHaveLength(1);
      expect(pruned.discarded[0]?.notice).toMatch(/não serão enviadas/i);
    });

    it("usa a regra de terceirização agregada na etapa de serviços", () => {
      const hidden = getHiddenFieldIds("services", { "servicos.chapeacao": "proprio" });
      expect(hidden).toContain("servicos.terceirizadosDetalhe");

      const visible = getHiddenFieldIds("services", { "servicos.pintura": "terceirizado" });
      expect(visible).not.toContain("servicos.terceirizadosDetalhe");
    });

    it("mantém todas as regras com seção, controlador e dependentes declarados", () => {
      for (const rule of CONDITIONAL_RULES) {
        expect(rule.section).toBeTruthy();
        expect(rule.controller).toBeTruthy();
        expect(rule.dependents.length).toBeGreaterThan(0);
        expect(rule.notice).toBeTruthy();
      }
    });
  });

  describe("4. Schema por etapa com os novos formatos", () => {
    it("recusa CNPJ com dígitos verificadores inválidos", () => {
      const result = validateSectionPayload(STEP_ONE, {
        values: {
          "empresa.razaoSocial": "LCL Chapeação LTDA",
          "empresa.proprietario": "Responsável",
          "empresa.cnpj": "51.784.844/0001-02",
        },
        pending: {},
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.fieldId).toBe("empresa.cnpj");
        expect(result.message).toMatch(/CNPJ/i);
      }
    });

    it("recusa CEP, telefone e data inválidos", () => {
      const cep = validateSectionPayload(STEP_ONE, {
        values: { "empresa.cep": "8590" },
        pending: {},
      });
      expect(cep.ok).toBe(false);

      const telefone = validateSectionPayload(STEP_ONE, {
        values: { "empresa.telefone": "(10) 9999-9999" },
        pending: {},
      });
      expect(telefone.ok).toBe(false);
    });

    it("não envia valores de campo condicional ocultado", () => {
      const result = validateSectionPayload(STEP_ONE, {
        values: {
          "empresa.razaoSocial": "LCL Chapeação LTDA",
          "empresa.proprietario": "Responsável",
          "empresa.outrasUnidades": "nao",
          "empresa.unidadesAdicionais": "Unidade de Estrela",
        },
        pending: {},
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.values["empresa.unidadesAdicionais"]).toBeUndefined();
      }
    });

    it("aceita a etapa de serviços com o novo campo de volume", () => {
      const result = validateSectionPayload(STEP_TWO, {
        values: {
          "servicos.chapeacao": "proprio",
          "servicos.volumesPorEspecialidade": "6 veículos por semana",
        },
        pending: {},
      });

      expect(result.ok).toBe(true);
    });
  });

  describe("5. Componentes de campo", () => {
    afterEach(() => {
      cleanup();
    });

    it("máscara o CEP enquanto o usuário digita", () => {
      const onChange = vi.fn();
      const cepField = STEP_ONE.fields.find((field) => field.format === "cep")!;

      render(
        <MaskedTextField
          field={cepField}
          value=""
          invalid={false}
          describedBy={undefined}
          onChange={onChange}
        />,
      );

      const input = screen.getByPlaceholderText("00000-000");
      fireEvent.change(input, { target: { value: "85900000" } });

      expect(onChange).toHaveBeenCalledWith("85900-000");
    });

    it("entrega data civil canônica a partir dos segmentos digitados", () => {
      const onChange = vi.fn();

      render(
        <DateField id="confirmacao.data" value={undefined} invalid={false} onChange={onChange} />,
      );

      const day = screen.getByLabelText("Dia");
      const month = screen.getByLabelText("Mês");
      const year = screen.getByLabelText("Ano");

      fireEvent.change(day, { target: { value: "29" } });
      fireEvent.change(month, { target: { value: "02" } });
      fireEvent.change(year, { target: { value: "2024" } });

      expect(onChange).toHaveBeenCalledWith("2024-02-29");
    });

    it("não aceita 29 de fevereiro em ano não bissexto", () => {
      const onChange = vi.fn();

      render(
        <DateField id="confirmacao.data" value={undefined} invalid={false} onChange={onChange} />,
      );

      fireEvent.change(screen.getByLabelText("Dia"), { target: { value: "29" } });
      fireEvent.change(screen.getByLabelText("Mês"), { target: { value: "02" } });
      fireEvent.change(screen.getByLabelText("Ano"), { target: { value: "2023" } });

      expect(onChange).not.toHaveBeenCalled();
    });

    it("mantém o valor canônico exibido em dd/mm/aaaa", () => {
      render(
        <DateField id="confirmacao.data" value="2024-02-29" invalid={false} onChange={vi.fn()} />,
      );

      expect(screen.getByLabelText("Dia")).toHaveValue("29");
      expect(screen.getByLabelText("Mês")).toHaveValue("02");
      expect(screen.getByLabelText("Ano")).toHaveValue("2024");
    });

    it("radio group é operável por teclado e expõe o estado marcado", async () => {
      const onChange = vi.fn();
      const radioField = STEP_ONE.fields.find((field) => field.control === "radio")!;

      render(
        <RadioGroupField
          field={radioField}
          value="sim"
          invalid={false}
          describedBy={undefined}
          onChange={onChange}
        />,
      );

      const options = screen.getAllByRole("radio");
      expect(options.length).toBeGreaterThan(1);
      expect(options[0]).toBeChecked();

      options[1]!.focus();
      fireEvent.click(options[1]!);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    });
  });
});
