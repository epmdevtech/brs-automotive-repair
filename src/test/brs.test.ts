import { describe, expect, it } from "vitest";
import {
  company,
  services,
  aestheticServices,
  allOfferedServices,
  validateContact,
  contactMessage,
} from "@/lib/brs";
describe("Verified BRS business rules", () => {
  it("uses the supplied public phone", () => {
    expect(company.phoneHref).toBe("tel:+554520359440");
  });
  it("keeps unconfirmed WhatsApp disabled", () => {
    expect(company.whatsappConfirmed).toBe(false);
  });
  it("uses the official Instagram", () => {
    expect(company.instagram).toBe("https://www.instagram.com/brsreparacoes/");
  });
  it("maintains official corporate registration data and founder history", () => {
    expect(company.legalName).toBe("Brs Comercio de Pecas Automotivas LTDA");
    expect(company.tradeName).toBe("Brs Comercio de Pecas Automotivas");
    expect(company.cnpj).toBe("53.877.400/0001-46");
    expect(company.cnpjRaw).toBe("53877400000146");
    expect(company.foundedFormatted).toBe("09/02/2024");
    expect(company.founder.name).toBe("Bruno");
    expect(company.founder.experienceYearsText).toContain("experiência");
  });
  it("offers only the three confirmed services", () => {
    expect(services.map((s) => s.short)).toEqual(["Funilaria", "Pintura", "Martelinho de ouro"]);
  });
  it("offers the specialized aesthetic and surface protection services", () => {
    expect(aestheticServices.map((s) => s.title)).toEqual([
      "Espelhamento de pintura automotiva",
      "Vitrificação cerâmica de pintura",
      "Polimento técnico de para-brisa",
    ]);
    expect(aestheticServices.map((s) => s.short)).toEqual([
      "Espelhamento",
      "Vitrificação",
      "Polimento de para-brisa",
    ]);
    expect(allOfferedServices).toHaveLength(6);
  });
  it("requires name, phone and problem but not vehicle or service", () => {
    expect(
      validateContact({
        name: "Ana",
        phone: "45999999999",
        description: "Amassado na porta",
        vehicle: "",
        service: "",
        audience: "particular",
      }),
    ).toEqual({});
    expect(
      validateContact({
        name: "",
        phone: "123",
        description: "",
        vehicle: "",
        service: "",
        audience: "particular",
      }),
    ).toHaveProperty("phone");
  });
  it("prepares a broker-specific partnership message", () => {
    expect(
      contactMessage({
        name: "Ana",
        phone: "45999999999",
        description: "Conhecer a BRS",
        vehicle: "",
        service: "",
        audience: "corretor",
      }),
    ).toContain("possível parceria para atendimento de segurados");
  });
});
