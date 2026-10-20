import { useState } from "react";
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Info,
  Facebook,
  Instagram,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/brs";
import { MASTER_BOOKING_CONFIG } from "../config/booking.config";
import { DAMAGE_AREAS_LIST, DAMAGE_TYPES_LIST, formatPreOsSummary } from "../domain/intake";
import { formatTime, formatDate } from "../domain/time";
import { formatPhoneBR } from "../domain/phone";
import type { DamageType, FinishType } from "../domain/types";
import { useBooking } from "../hooks/use-booking";

export interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultServiceId?: string;
}

export function BookingDialog({ open, onOpenChange, defaultServiceId }: BookingDialogProps) {
  const booking = useBooking();
  const [copied, setCopied] = useState(false);

  // Se passou um serviço padrão ao abrir
  if (defaultServiceId && booking.serviceId !== defaultServiceId && booking.step === 1) {
    booking.setServiceId(defaultServiceId);
  }

  const activeService =
    MASTER_BOOKING_CONFIG.services.find((s) => s.id === booking.serviceId) ??
    MASTER_BOOKING_CONFIG.services[0];

  const morningSlots = booking.availableSlots.filter((s) => s.start.getHours() < 12);
  const afternoonSlots = booking.availableSlots.filter((s) => s.start.getHours() >= 12);

  const handleCopySummary = async () => {
    if (!booking.createdAppointment) return;
    const summary = formatPreOsSummary({
      protocol: booking.createdAppointment.protocol,
      serviceTitle: activeService.title,
      scheduledTime: `${formatDate(new Date(booking.createdAppointment.startTime))} às ${formatTime(new Date(booking.createdAppointment.startTime))}`,
      customer: booking.createdAppointment.customer,
      intake: booking.createdAppointment.intake,
      logistics: booking.createdAppointment.logistics,
    });
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const changeDateBy = (days: number) => {
    const next = new Date(booking.selectedDate);
    next.setDate(next.getDate() + days);
    booking.setSelectedDate(next);
    booking.setSelectedSlot(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-card border-border p-6 md:p-8 text-foreground sm:rounded-xl">
        <DialogHeader className="space-y-1.5 pb-4 border-b border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-accent">
              {booking.step === 6
                ? "Agendamento & Pré-OS Confirmados"
                : `Etapa ${booking.step} de 5 — Agendamento de Avaliação Técnica`}
            </span>
            {booking.step < 6 && (
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                Oficina em Toledo-PR
              </span>
            )}
          </div>
          <DialogTitle className="text-xl md:text-2xl font-display font-semibold text-foreground tracking-tight">
            {booking.step === 1 && "Identificação do Veículo & Triagem de Avarias"}
            {booking.step === 2 && "Especialidade Técnica Desejada"}
            {booking.step === 3 && "Modalidade de Atendimento & Guincho"}
            {booking.step === 4 && "Escolha da Data & Horário do Slot"}
            {booking.step === 5 && "Seus Dados de Contato"}
            {booking.step === 6 && "Pré-OS Gerada com Sucesso"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {booking.step === 1 &&
              "Informe os dados do veículo e selecione as peças afetadas para abertura da Pré-OS."}
            {booking.step === 2 &&
              "Selecione o serviço para o qual deseja realizar a vistoria técnica presencial ou remota."}
            {booking.step === 3 &&
              "Defina se você levará o carro à Master ou se prefere a comodidade do serviço de guincho em Toledo-PR."}
            {booking.step === 4 &&
              "Consulte a disponibilidade real em nosso motor matemático anti-colisão."}
            {booking.step === 5 &&
              "Identifique-se para registro da ordem e confirmação no canal oficial."}
            {booking.step === 6 &&
              "Seu agendamento foi travado atomicamente. Guarde seu protocolo e encaminhe ao nosso atendimento."}
          </DialogDescription>
        </DialogHeader>

        {/* ERRO GLOBAL */}
        {booking.submissionError && (
          <div className="p-3 my-2 rounded bg-destructive/15 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
            <Info size={16} className="shrink-0" />
            <span>{booking.submissionError}</span>
          </div>
        )}

        {/* ETAPA 1: VEÍCULO & AVARIAS (PRÉ-OS) */}
        {booking.step === 1 && (
          <div className="space-y-6 py-2">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="form-field">
                Marca / Montadora *
                <input
                  type="text"
                  className="field-input"
                  placeholder="Ex: Volkswagen, Toyota, Fiat"
                  value={booking.vehicleMake}
                  onChange={(e) => booking.setVehicleMake(e.target.value)}
                />
              </label>

              <label className="form-field">
                Modelo do Veículo *
                <input
                  type="text"
                  className="field-input"
                  placeholder="Ex: Corolla Cross, Polo Track, Renegade"
                  value={booking.vehicleModel}
                  onChange={(e) => booking.setVehicleModel(e.target.value)}
                />
              </label>

              <label className="form-field">
                Ano de Fabricação / Modelo
                <input
                  type="text"
                  className="field-input"
                  placeholder="Ex: 2022 / 2023"
                  value={booking.vehicleYear}
                  onChange={(e) => booking.setVehicleYear(e.target.value)}
                />
              </label>

              <label className="form-field">
                Placa (Opcional)
                <input
                  type="text"
                  className="field-input uppercase"
                  placeholder="Ex: ABC1D23"
                  maxLength={8}
                  value={booking.vehiclePlate}
                  onChange={(e) => booking.setVehiclePlate(e.target.value.toUpperCase())}
                />
              </label>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-2">
                Peças ou Áreas Afetadas no Veículo *
              </label>
              <div className="flex flex-wrap gap-2">
                {DAMAGE_AREAS_LIST.map((area) => {
                  const selected = booking.affectedAreas.includes(area.id);
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => booking.toggleAffectedArea(area.id)}
                      className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                        selected
                          ? "bg-primary text-primary-foreground border-primary font-medium"
                          : "bg-secondary/40 text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground"
                      }`}
                    >
                      {area.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="form-field">
                Natureza Principal do Dano *
                <select
                  className="field-input"
                  value={booking.damageType}
                  onChange={(e) => booking.setDamageType(e.target.value as DamageType)}
                >
                  {DAMAGE_TYPES_LIST.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                Tipo de Acabamento da Pintura
                <select
                  className="field-input"
                  value={booking.finishType}
                  onChange={(e) => booking.setFinishType(e.target.value as FinishType)}
                >
                  <option value="nao-informada">Não tenho certeza</option>
                  <option value="solida">Pintura Sólida (Branco, Preto, Vermelho)</option>
                  <option value="metalica">Pintura Metálica (Prata, Cinza com partículas)</option>
                  <option value="perolizada">Pintura Perolizada / Tricamada</option>
                </select>
              </label>
            </div>

            <label className="form-field">
              Observações / Detalhes Adicionais da Avaria
              <textarea
                className="field-input min-h-20 resize-y"
                placeholder="Conte brevemente como ocorreu o dano ou itens específicos que gostaria que inspecionássemos."
                value={booking.damageDescription}
                onChange={(e) => booking.setDamageDescription(e.target.value)}
              />
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                checked={booking.isInsurance}
                onChange={(e) => booking.setIsInsurance(e.target.checked)}
                className="accent-primary size-4"
              />
              <span>Atendimento relacionado a Sinistro / Seguro Automotivo</span>
            </label>
          </div>
        )}

        {/* ETAPA 2: SERVIÇO DESEJADO */}
        {booking.step === 2 && (
          <div className="space-y-4 py-2">
            <p className="text-xs text-muted-foreground">
              Selecione a especialidade técnica correspondente. O tempo de slot reservado será
              alocado especificamente para a vistoria técnica e orçamento detalhado.
            </p>

            <div className="grid gap-3">
              {MASTER_BOOKING_CONFIG.services.map((svc) => {
                const isSelected = booking.serviceId === svc.id;
                return (
                  <div
                    key={svc.id}
                    onClick={() => booking.setServiceId(svc.id)}
                    className={`p-4 rounded border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-primary shadow-sm"
                        : "bg-secondary/20 border-border hover:border-foreground/30 hover:bg-secondary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wrench
                          size={16}
                          className={isSelected ? "text-brand-accent" : "text-muted-foreground"}
                        />
                        <span className="text-sm font-semibold text-foreground">{svc.title}</span>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {svc.durationMinutes} min de vistoria
                      </span>
                    </div>
                    {svc.description && (
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {svc.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ETAPA 3: MODALIDADE & LEVA E TRAZ */}
        {booking.step === 3 && (
          <div className="space-y-5 py-2">
            <div className="grid sm:grid-cols-2 gap-4">
              <div
                onClick={() => booking.setLogisticsType("presencial")}
                className={`p-4 rounded border cursor-pointer transition-all ${
                  booking.logisticsType === "presencial"
                    ? "bg-primary/10 border-primary"
                    : "bg-secondary/20 border-border hover:border-foreground/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin
                    size={18}
                    className={
                      booking.logisticsType === "presencial"
                        ? "text-brand-accent"
                        : "text-muted-foreground"
                    }
                  />
                  <span className="text-sm font-semibold text-foreground">
                    Atendimento na Oficina
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Você leva o veículo até a sede da Master em Toledo-PR no horário agendado.
                  Inspeção em rampa e luminária técnica de linhas.
                </p>
              </div>

              <div
                onClick={() => booking.setLogisticsType("leva-e-traz")}
                className={`p-4 rounded border cursor-pointer transition-all ${
                  booking.logisticsType === "leva-e-traz"
                    ? "bg-primary/10 border-primary"
                    : "bg-secondary/20 border-border hover:border-foreground/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Truck
                    size={18}
                    className={
                      booking.logisticsType === "leva-e-traz"
                        ? "text-brand-accent"
                        : "text-muted-foreground"
                    }
                  />
                  <span className="text-sm font-semibold text-foreground">
                    Serviço de Guincho (Toledo-PR)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Retiramos seu veículo no seu endereço residencial ou comercial dentro da cidade de
                  Toledo-PR com equipe e seguro de trânsito.
                </p>
              </div>
            </div>

            {booking.logisticsType === "leva-e-traz" && (
              <div className="p-4 rounded border border-border/80 bg-secondary/30 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Truck size={14} className="text-brand-accent" />
                  Dados para Coleta em Toledo-PR
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="form-field">
                    Endereço de Coleta (Rua e Número) *
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Ex: Rua Santos Dumont, 1420"
                      value={booking.address}
                      onChange={(e) => booking.setAddress(e.target.value)}
                    />
                  </label>

                  <label className="form-field">
                    Bairro em Toledo-PR *
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Ex: Centro, Vila Industrial, La Salle"
                      value={booking.neighborhood}
                      onChange={(e) => booking.setNeighborhood(e.target.value)}
                    />
                  </label>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={booking.vehicleDrivable}
                    onChange={(e) => booking.setVehicleDrivable(e.target.checked)}
                    className="accent-primary size-4"
                  />
                  <span>O veículo está rodando normalmente (não requer guincho)</span>
                </label>
              </div>
            )}
          </div>
        )}

        {/* ETAPA 4: CALENDÁRIO & HORÁRIOS */}
        {booking.step === 4 && (
          <div className="space-y-5 py-2">
            {/* Navegador de Data */}
            <div className="flex items-center justify-between p-3 rounded border border-border bg-secondary/30">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => changeDateBy(-1)}
                className="h-8 px-2 text-xs"
              >
                <ChevronLeft size={14} className="mr-1" /> Dia Anterior
              </Button>
              <div className="text-center">
                <div className="text-xs font-semibold text-foreground flex items-center justify-center gap-1.5">
                  <Calendar size={14} className="text-brand-accent" />
                  {formatDate(booking.selectedDate)}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {booking.selectedDate.toLocaleDateString("pt-BR", { weekday: "long" })}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => changeDateBy(1)}
                className="h-8 px-2 text-xs"
              >
                Próximo Dia <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>

            {/* Grid de Slots */}
            {booking.availableSlots.length === 0 ? (
              <div className="text-center py-8 px-4 rounded border border-dashed border-border text-muted-foreground text-xs space-y-2">
                <Clock size={24} className="mx-auto text-muted-foreground/60" />
                <p>Nenhum horário livre disponível nesta data para os critérios selecionados.</p>
                <p className="text-[11px]">
                  Tente avançar para o próximo dia útil ou verificar os sábados pela manhã.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {morningSlots.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-foreground block mb-2">
                      Manhã (08:00 às 12:00)
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {morningSlots.map((slot, idx) => {
                        const isSelected =
                          booking.selectedSlot?.start.getTime() === slot.start.getTime();
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => booking.setSelectedSlot(slot)}
                            className={`py-2 px-2 text-xs rounded border text-center transition-all ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary font-bold shadow"
                                : "bg-secondary/40 text-foreground border-border hover:border-primary/50"
                            }`}
                          >
                            {formatTime(slot.start)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {afternoonSlots.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-foreground block mb-2">
                      Tarde (13:30 às 18:00)
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {afternoonSlots.map((slot, idx) => {
                        const isSelected =
                          booking.selectedSlot?.start.getTime() === slot.start.getTime();
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => booking.setSelectedSlot(slot)}
                            className={`py-2 px-2 text-xs rounded border text-center transition-all ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary font-bold shadow"
                                : "bg-secondary/40 text-foreground border-border hover:border-primary/50"
                            }`}
                          >
                            {formatTime(slot.start)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {booking.selectedSlot && (
              <div className="p-3 rounded bg-primary/10 border border-primary/30 text-xs flex items-center justify-between text-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <Check size={14} className="text-brand-accent" />
                  Horário Escolhido: {formatDate(booking.selectedSlot.start)} às{" "}
                  {formatTime(booking.selectedSlot.start)}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Duração: {activeService.durationMinutes} min
                </span>
              </div>
            )}
          </div>
        )}

        {/* ETAPA 5: DADOS DO CLIENTE */}
        {booking.step === 5 && (
          <div className="space-y-4 py-2">
            <label className="form-field">
              Seu Nome Completo *
              <input
                type="text"
                className="field-input"
                placeholder="Como podemos identificar você na OS?"
                value={booking.customerName}
                onChange={(e) => booking.setCustomerName(e.target.value)}
              />
            </label>

            <label className="form-field">
              Telefone Celular com DDD (WhatsApp) *
              <input
                type="tel"
                className="field-input"
                placeholder="(45) 99999-8888"
                value={booking.customerPhone}
                onChange={(e) => booking.setCustomerPhone(e.target.value)}
              />
              <span className="text-[10px] text-muted-foreground mt-1">
                Utilizamos o padrão nacional E.164 com validação dos 67 DDDs brasileiros.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-muted-foreground hover:text-foreground pt-2">
              <input
                type="checkbox"
                checked={booking.consentLgpd}
                onChange={(e) => booking.setConsentLgpd(e.target.checked)}
                className="accent-primary size-4 mt-0.5"
              />
              <span className="leading-relaxed">
                Concordo com o registro das informações técnicas do meu veículo para fins exclusivos
                de agendamento de vistoria e contato da Master Chapeação e Pinturas.
              </span>
            </label>
          </div>
        )}

        {/* ETAPA 6: SUCESSO & PRÉ-OS PROTOCOLO */}
        {booking.step === 6 && booking.createdAppointment && (
          <div className="space-y-5 py-2">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <ShieldCheck size={36} className="mx-auto text-emerald-400" />
              <div className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
                Agendamento Confirmado com Sucesso!
              </div>
              <div className="text-2xl font-mono font-bold text-foreground">
                {booking.createdAppointment.protocol}
              </div>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Seu horário foi reservado automaticamente na agenda da oficina. A Pré-OS foi gerada
                e a equipe da Master já visualiza seu agendamento.
              </p>
            </div>

            <div className="p-4 rounded border border-border bg-secondary/30 space-y-2 font-mono text-xs">
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="text-muted-foreground">Veículo:</span>
                <span className="text-foreground font-semibold">
                  {booking.createdAppointment.intake.vehicle.make}{" "}
                  {booking.createdAppointment.intake.vehicle.model}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="text-muted-foreground">Horário Agendado:</span>
                <span className="text-foreground">
                  {formatDate(new Date(booking.createdAppointment.startTime))} às{" "}
                  {formatTime(new Date(booking.createdAppointment.startTime))}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-1.5">
                <span className="text-muted-foreground">Modalidade:</span>
                <span className="text-foreground">
                  {booking.createdAppointment.logistics.type === "leva-e-traz"
                    ? "Guincho (Toledo-PR)"
                    : "Presencial na Master"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cliente:</span>
                <span className="text-foreground">
                  {booking.createdAppointment.customer.name} (
                  {formatPhoneBR(booking.createdAppointment.customer.phone)})
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                type="button"
                variant="primary"
                onClick={handleCopySummary}
                className="w-full h-11 text-xs font-semibold"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 size-4" /> Pré-OS Copiada com Sucesso!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 size-4" /> Copiar Dados da Pré-OS para Envio
                  </>
                )}
              </Button>

              <div className="grid sm:grid-cols-3 gap-3">
                <a
                  href={company.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded border border-border bg-secondary/30 hover:bg-secondary/60 text-xs font-medium text-foreground transition-colors"
                >
                  <Instagram size={14} className="text-brand-accent" />
                  Instagram
                </a>

                <a
                  href={company.social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded border border-border bg-secondary/30 hover:bg-secondary/60 text-xs font-medium text-foreground transition-colors"
                >
                  <Facebook size={14} className="text-brand-accent" />
                  Facebook
                </a>

                <a
                  href={company.phoneHref}
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded border border-border bg-secondary/30 hover:bg-secondary/60 text-xs font-medium text-foreground transition-colors"
                >
                  <Phone size={14} className="text-brand-accent" />
                  Ligar: {company.phone}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* NAVEGAÇÃO DE PASSOS */}
        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          {booking.step > 1 && booking.step < 6 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={booking.prevStep}
              className="text-xs"
            >
              <ChevronLeft size={14} className="mr-1" /> Voltar
            </Button>
          ) : (
            <div />
          )}

          {booking.step < 5 && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                if (booking.step === 1) {
                  if (!booking.vehicleMake || !booking.vehicleModel) {
                    alert("Por favor, preencha ao menos a marca e o modelo do veículo.");
                    return;
                  }
                  if (booking.affectedAreas.length === 0) {
                    alert("Selecione ao menos uma peça afetada do veículo.");
                    return;
                  }
                }
                if (booking.step === 3 && booking.logisticsType === "leva-e-traz") {
                  if (!booking.address || !booking.neighborhood) {
                    alert("Informe o endereço e o bairro para o serviço Guincho.");
                    return;
                  }
                }
                if (booking.step === 4 && !booking.selectedSlot) {
                  alert("Selecione um horário para prosseguir.");
                  return;
                }
                booking.nextStep();
              }}
              className="text-xs"
            >
              Avançar <ChevronRight size={14} className="ml-1" />
            </Button>
          )}

          {booking.step === 5 && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={booking.isSubmitting}
              onClick={booking.submitBooking}
              className="text-xs font-semibold"
            >
              {booking.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Bloqueando horário...
                </>
              ) : (
                <>
                  Confirmar Agendamento <ShieldCheck size={14} className="ml-1.5" />
                </>
              )}
            </Button>
          )}

          {booking.step === 6 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                booking.resetBooking();
                onOpenChange(false);
              }}
              className="text-xs"
            >
              Fechar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
