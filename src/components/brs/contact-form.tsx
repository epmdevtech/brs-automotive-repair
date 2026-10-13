import { useState, useEffect, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Instagram, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  company,
  services,
  aestheticServices,
  validateContact,
  contactMessage,
  type ContactValues,
} from "@/lib/brs";

type FormStatus = "idle" | "submitting" | "success" | "error";

const initialValues: ContactValues = {
  name: "",
  phone: "",
  vehicle: "",
  service: "",
  description: "",
  audience: "particular",
};

const external = { target: "_blank", rel: "noopener noreferrer" };

export function ContactForm({ partner }: { partner: boolean }) {
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactValues, string>>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    if (partner) setValues((v) => ({ ...v, audience: "corretor" }));
  }, [partner]);

  const update = (field: keyof ContactValues, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (status === "error" && errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const validation = validateContact(values);
    setErrors(validation);
    if (Object.keys(validation).length) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setCopied(false);
    setCopyError(false);

    // Feedback visual palpável com transição suave
    setTimeout(() => {
      setMessage(contactMessage(values));
      setStatus("success");
    }, 350);
  };

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <>
      <form onSubmit={submit} noValidate className="grid gap-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <label className="form-field">
            Seu nome *
            <input
              className="field-input"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              type="text"
              placeholder="Como podemos chamar você?"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <span id="name-error" role="alert" className="text-destructive text-[11px]">
                {errors.name}
              </span>
            )}
          </label>

          <label className="form-field">
            Telefone com DDD *
            <input
              className="field-input"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
              type="tel"
              placeholder="(45) 90000-0000"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <span id="phone-error" role="alert" className="text-destructive text-[11px]">
                {errors.phone}
              </span>
            )}
          </label>

          <label className="form-field">
            Modelo do veículo
            <input
              className="field-input"
              value={values.vehicle}
              onChange={(e) => update("vehicle", e.target.value)}
              type="text"
              placeholder="Ex.: Fiat Pulse, Toyota Corolla"
              autoComplete="off"
            />
          </label>

          <label className="form-field">
            Serviço desejado
            <select
              className="field-input"
              value={values.service}
              onChange={(e) => update("service", e.target.value)}
            >
              <option value="">Preciso de orientação técnica</option>
              <optgroup label="Reparações Automotivas">
                {services.map((s) => (
                  <option key={s.short} value={s.short}>
                    {s.short}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Estética & Proteção">
                {aestheticServices.map((s) => (
                  <option key={s.short} value={s.short}>
                    {s.short}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>
        </div>

        <fieldset>
          <legend className="text-[11px] mb-2.5 font-medium text-foreground">
            Tipo de atendimento
          </legend>
          <div className="flex flex-wrap gap-5">
            {(
              [
                ["particular", "Particular"],
                ["seguro", "Relacionado a seguro"],
                ["corretor", "Sou corretor de seguros"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <input
                  type="radio"
                  name="audience"
                  value={value}
                  checked={values.audience === value}
                  onChange={() => update("audience", value)}
                  className="accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="form-field">
          Descreva sua necessidade *
          <textarea
            className="field-input resize-y min-h-24"
            placeholder={
              partner
                ? "Conte sobre os tipos de veículos e atendimentos que você encaminha."
                : "Descreva a peça afetada, tipo de avaria ou dúvida sobre o reparo."
            }
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "description-error" : undefined}
          />
          {errors.description && (
            <span id="description-error" role="alert" className="text-destructive text-[11px]">
              {errors.description}
            </span>
          )}
        </label>

        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Seus dados não são armazenados em banco. O formulário formata uma mensagem para você
          enviar com um clique diretamente pelo Instagram oficial da BRS.
        </p>

        <Button
          type="submit"
          variant="primary"
          disabled={status === "submitting"}
          className="h-12 text-xs font-semibold"
          aria-live="polite"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
              Gerando mensagem...
            </>
          ) : status === "success" ? (
            <>
              <Check className="mr-2 size-4" aria-hidden="true" />
              Mensagem pronta!
            </>
          ) : (
            <>
              Preparar mensagem <ArrowUpRight className="ml-1" size={14} aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      <Dialog
        open={Boolean(message)}
        onOpenChange={(open) => {
          if (!open) {
            setMessage("");
            setStatus("idle");
          }
        }}
      >
        <DialogContent className="w-[calc(100%-32px)] max-h-[90vh] overflow-y-auto bg-card border-border p-6">
          <DialogTitle className="text-lg md:text-xl font-semibold font-display tracking-tight text-foreground">
            Mensagem pronta para envio
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5 text-pretty">
            Copie o texto estruturado abaixo e envie em uma conversa no Instagram oficial da BRS.
            Nenhuma informação foi enviada ainda.
          </DialogDescription>
          <textarea
            aria-label="Mensagem formatada"
            readOnly
            value={message}
            className="field-input min-h-44 text-xs font-mono my-2"
          />
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="secondary" onClick={copy} className="flex-1 gap-2 text-xs font-medium">
              {copied ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                <Copy size={16} aria-hidden="true" />
              )}
              {copied ? "Mensagem copiada" : "Copiar mensagem"}
            </Button>
            <Button variant="primary" asChild className="flex-1 gap-2 text-xs font-semibold">
              <a href={company.instagram} {...external}>
                <Instagram size={16} aria-hidden="true" /> Abrir Instagram
              </a>
            </Button>
          </div>
          {copyError && (
            <p role="alert" className="text-xs text-destructive mt-1">
              Não foi possível copiar automaticamente. Selecione e copie manualmente o texto acima.
            </p>
          )}
          <p className="text-[11px] text-muted-foreground pt-3 border-t border-border/60">
            Prefere ligar diretamente?{" "}
            <a className="underline hover:text-primary transition-colors" href={company.phoneHref}>
              Ligue para {company.phone}
            </a>
            .
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
