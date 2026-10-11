import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  MapPin,
  Phone,
  Instagram,
  Menu,
  X,
  ShieldCheck,
  Car,
  Paintbrush,
  Wrench,
  Check,
  Handshake,
  Truck,
  Copy,
  Expand,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  company,
  navigation,
  services,
  validateContact,
  contactMessage,
  type ContactValues,
} from "@/lib/brs";
import hero from "@/assets/brs-hero.jpg";
import bodywork from "@/assets/funilaria.jpg";
import painting from "@/assets/pintura.jpg";
import dent from "@/assets/martelinho.jpg";

const serviceImages = [bodywork, painting, dent];
const serviceIcons = [Wrench, Paintbrush, Car];
const external = { target: "_blank", rel: "noopener noreferrer" };

export function Brand() {
  return (
    <a href="#inicio" aria-label="BRS Reparações Automotivas — início" className="brand">
      <strong>
        BRS<span className="sr-only"> Reparações Automotivas</span>
      </strong>
      <span aria-hidden="true">REPARAÇÕES AUTOMOTIVAS</span>
    </a>
  );
}
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="page-width header-inner">
        <Brand />
        <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-6">
          {navigation.map(([label, href]) => (
            <a className="nav-link" key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="flex gap-3 items-center">
          <Button
            variant="automotive"
            asChild
            className="hidden sm:inline-flex h-10 text-[11px] px-5"
          >
            <a href="#contato">
              Solicitar orçamento <ArrowUpRight />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Navegação móvel"
          className="bg-background border-t border-border px-6 py-5 grid gap-5 lg:hidden"
        >
          {navigation.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="text-sm">
              {label}
            </a>
          ))}
          <Button variant="automotive" asChild>
            <a href="#contato" onClick={() => setOpen(false)}>
              Solicitar orçamento <ArrowUpRight />
            </a>
          </Button>
        </nav>
      )}
    </header>
  );
}
export function Hero() {
  return (
    <>
      <section id="inicio" className="hero">
        <img
          src={hero}
          alt="Veículo esportivo prateado em ambiente de reparação — imagem ilustrativa"
          className="hero-photo"
          width={1920}
          height={1088}
          fetchPriority="high"
        />
        <div className="page-width hero-content reveal">
          <p className="eyebrow">Precisão no reparo. Cuidado no atendimento.</p>
          <h1>
            BRS Reparações
            <br />
            <span className="text-primary">Automotivas.</span>
          </h1>
          <p className="hero-subtitle">Seu veículo merece um reparo à altura.</p>
          <p className="hero-copy">
            Funilaria, pintura e martelinho de ouro. Atenção aos detalhes, cuidado em cada etapa e
            compromisso com um trabalho bem executado.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Button variant="automotive" asChild className="h-12 px-6 text-xs">
              <a href="#contato">
                Solicitar avaliação <ArrowUpRight />
              </a>
            </Button>
            <Button variant="automotiveOutline" asChild className="h-12 px-6 text-xs">
              <a href="#servicos">
                Conhecer os serviços <ArrowRight />
              </a>
            </Button>
          </div>
        </div>
        <div className="page-width hero-bottom">
          <span className="hero-location">
            <MapPin size={13} /> Toledo, Paraná
          </span>
          <a
            href="#servicos"
            aria-label="Ir para serviços"
            className="hidden sm:flex items-center gap-3 text-[9px] uppercase tracking-[2px] text-muted-foreground"
          >
            Conheça a BRS <ArrowDown size={15} />
          </a>
          <span className="image-note">Imagem ilustrativa</span>
        </div>
      </section>
      <div className="trust-strip">
        <div className="page-width grid grid-cols-2 md:grid-cols-4 gap-y-5">
          {[
            [ShieldCheck, "Cuidado em cada detalhe"],
            [Wrench, "Reparação especializada"],
            [Handshake, "Atenção ao cliente"],
            [Truck, "Serviço de leva e traz"],
          ].map(([Icon, text], i) => {
            const ItemIcon = Icon as typeof ShieldCheck;
            return (
              <div className="trust-item" key={i}>
                <ItemIcon strokeWidth={1.5} />
                <span>{text as string}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
export function Services() {
  return (
    <section id="servicos" className="section-space">
      <div className="page-width">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-10">
          <div>
            <p className="eyebrow mb-4">O que fazemos</p>
            <h2 className="section-title">
              Recuperar a forma.
              <br />
              <span className="text-muted-foreground">Preservar o valor.</span>
            </h2>
          </div>
          <p className="body-copy max-w-[330px]">
            Soluções para diferentes tipos de danos.
            <br />
            Um olhar cuidadoso para cada veículo.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = serviceIcons[i];
            return (
              <article key={service.title} className="service-card">
                <div className="overflow-hidden relative">
                  <img
                    src={serviceImages[i]}
                    alt={`${service.title} — fotografia ilustrativa da atividade`}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="service-image"
                  />
                  <span className="absolute bottom-3 right-3 text-[8px] px-2 py-1 bg-background/80 text-muted-foreground">
                    Imagem ilustrativa
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-primary">0{i + 1} / SERVIÇO</span>
                    {Icon && <Icon size={19} strokeWidth={1.5} className="text-primary" />}
                  </div>
                  <h3 className="text-[27px] mb-3">{service.title}</h3>
                  <p className="body-copy text-xs min-h-[90px]">{service.description}</p>
                  <Button
                    variant="editorial"
                    asChild
                    className="text-[11px] h-8 mt-4 w-full justify-between border-t border-border pt-5 pb-2"
                  >
                    <a href="#contato">
                      Solicitar avaliação <ArrowUpRight />
                    </a>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export function Philosophy() {
  const pillars = [
    ["Atenção aos detalhes", "Preparação, execução e acabamento tratados com cuidado."],
    [
      "Comunicação transparente",
      "Orientações claras para compreender a avaliação e as etapas do serviço.",
    ],
    [
      "Compromisso com o atendimento",
      "Cuidado com o proprietário e com os profissionais que indicam seus clientes.",
    ],
  ];
  return (
    <section className="section-space border-y border-border bg-secondary/40">
      <div className="page-width grid md:grid-cols-2 gap-12 md:gap-24">
        <div>
          <p className="eyebrow mb-5">O cuidado faz a diferença</p>
          <h2 className="section-title">
            Mais do que reparar.
            <br />
            <span className="text-primary">Cuidar de cada detalhe.</span>
          </h2>
          <p className="body-copy mt-6 max-w-[440px]">
            Um reparo automotivo exige técnica, atenção e responsabilidade. Tudo começa pela
            compreensão da sua necessidade e pela avaliação do veículo, para orientar a solução mais
            adequada.
          </p>
          <p className="text-[10px] text-muted-foreground mt-5">
            O compromisso que queremos construir em cada atendimento.
          </p>
        </div>
        <div>
          {pillars.map(([title, description], i) => (
            <div className="pillar" key={title}>
              <span className="pillar-number">0{i + 1}</span>
              <div>
                <h3 className="text-2xl mb-2">{title}</h3>
                <p className="body-copy text-xs">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function ProjectGallery() {
  const [active, setActive] = useState<number | null>(null);
  const current = active === null ? null : services[active];
  return (
    <section id="trabalho" className="section-space">
      <div className="page-width">
        <div className="flex flex-col md:flex-row gap-5 justify-between md:items-end mb-9">
          <div>
            <p className="eyebrow mb-4">O olhar para o acabamento</p>
            <h2 className="section-title">
              Cada detalhe
              <br />
              conta uma diferença.
            </h2>
          </div>
          <div className="max-w-[350px]">
            <p className="body-copy">
              Da recuperação da lataria ao cuidado com a pintura, conheça as áreas de atuação da
              BRS.
            </p>
            <p className="text-[10px] text-primary mt-3">
              Galeria ilustrativa · Não representa trabalhos realizados pela BRS.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <Button
              key={service.short}
              variant="ghost"
              className="p-0 h-auto rounded-sm overflow-hidden relative group block text-left"
              onClick={() => setActive(i)}
              aria-label={`Ampliar imagem ilustrativa de ${service.short}`}
            >
              <img
                className="gallery-image"
                src={serviceImages[i]}
                alt={`Detalhe de ${service.short.toLowerCase()} — imagem ilustrativa`}
                loading="lazy"
                width={1200}
                height={800}
              />
              <span className="absolute bottom-0 inset-x-0 bg-background/80 p-4 flex justify-between items-center text-xs">
                <span>{service.short}</span>
                <Expand size={15} />
              </span>
            </Button>
          ))}
        </div>
      </div>
      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent className="max-w-4xl w-[calc(100%-32px)] p-5">
          <DialogTitle>{current?.title}</DialogTitle>
          <DialogDescription>
            Imagem ilustrativa. Não representa um serviço executado pela BRS.
          </DialogDescription>
          {active !== null && (
            <img
              src={serviceImages[active]}
              alt={current?.title ?? "Atividade de reparação"}
              width={1200}
              height={800}
              className="w-full max-h-[65vh] object-contain"
            />
          )}
          <div className="flex justify-between">
            <Button
              variant="automotiveOutline"
              onClick={() => setActive((value) => ((value ?? 0) + 2) % 3)}
              aria-label="Imagem anterior"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="automotiveOutline"
              onClick={() => setActive((value) => ((value ?? 0) + 1) % 3)}
              aria-label="Próxima imagem"
            >
              <ChevronRight />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
export function ProcessTimeline() {
  const steps = [
    ["Primeiro contato", "Conte o que aconteceu e consulte como enviar fotos do veículo."],
    ["Avaliação", "Os danos são avaliados. Pode ser necessária uma análise presencial."],
    [
      "Orçamento e orientação",
      "Converse sobre o serviço, os custos e as condições antes da execução.",
    ],
    ["Reparação e entrega", "Combine os detalhes do reparo e as orientações para a entrega."],
  ];
  return (
    <section className="section-space bg-secondary/50 border-y border-border">
      <div className="page-width">
        <p className="eyebrow mb-4">Do primeiro contato à entrega</p>
        <h2 className="section-title mb-12">
          Um caminho mais claro.
          <br />
          <span className="text-muted-foreground">Uma decisão mais tranquila.</span>
        </h2>
        <div className="grid md:grid-cols-4">
          {steps.map(([title, copy], i) => (
            <div key={title} className="process-step">
              <span className="text-primary text-xs">0{i + 1}</span>
              <h3 className="text-2xl mt-3 mb-3">{title}</h3>
              <p className="body-copy text-xs">{copy}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-7">
          Etapas propostas de atendimento. Condições e prazos devem ser confirmados diretamente com
          a equipe.
        </p>
      </div>
    </section>
  );
}
export function PartnerSection({ onPartner }: { onPartner: () => void }) {
  return (
    <section id="corretores" className="section-space">
      <div className="page-width grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="relative">
          <img
            src={bodywork}
            alt="Atenção técnica na recuperação de um veículo — imagem ilustrativa"
            loading="lazy"
            width={1200}
            height={800}
            className="w-full aspect-[4/4] object-cover"
          />
          <span className="absolute bottom-4 right-4 image-note bg-background/80 px-2 py-1">
            Imagem ilustrativa
          </span>
          <span className="absolute top-5 left-5 bg-background/90 px-4 py-3 flex items-center gap-3 text-[10px]">
            <Handshake className="text-primary" size={19} /> Relações que geram confiança
          </span>
        </div>
        <div>
          <p className="eyebrow mb-5">Para corretores de seguros</p>
          <h2 className="section-title">
            Seu cliente precisa
            <br />
            de uma solução.
            <br />
            <span className="text-primary">
              Sua indicação,
              <br />
              de confiança.
            </span>
          </h2>
          <p className="body-copy mt-5">
            Indicar uma reparadora envolve a confiança do seu cliente e a qualidade percebida no
            atendimento. Vamos conversar sobre como construir essa relação.
          </p>
          <ul className="grid gap-4 my-7">
            {[
              "Comunicação próxima durante o atendimento",
              "Atenção à experiência do segurado",
              "Relacionamento profissional de longo prazo",
            ].map((item) => (
              <li key={item} className="text-xs flex gap-3 items-center">
                <Check className="text-primary" size={15} />
                {item}
              </li>
            ))}
          </ul>
          <Button variant="automotive" className="h-12 px-6 text-xs" onClick={onPartner}>
            Falar sobre parceria <ArrowUpRight />
          </Button>
        </div>
      </div>
    </section>
  );
}
export function Pickup() {
  return (
    <section className="border-y border-border bg-secondary">
      <div className="page-width py-10 flex flex-col md:flex-row md:items-center gap-7 justify-between">
        <div className="flex gap-6 items-start md:items-center">
          <Truck size={38} strokeWidth={1.2} className="text-primary shrink-0" />
          <div>
            <p className="eyebrow mb-2">Leva e traz</p>
            <h2 className="text-[30px]">Mais praticidade para cuidar do seu veículo.</h2>
            <p className="body-copy text-xs mt-2">
              Consulte as condições e a disponibilidade do serviço em Toledo e região.
            </p>
          </div>
        </div>
        <Button variant="automotiveOutline" asChild className="h-12 px-6 text-xs shrink-0">
          <a href={company.phoneHref}>
            Consultar disponibilidade <Phone />
          </a>
        </Button>
      </div>
    </section>
  );
}
export function About() {
  return (
    <section id="sobre" className="section-space">
      <div className="page-width grid md:grid-cols-[1.1fr_1fr] gap-12 md:gap-24 items-center">
        <div>
          <p className="eyebrow mb-5">BRS · Toledo / PR</p>
          <h2 className="section-title">
            Cuidado com seu veículo.
            <br />
            <span className="text-muted-foreground">Respeito pela sua confiança.</span>
          </h2>
          <p className="body-copy mt-6">
            A BRS Reparações Automotivas está em Toledo, Paraná, e atua com funilaria, pintura
            automotiva e martelinho de ouro. Qualidade, agilidade e atendimento cuidadoso fazem
            parte do seu posicionamento.
          </p>
          <p className="body-copy mt-4">
            Para você, proprietário, ou para quem indica a BRS: estamos disponíveis para conversar
            sobre a necessidade do seu veículo.
          </p>
          <Button variant="editorial" asChild className="mt-5 text-xs">
            <a href={company.instagram} {...external}>
              Conhecer a BRS no Instagram <ArrowUpRight />
            </a>
          </Button>
        </div>
        <div className="border-l border-primary pl-8 md:pl-12 py-6">
          <p className="font-display text-[80px] italic font-bold leading-none">
            BRS<span className="text-primary">.</span>
          </p>
          <p className="text-[11px] mt-4 text-muted-foreground uppercase tracking-[2px]">
            Reparações automotivas
          </p>
          <div className="mt-9 grid gap-5">
            <a href={company.phoneHref} className="flex items-center gap-3 text-sm">
              <Phone size={17} className="text-primary" />
              {company.phone}
            </a>
            <span className="flex items-center gap-3 text-sm">
              <MapPin size={17} className="text-primary" />
              {company.city}
            </span>
            <a href={company.instagram} {...external} className="flex items-center gap-3 text-sm">
              <Instagram size={17} className="text-primary" />
              @brsreparacoes
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
export function FAQAccordion() {
  const questions = [
    [
      "Quais serviços a BRS realiza?",
      "A BRS atua com funilaria automotiva, pintura automotiva e martelinho de ouro. A indicação do serviço depende da avaliação do veículo.",
    ],
    [
      "Como solicitar uma avaliação?",
      "Ligue para (45) 2035-9440 ou entre em contato pelo Instagram oficial @brsreparacoes. Conte o que aconteceu para receber orientações.",
    ],
    [
      "Posso enviar fotos do veículo?",
      "Consulte pelo Instagram como encaminhar as fotos. Elas podem ajudar no primeiro contato, mas não substituem uma avaliação presencial quando necessária.",
    ],
    [
      "A BRS atende corretores de seguros?",
      "A BRS está disponível para conversar com corretores sobre possíveis parcerias e atendimento de segurados. Condições devem ser tratadas diretamente com a empresa.",
    ],
    [
      "Como funciona o serviço de leva e traz?",
      "A BRS divulga o serviço de leva e traz. Entre em contato para confirmar disponibilidade, local de atendimento e condições.",
    ],
    [
      "Como saber o prazo de reparação?",
      "O prazo depende do dano e do serviço necessário. Consulte a equipe após a avaliação; não há prazo fixo informado neste site.",
    ],
    [
      "Como entrar em contato?",
      "O telefone divulgado é (45) 2035-9440 e o Instagram oficial é @brsreparacoes. O atendimento via WhatsApp neste número ainda não foi confirmado.",
    ],
  ];
  return (
    <section className="section-space border-y border-border bg-secondary/40">
      <div className="page-width grid md:grid-cols-[.8fr_1.2fr] gap-10 md:gap-20">
        <div>
          <p className="eyebrow mb-5">Suas dúvidas</p>
          <h2 className="section-title">
            Informação clara.
            <br />
            <span className="text-muted-foreground">Desde o início.</span>
          </h2>
          <p className="body-copy mt-5">
            Cada veículo tem uma necessidade.
            <br />
            Converse com a BRS para saber mais.
          </p>
        </div>
        <Accordion type="single" collapsible>
          {questions.map(([question, answer], i) => (
            <AccordionItem value={`faq-${i}`} key={question}>
              <AccordionTrigger className="py-5 text-xs gap-5">{question}</AccordionTrigger>
              <AccordionContent className="body-copy text-xs pr-8">{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
const initialValues: ContactValues = {
  name: "",
  phone: "",
  vehicle: "",
  service: "",
  description: "",
  audience: "particular",
};
export function ContactForm({ partner }: { partner: boolean }) {
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactValues, string>>>({});
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  useEffect(() => {
    if (partner) setValues((v) => ({ ...v, audience: "corretor" }));
  }, [partner]);
  const update = (field: keyof ContactValues, value: string) =>
    setValues((v) => ({ ...v, [field]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const validation = validateContact(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setCopied(false);
    setCopyError(false);
    setMessage(contactMessage(values));
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
          {[
            ["name", "Seu nome *", "Como podemos chamar você?", "text"],
            ["phone", "Telefone com DDD *", "(45) 00000-0000", "tel"],
            ["vehicle", "Modelo do veículo", "Ex.: Volkswagen Polo", "text"],
          ].map(([field, label, placeholder, type]) => (
            <label className="form-field" key={field}>
              {label}
              <input
                className="field-input"
                value={values[field as keyof ContactValues]}
                onChange={(e) => update(field as keyof ContactValues, e.target.value)}
                type={type}
                placeholder={placeholder}
                autoComplete={field === "name" ? "name" : field === "phone" ? "tel" : "off"}
                aria-invalid={Boolean(errors[field as keyof ContactValues])}
                aria-describedby={
                  errors[field as keyof ContactValues] ? `${field}-error` : undefined
                }
              />
              {errors[field as keyof ContactValues] && (
                <span id={`${field}-error`} role="alert" className="text-destructive">
                  {errors[field as keyof ContactValues]}
                </span>
              )}
            </label>
          ))}
          <label className="form-field">
            Serviço desejado
            <select
              className="field-input"
              value={values.service}
              onChange={(e) => update("service", e.target.value)}
            >
              <option value="">Preciso de orientação</option>
              {services.map((s) => (
                <option key={s.short}>{s.short}</option>
              ))}
            </select>
          </label>
        </div>
        <fieldset>
          <legend className="text-[11px] mb-3">Tipo de atendimento</legend>
          <div className="flex flex-wrap gap-5">
            {[
              ["particular", "Particular"],
              ["seguro", "Relacionado a seguro"],
              ["corretor", "Sou corretor"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-[10px]">
                <input
                  type="radio"
                  name="audience"
                  value={value}
                  checked={values.audience === value}
                  onChange={() => update("audience", value ?? "particular")}
                  className="accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="form-field">
          Conte o que você precisa *
          <textarea
            className="field-input resize-y min-h-24"
            placeholder={
              partner
                ? "Conte sobre a parceria que deseja conversar."
                : "Descreva brevemente o dano ou a sua necessidade."
            }
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "description-error" : undefined}
          />
          {errors.description && (
            <span id="description-error" role="alert" className="text-destructive">
              {errors.description}
            </span>
          )}
        </label>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Seus dados não são armazenados. Prepare a mensagem e envie pelo Instagram da BRS. Este
          formulário não realiza envio automático.
        </p>
        <Button type="submit" variant="automotive" className="h-12 text-xs">
          Preparar mensagem <ArrowUpRight />
        </Button>
      </form>
      <Dialog
        open={Boolean(message)}
        onOpenChange={(open) => {
          if (!open) setMessage("");
        }}
      >
        <DialogContent className="w-[calc(100%-32px)] max-h-[90vh] overflow-y-auto">
          <DialogTitle>Mensagem pronta para você enviar</DialogTitle>
          <DialogDescription>
            Copie a mensagem, abra o perfil da BRS e cole em uma conversa no Instagram. Nenhuma
            solicitação foi enviada ainda.
          </DialogDescription>
          <textarea
            aria-label="Mensagem preparada"
            readOnly
            value={message}
            className="field-input min-h-48 text-xs"
          />
          <Button variant="automotiveOutline" onClick={copy}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Mensagem copiada" : "Copiar mensagem"}
          </Button>
          {copyError && (
            <p role="alert" className="text-xs text-destructive">
              Não foi possível copiar automaticamente. Selecione e copie o texto acima.
            </p>
          )}
          <Button variant="automotive" asChild>
            <a href={company.instagram} {...external}>
              Abrir Instagram da BRS <Instagram />
            </a>
          </Button>
          <p className="text-[10px] text-muted-foreground">
            Prefere falar com a equipe?{" "}
            <a className="underline" href={company.phoneHref}>
              Ligue {company.phone}
            </a>
            .
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function Contact({ partner }: { partner: boolean }) {
  return (
    <section id="contato" className="section-space">
      <div className="page-width grid md:grid-cols-2 gap-12 md:gap-24">
        <div>
          <p className="eyebrow mb-5">Vamos conversar</p>
          <h2 className="section-title">
            O primeiro passo
            <br />é uma boa conversa.
          </h2>
          <p className="body-copy mt-5 max-w-[360px]">
            Conte à BRS o que aconteceu e solicite orientações sobre a avaliação do seu veículo.
          </p>
          <a href={company.phoneHref} className="flex items-center gap-4 mt-9">
            <span className="border border-border p-3">
              <Phone size={21} className="text-primary" />
            </span>
            <span>
              <span className="block text-[10px] text-muted-foreground mb-1">Ligue para a BRS</span>
              <span className="font-display text-3xl">{company.phone}</span>
            </span>
          </a>
          <a href={company.instagram} {...external} className="flex items-center gap-4 mt-6">
            <span className="border border-border p-3">
              <Instagram size={21} className="text-primary" />
            </span>
            <span>
              <span className="block text-[10px] text-muted-foreground mb-1">Nosso Instagram</span>
              <span className="text-sm">
                @brsreparacoes <ArrowUpRight size={13} className="inline" />
              </span>
            </span>
          </a>
          <p className="text-[11px] text-muted-foreground mt-8 flex gap-2 items-center">
            <MapPin size={14} /> Toledo, Paraná
          </p>
        </div>
        <ContactForm partner={partner} />
      </div>
    </section>
  );
}
export function FinalCTA() {
  return (
    <section className="final-band border-t border-border">
      <img src={hero} alt="" loading="lazy" width={1920} height={1088} />
      <div className="page-width relative z-10 text-center">
        <p className="eyebrow justify-center mb-5">Seu veículo. Nossa atenção.</p>
        <h2 className="section-title">
          Vamos encontrar a melhor
          <br />
          solução para o seu veículo?
        </h2>
        <p className="body-copy mt-5">Conte com a BRS para orientar o próximo passo.</p>
        <div className="flex flex-wrap gap-3 justify-center mt-7">
          <Button variant="automotive" asChild className="h-12 px-6 text-xs">
            <a href="#contato">
              Solicitar avaliação <ArrowUpRight />
            </a>
          </Button>
          <Button variant="automotiveOutline" asChild className="h-12 px-6 text-xs">
            <a href={company.instagram} {...external}>
              <Instagram /> Conhecer o Instagram
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="page-width py-14 grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10">
        <div className="col-span-2 md:col-span-1">
          <Brand />
          <p className="body-copy text-[11px] max-w-[240px] mt-5">
            Reparação automotiva com atenção aos detalhes e cuidado no atendimento.
          </p>
        </div>
        <div>
          <h3 className="font-sans text-xs font-semibold">Explore</h3>
          {navigation.slice(0, 5).map(([label, href]) => (
            <a className="footer-link" key={href} href={href}>
              {label}
            </a>
          ))}
        </div>
        <div>
          <h3 className="font-sans text-xs font-semibold">Serviços</h3>
          {services.map((s) => (
            <a className="footer-link" href="#servicos" key={s.short}>
              {s.short}
            </a>
          ))}
          <a href={company.phoneHref} className="footer-link">
            Leva e traz
          </a>
        </div>
        <div>
          <h3 className="font-sans text-xs font-semibold">Fale com a BRS</h3>
          <a className="footer-link" href={company.phoneHref}>
            {company.phone}
          </a>
          <span className="footer-link">Toledo, Paraná</span>
          <a className="footer-link flex items-center gap-2" href={company.instagram} {...external}>
            <Instagram size={13} /> @brsreparacoes
          </a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="page-width py-5 flex flex-col sm:flex-row justify-between gap-4 text-[9px] text-muted-foreground">
          <span>© 2026 BRS Reparações Automotivas.</span>
          <span>
            Demonstração institucional · Fotografias ilustrativas e apresentação tipográfica
            provisória.
          </span>
        </div>
      </div>
    </footer>
  );
}
export function Website() {
  const [partner, setPartner] = useState(false);
  const partnerContact = () => {
    setPartner(true);
    document.getElementById("contato")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };
  return (
    <>
      <a
        href="#servicos"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-primary text-primary-foreground p-3"
      >
        Ir para o conteúdo
      </a>
      <Header />
      <main>
        <Hero />
        <Services />
        <Philosophy />
        <ProjectGallery />
        <ProcessTimeline />
        <PartnerSection onPartner={partnerContact} />
        <Pickup />
        <About />
        <FAQAccordion />
        <Contact partner={partner} />
        <FinalCTA />
      </main>
      <Footer />
      <Button
        variant="automotive"
        size="icon"
        asChild
        className="fixed bottom-5 right-5 z-20 size-12 rounded-full shadow-lg md:hidden"
      >
        <a href={company.phoneHref} aria-label="Ligar para BRS">
          <Phone />
        </a>
      </Button>
    </>
  );
}
