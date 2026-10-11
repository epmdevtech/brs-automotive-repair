import { describe, expect, it } from "vitest";
import { company, services, validateContact, contactMessage } from "@/lib/brs";
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
  it("offers only the three confirmed services", () => {
    expect(services.map((s) => s.short)).toEqual(["Funilaria", "Pintura", "Martelinho de ouro"]);
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
