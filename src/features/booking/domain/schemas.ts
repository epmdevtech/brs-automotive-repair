import { z } from "zod";
import { normalizePhoneE164 } from "./phone";

export const vehicleSchema = z.object({
  make: z.string().trim().min(2, "Informe a marca ou montadora do veículo."),
  model: z.string().trim().min(1, "Informe o modelo do veículo."),
  year: z.string().trim().optional(),
  plate: z.string().trim().optional(),
  color: z.string().trim().optional(),
  finishType: z
    .enum(["solida", "metalica", "perolizada", "nao-informada"])
    .default("nao-informada"),
});

export const damageIntakeSchema = z.object({
  vehicle: vehicleSchema,
  affectedAreas: z
    .array(z.string())
    .min(1, "Selecione ao menos uma peça ou área afetada no veículo."),
  damageType: z.enum([
    "amassado-sem-risco",
    "colisao-com-vinco",
    "risco-profundo-descascamento",
    "granizo",
    "verniz-opaco-micro-riscos",
    "manchas-vidro",
    "outros",
  ]),
  description: z.string().trim().optional(),
  isInsurance: z.boolean().default(false),
});

export const logisticsSchema = z
  .object({
    type: z.enum(["presencial", "leva-e-traz"]),
    address: z.string().trim().optional(),
    neighborhood: z.string().trim().optional(),
    city: z.string().trim().default("Toledo"),
    referencePoint: z.string().trim().optional(),
    vehicleDrivable: z.boolean().default(true),
    contactPerson: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "leva-e-traz") {
      if (!data.address || data.address.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe a rua e número para coleta em Toledo-PR.",
          path: ["address"],
        });
      }
      if (!data.neighborhood || data.neighborhood.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe o bairro em Toledo-PR.",
          path: ["neighborhood"],
        });
      }
    }
  });

export const customerSchema = z.object({
  name: z.string().trim().min(3, "Informe seu nome completo."),
  phone: z
    .string()
    .trim()
    .refine((val) => normalizePhoneE164(val).ok, {
      message: "Informe um telefone válido com DDD oficial (ex: (45) 99999-8888).",
    }),
  notes: z.string().trim().optional(),
  consentLgpd: z.literal(true, {
    errorMap: () => ({
      message: "Você deve aceitar a política para prosseguir com o agendamento.",
    }),
  }),
});

export const createAppointmentSchema = z.object({
  serviceId: z.string().min(1, "Selecione o serviço ou avaliação desejada."),
  professionalId: z.string().optional(),
  startTime: z.string().datetime("Data e hora de início inválidas."),
  intake: damageIntakeSchema,
  logistics: logisticsSchema,
  customer: customerSchema,
  idempotencyKey: z.string().uuid("Chave de idempotência inválida."),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type DamageIntakeInput = z.infer<typeof damageIntakeSchema>;
export type LogisticsInput = z.infer<typeof logisticsSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
