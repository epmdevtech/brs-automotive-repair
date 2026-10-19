import { describe, expect, it } from "vitest";
import {
  company,
  services,
  aestheticServices,
  allOfferedServices,
  validateContact,
  contactMessage,
} from "@/lib/brs";
describe("Verified Master business rules", () => {
  it("uses the supplied public phone", () => {
    expect(company.phoneHref).toBe("tel:+5545999545442");
  });
  it("keeps unconfirmed WhatsApp disabled", () => {
    expect(company.whatsappConfirmed).toBe(false);
  });
  it("uses the official Facebook", () => {
    expect(company.social.url).toBe("https://www.facebook.com/1630662447189202");
  });
  it("uses the official Instagram", () => {
    expect(company.instagram.url).toBe("https://www.instagram.com/masterchapeacao2022/");
    expect(company.instagram.handle).toBe("@masterchapeacao2022");
  });
  it("maintains official corporate registration data and founder history", () => {
    expect(company.legalName).toBe("LCL Chapeação LTDA");
    expect(company.tradeName).toBe("Master Chapeação e Pinturas");
    expect(company.cnpj).toBe("51.784.844/0001-01");
    expect(company.cnpjRaw).toBe("51784844000101");
    expect(company.foundedFormatted).toBe("11/08/2023");
    expect(company.team.name).toBe("Equipe Master");
    expect(company.team.experienceYearsText).toContain("especializado");
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
        description: "Conhecer a Master",
        vehicle: "",
        service: "",
        audience: "corretor",
      }),
    ).toContain("possível parceria para atendimento de segurados");
  });
});
