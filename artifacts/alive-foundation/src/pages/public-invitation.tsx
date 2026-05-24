import { useState } from "react";
import AnimatedLogo from "@/components/AnimatedLogo";
import { useRoute } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetInvitationByToken,
  useConfirmInvitation,
  getGetInvitationByTokenQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Sparkles,
  Heart,
  Users,
  Gift,
  Calendar,
  Clock,
  MapPin,
  Star,
  HandHeart,
  Phone,
  Mail,
} from "lucide-react";
import logo from "@/assets/logo.jpg";
import festivalImage from "@assets/IMG-20260521-WA0017_1779575433983.jpg";

type PlanId = "comunidad" | "inclusion" | "impacto" | "especie";

interface Plan {
  id: PlanId;
  name: string;
  price: string;
  tagline: string;
  inheritsFrom?: string;
  highlights: string[];
  icon: typeof Heart;
  bgClass: string;
  borderClass: string;
  ringClass: string;
  textClass: string;
}

const PLANS: Plan[] = [
  {
    id: "comunidad",
    name: "Plan Comunidad",
    price: "RD$ 20,000",
    tagline: "Sumando oportunidades",
    highlights: [
      "Logo en pantalla de patrocinadores",
      "Mención en redes sociales",
      "Logo en brochure digital",
      "Certificado de patrocinio",
      "Presencia en agradecimiento oficial",
    ],
    icon: Heart,
    bgClass: "bg-brand-aqua",
    borderClass: "border-brand-aqua",
    ringClass: "ring-brand-aqua",
    textClass: "text-brand-aqua",
  },
  {
    id: "inclusion",
    name: "Plan Inclusión",
    price: "RD$ 50,000",
    tagline: "Haciendo visible el cambio",
    inheritsFrom: "Plan Comunidad",
    highlights: [
      "Logo en materiales impresos",
      "Presencia en backdrop oficial",
      "Espacio para stand promocional",
      "Mención durante el evento",
      "Inclusión en campaña digital del festival",
    ],
    icon: Users,
    bgClass: "bg-brand-orange",
    borderClass: "border-brand-orange",
    ringClass: "ring-brand-orange",
    textClass: "text-brand-orange",
  },
  {
    id: "impacto",
    name: "Plan Impacto",
    price: "RD$ 100,000",
    tagline: "Transformando vidas juntos",
    inheritsFrom: "Plan Inclusión",
    highlights: [
      "Logo destacado como patrocinador principal",
      "Presencia preferencial en vallas",
      "Branding en área estratégica del festival",
      "Participación destacada en publicaciones",
      "Entrevistas o menciones especiales",
      "Inclusión destacada en media/reel recap",
      "Reconocimiento especial durante apertura",
    ],
    icon: Sparkles,
    bgClass: "bg-brand-yellow",
    borderClass: "border-brand-yellow",
    ringClass: "ring-brand-yellow",
    textClass: "text-brand-yellow",
  },
  {
    id: "especie",
    name: "Aliado en Especie",
    price: "Aporte en especie",
    tagline:
      "Agua, alimentos, impresión, sonido, mobiliario, transporte, regalos, terapias o fotografía.",
    highlights: [
      "Reconocimiento público acorde al aporte",
      "Logo según valor de la contribución",
      "Menciones en agradecimiento oficial",
    ],
    icon: Gift,
    bgClass: "bg-brand-navy",
    borderClass: "border-brand-navy",
    ringClass: "ring-brand-navy",
    textClass: "text-brand-navy",
  },
];

const IMPACT_STATS = [
  { value: "+1,500", label: "asistentes esperados", icon: Users },
  { value: "+300", label: "familias impactadas", icon: Heart },
  { value: "+120", label: "voluntarios", icon: HandHeart },
];

export default function PublicInvitation() {
  const [, params] = useRoute("/invitacion/:token");
  const token = params?.token ?? "";
  const queryClient = useQueryClient();
  const { data: invitation, isLoading, error } = useGetInvitationByToken(token, {
    query: {
      queryKey: getGetInvitationByTokenQueryKey(token),
      enabled: !!token,
    },
  });

  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [inKindType, setInKindType] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [introDone, setIntroDone] = useState(false);

  const confirmMutation = useConfirmInvitation({
    mutation: {
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: getGetInvitationByTokenQueryKey(token),
        }),
      onError: (err) => {
        const status = (err as { status?: number } | null)?.status;
        if (status === 409) {
          setSubmitError(
            "Esta invitación ya fue confirmada anteriormente. Contacta al equipo para hacer cambios.",
          );
          queryClient.invalidateQueries({
            queryKey: getGetInvitationByTokenQueryKey(token),
          });
        } else {
          setSubmitError("No pudimos guardar tu respuesta. Intenta de nuevo.");
        }
      },
    },
  });

  if (isLoading || !introDone) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center gap-6 px-4 bg-gradient-to-b from-brand-navy via-brand-navy to-[#0d1a2e]">
        <AnimatedLogo
          size={140}
          loop={false}
          onComplete={() => setIntroDone(true)}
        />
        <div className="text-center space-y-1">
          <p className="text-white font-heading text-xl font-semibold tracking-wide">
            Alive Foundation
          </p>
          <p className="text-white/60 text-sm italic">
            haciendo de la inclusión una realidad
          </p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center border-2 border-brand-navy/10">
          <CardContent className="pt-8 pb-8 space-y-3">
            <h1 className="font-heading text-2xl font-bold text-brand-navy">
              Invitación no encontrada
            </h1>
            <p className="text-muted-foreground">
              Este enlace no es válido o ha sido eliminado. Si crees que es un
              error, contacta al equipo de Alive Foundation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isConfirmed = invitation.status === "confirmed";
  const confirmedPlan = isConfirmed
    ? PLANS.find((p) => p.id === invitation.selectedPlan)
    : null;

  return (
    <div className="bg-gradient-to-b from-brand-navy via-brand-navy to-[#0d1a2e] pb-16">
      {/* HERO INVITATION — full-bleed photo + dark veil + brand frame */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={festivalImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/95 via-brand-navy/85 to-brand-aqua/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent" />
        </div>

        {/* Decorative shapes */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-orange/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-yellow/20 blur-3xl" />

        <div className="relative container mx-auto max-w-4xl px-4 py-16 sm:py-24">
          <div className="text-center">
            <Badge className="bg-brand-yellow text-brand-navy border-0 font-bold uppercase tracking-widest text-xs px-4 py-1.5 mb-6">
              Invitación oficial · Festival 2026
            </Badge>

            <img
              src={logo}
              alt="Alive Foundation"
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover border-4 border-white shadow-2xl mx-auto mb-6"
            />

            <p className="uppercase text-[11px] sm:text-xs tracking-[0.3em] text-brand-yellow font-bold mb-3">
              {invitation.sponsorType === "returning"
                ? "Para nuestro aliado de siempre"
                : "Una invitación especial para"}
            </p>

            <h1 className="font-heading text-4xl sm:text-6xl font-black leading-[1.05] text-white drop-shadow-lg">
              {invitation.recipientCompany}
            </h1>

            {invitation.contactName && (
              <p className="text-white/85 mt-3 text-base sm:text-lg">
                A la atención de <strong className="text-white">{invitation.contactName}</strong>
              </p>
            )}

            {/* Slogan */}
            <p className="font-heading italic text-brand-aqua text-lg sm:text-xl mt-8">
              "haciendo de la inclusión una realidad"
            </p>
          </div>
        </div>

        {/* Wave divider */}
        <svg
          className="absolute bottom-0 left-0 w-full text-white"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ height: "40px" }}
        >
          <path
            fill="currentColor"
            d="M0,32 C320,80 720,0 1440,40 L1440,60 L0,60 Z"
          />
        </svg>
      </section>

      {/* WHITE BODY */}
      <div className="bg-white">
        <div className="container mx-auto max-w-4xl px-4 py-10 sm:py-14 space-y-10">
          {/* Personal message + event details */}
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
            <Card className="border-2 border-brand-orange/20 shadow-md overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-brand-orange via-brand-yellow to-brand-aqua" />
              <CardContent className="p-6 sm:p-8 space-y-4">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-navy">
                  {invitation.sponsorType === "returning"
                    ? "Gracias por seguir caminando con nosotros"
                    : "Te invitamos a ser parte"}
                </h2>
                <p className="text-brand-navy/90 leading-relaxed">
                  {invitation.sponsorType === "returning" ? (
                    <>
                      Tu compromiso de años ha hecho posible que miles de
                      familias en República Dominicana vivan momentos de
                      inclusión, alegría y comunidad. Queremos contarte sobre el{" "}
                      <strong>Festival de la Inclusión 2026</strong> y cómo nos
                      encantaría que vuelvas a ser parte.
                    </>
                  ) : (
                    <>
                      Desde <strong>Alive Foundation</strong> queremos contarte
                      sobre el <strong>Festival de la Inclusión 2026</strong>,
                      una celebración donde cada persona, familia y comunidad
                      tiene un lugar. Nos encantaría sumar tu marca a esta
                      historia de impacto en República Dominicana.
                    </>
                  )}
                </p>

                {invitation.customMessage && (
                  <div className="rounded-xl bg-brand-yellow/15 border-l-4 border-brand-yellow p-4">
                    <p className="text-brand-navy italic leading-relaxed">
                      {invitation.customMessage}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event details box */}
            <Card className="border-2 border-brand-navy/10 bg-gradient-to-br from-brand-navy to-[#0d1a2e] text-white shadow-md">
              <CardContent className="p-6 sm:p-7 space-y-5">
                <p className="text-xs uppercase tracking-widest font-bold text-brand-yellow">
                  Detalles del evento
                </p>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">11 de Octubre, 2026</p>
                    <p className="text-xs text-white/70">Domingo</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-brand-yellow shrink-0 mt-0.5" />
                  <p className="font-bold">10:00 a.m. – 2:00 p.m.</p>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-brand-aqua shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold leading-snug">
                      Parque Infantil del Jardín Botánico Prof. Eugenio de Jesús Marcano
                    </p>
                    <p className="text-xs text-white/70 mt-0.5">Santiago, RD</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {IMPACT_STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="rounded-2xl border-2 border-brand-navy/10 bg-white p-4 sm:p-5 text-center"
                >
                  <Icon className="h-6 w-6 mx-auto text-brand-orange mb-2" />
                  <p className="font-heading text-2xl sm:text-3xl font-black text-brand-navy leading-none">
                    {s.value}
                  </p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-1.5 uppercase tracking-wide font-semibold">
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Confirmed state */}
          {isConfirmed && confirmedPlan && (
            <Card className="border-2 border-green-500/40 bg-gradient-to-br from-green-50 to-white shadow-lg">
              <CardContent className="p-8 text-center space-y-3">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-9 w-9 text-green-600" />
                </div>
                <h2 className="font-heading text-2xl font-black text-brand-navy">
                  ¡Gracias por confirmar tu apoyo!
                </h2>
                <p className="text-brand-navy">
                  Elegiste el plan <strong>{confirmedPlan.name}</strong>
                  {invitation.inKindType && (
                    <>
                      {" "}con aporte: <strong>{invitation.inKindType}</strong>
                    </>
                  )}
                  . Nuestro equipo te contactará muy pronto para coordinar los
                  próximos pasos.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Plan selection */}
          {!isConfirmed && (
            <div className="space-y-6" id="planes">
              <div className="text-center space-y-2 pt-2">
                <p className="text-xs uppercase tracking-widest font-bold text-brand-orange">
                  Planes de patrocinio
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl font-black text-brand-navy">
                  Elige cómo quieres acompañarnos
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Selecciona el plan que mejor represente tu compromiso con la inclusión.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {PLANS.map((plan) => {
                  const Icon = plan.icon;
                  const isSelected = selectedPlan === plan.id;
                  const isFeatured = plan.id === "impacto";
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        setSubmitError(null);
                      }}
                      className={`relative text-left rounded-2xl border-2 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl overflow-hidden ${
                        isSelected
                          ? `${plan.borderClass} shadow-2xl ring-4 ${plan.ringClass}/20`
                          : "border-brand-navy/10 hover:border-brand-navy/30"
                      }`}
                    >
                      {isFeatured && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-brand-yellow text-brand-navy border-0 font-bold text-[10px] uppercase tracking-wider gap-1">
                            <Star className="h-3 w-3 fill-brand-navy" />
                            Recomendado
                          </Badge>
                        </div>
                      )}

                      {isSelected && (
                        <div className="absolute top-3 left-3">
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full ${plan.bgClass} shadow`}>
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${plan.bgClass} text-white shrink-0 shadow-lg`}
                        >
                          <Icon className="h-7 w-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading font-bold text-lg text-brand-navy">
                            {plan.name}
                          </h3>
                          <p className={`font-black text-2xl mt-0.5 ${plan.textClass}`}>
                            {plan.price}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            {plan.tagline}
                          </p>
                          {plan.inheritsFrom && (
                            <p className="text-xs font-semibold text-brand-navy mt-2 bg-brand-navy/5 rounded-md px-2 py-1 inline-block">
                              Todo lo del {plan.inheritsFrom} +
                            </p>
                          )}
                          <ul className="mt-3 space-y-1.5">
                            {plan.highlights.map((h) => (
                              <li
                                key={h}
                                className="text-sm text-brand-navy/90 flex items-start gap-2"
                              >
                                <CheckCircle2 className={`h-4 w-4 ${plan.textClass} shrink-0 mt-0.5`} />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedPlan === "especie" && (
                <div className="rounded-xl border-2 border-brand-navy/15 bg-brand-navy/5 p-5 space-y-2 max-w-2xl mx-auto">
                  <Label htmlFor="inKindType" className="font-bold text-brand-navy">
                    Cuéntanos qué aporte en especie ofreces
                  </Label>
                  <Input
                    id="inKindType"
                    value={inKindType}
                    onChange={(e) => setInKindType(e.target.value)}
                    placeholder="Ej: Catering, transporte, equipos de sonido…"
                    className="bg-white"
                  />
                </div>
              )}

              {submitError && (
                <p className="text-center text-sm text-red-600 font-medium">{submitError}</p>
              )}

              <div className="text-center pt-2">
                <Button
                  size="lg"
                  disabled={
                    !selectedPlan ||
                    confirmMutation.isPending ||
                    (selectedPlan === "especie" && !inKindType.trim())
                  }
                  onClick={() => {
                    if (!selectedPlan) return;
                    setSubmitError(null);
                    confirmMutation.mutate({
                      token,
                      data: {
                        plan: selectedPlan,
                        inKindType:
                          selectedPlan === "especie" ? inKindType.trim() : null,
                      },
                    });
                  }}
                  className="bg-gradient-to-r from-brand-orange to-brand-yellow hover:from-brand-orange/90 hover:to-brand-yellow/90 text-white font-bold rounded-full px-12 h-14 text-base shadow-xl"
                >
                  {confirmMutation.isPending
                    ? "Confirmando…"
                    : selectedPlan
                      ? `Confirmar ${PLANS.find((p) => p.id === selectedPlan)?.name}`
                      : "Elige un plan para confirmar"}
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Al confirmar, nuestro equipo te contactará para coordinar los próximos pasos.
                </p>
                <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-sm text-brand-navy/80">
                  <a
                    href="tel:+18495398669"
                    className="inline-flex items-center gap-2 hover:text-brand-orange transition-colors"
                  >
                    <Phone className="h-4 w-4 text-brand-orange" />
                    <span className="font-semibold">+1 (849) 539-8669</span>
                  </a>
                  <span className="hidden sm:inline text-brand-navy/30">·</span>
                  <a
                    href="mailto:alivefoundationdr@gmail.com"
                    className="inline-flex items-center gap-2 hover:text-brand-orange transition-colors"
                  >
                    <Mail className="h-4 w-4 text-brand-orange" />
                    <span>alivefoundationdr@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
