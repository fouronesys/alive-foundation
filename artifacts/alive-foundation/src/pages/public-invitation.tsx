import { useState } from "react";
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
import { CheckCircle2, Sparkles, Heart, Users, Gift } from "lucide-react";
import logo from "@/assets/logo.jpg";

type PlanId = "comunidad" | "inclusion" | "impacto" | "especie";

interface Plan {
  id: PlanId;
  name: string;
  price: string;
  tagline: string;
  highlights: string[];
  icon: typeof Heart;
  accent: string;
  border: string;
  ring: string;
}

const PLANS: Plan[] = [
  {
    id: "comunidad",
    name: "Patrocinador Comunidad",
    price: "RD$ 50,000",
    tagline: "Súmate al movimiento y haz que muchas familias vivan el festival.",
    highlights: [
      "Logo en murales de agradecimiento",
      "Menciones en redes sociales",
      "5 invitaciones VIP al evento",
    ],
    icon: Heart,
    accent: "bg-brand-yellow",
    border: "border-brand-yellow",
    ring: "ring-brand-yellow",
  },
  {
    id: "inclusion",
    name: "Patrocinador Inclusión",
    price: "RD$ 150,000",
    tagline: "Apoya talleres y actividades inclusivas durante el festival.",
    highlights: [
      "Logo destacado en tarima y material",
      "Espacio activo de marca en el festival",
      "15 invitaciones VIP + reconocimiento",
    ],
    icon: Users,
    accent: "bg-brand-aqua",
    border: "border-brand-aqua",
    ring: "ring-brand-aqua",
  },
  {
    id: "impacto",
    name: "Patrocinador Impacto",
    price: "RD$ 300,000",
    tagline: "Lidera el cambio: tu marca al frente de la inclusión en RD.",
    highlights: [
      "Marca presentadora del Festival",
      "Logo en todo el material y prensa",
      "30 invitaciones VIP + activación principal",
    ],
    icon: Sparkles,
    accent: "bg-brand-orange",
    border: "border-brand-orange",
    ring: "ring-brand-orange",
  },
  {
    id: "especie",
    name: "Patrocinador en Especie",
    price: "Aporte en especie",
    tagline: "Aporta productos, servicios o logística para el festival.",
    highlights: [
      "Logo según valor del aporte",
      "Menciones y reconocimiento público",
      "Invitaciones VIP según aporte",
    ],
    icon: Gift,
    accent: "bg-brand-navy",
    border: "border-brand-navy",
    ring: "ring-brand-navy",
  },
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

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center">
        <p className="text-muted-foreground">Cargando invitación…</p>
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
    <div className="min-h-[calc(100vh-180px)] bg-gradient-to-br from-brand-aqua/10 via-white to-brand-orange/10 py-10 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Hero invitation card */}
        <Card className="overflow-hidden border-2 border-brand-orange/30 shadow-2xl">
          <div className="bg-gradient-to-br from-brand-navy via-brand-navy to-brand-aqua/80 text-white p-8 sm:p-12 text-center relative">
            <div className="absolute top-4 right-4">
              <Badge className="bg-brand-yellow text-brand-navy border-0 font-bold uppercase tracking-wide">
                Festival de la Inclusión 2026
              </Badge>
            </div>
            <img
              src={logo}
              alt="Alive Foundation"
              className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-xl mx-auto mb-5"
            />
            <p className="uppercase text-xs tracking-[0.3em] text-brand-yellow font-bold mb-2">
              {invitation.sponsorType === "returning"
                ? "Para nuestro aliado de siempre"
                : "Una invitación especial para"}
            </p>
            <h1 className="font-heading text-3xl sm:text-5xl font-black leading-tight">
              {invitation.recipientCompany}
            </h1>
            {invitation.contactName && (
              <p className="text-white/80 mt-2 text-lg">
                A la atención de {invitation.contactName}
              </p>
            )}
          </div>
          <CardContent className="p-6 sm:p-10 space-y-4">
            <p className="text-brand-navy text-lg leading-relaxed">
              {invitation.sponsorType === "returning" ? (
                <>
                  Gracias por seguir caminando con nosotros. Tu compromiso de
                  años ha hecho posible que miles de familias en República
                  Dominicana vivan momentos de inclusión, alegría y comunidad.
                  Queremos contarte sobre el <strong>Festival de la Inclusión 2026</strong> y
                  cómo nos encantaría que vuelvas a ser parte.
                </>
              ) : (
                <>
                  Desde <strong>Alive Foundation</strong> queremos contarte sobre el{" "}
                  <strong>Festival de la Inclusión 2026</strong>, una celebración
                  donde cada persona, familia y comunidad tiene un lugar. Nos
                  encantaría sumar tu marca a esta historia de impacto en
                  República Dominicana.
                </>
              )}
            </p>
            {invitation.customMessage && (
              <div className="rounded-xl bg-brand-yellow/15 border-l-4 border-brand-yellow p-4">
                <p className="text-brand-navy italic">{invitation.customMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Confirmed state */}
        {isConfirmed && confirmedPlan && (
          <Card className="border-2 border-green-500/40 bg-green-50/50 shadow-lg">
            <CardContent className="p-8 text-center space-y-3">
              <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto" />
              <h2 className="font-heading text-2xl font-bold text-brand-navy">
                ¡Gracias por confirmar tu apoyo!
              </h2>
              <p className="text-brand-navy">
                Elegiste el plan <strong>{confirmedPlan.name}</strong>
                {invitation.inKindType && (
                  <> con aporte: <strong>{invitation.inKindType}</strong></>
                )}
                . Nuestro equipo te contactará muy pronto para coordinar los
                próximos pasos.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Plan selection */}
        {!isConfirmed && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-heading text-3xl font-black text-brand-navy">
                Elige cómo quieres acompañarnos
              </h2>
              <p className="text-muted-foreground">
                Selecciona el plan que mejor represente tu compromiso con la inclusión.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                const isSelected = selectedPlan === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      setSubmitError(null);
                    }}
                    className={`text-left rounded-2xl border-2 bg-white p-6 transition-all hover:shadow-lg ${
                      isSelected
                        ? `${plan.border} shadow-xl ring-4 ${plan.ring}/20`
                        : "border-brand-navy/10 hover:border-brand-navy/30"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${plan.accent} text-white shrink-0`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-bold text-lg text-brand-navy">
                          {plan.name}
                        </h3>
                        <p className="text-brand-orange font-black text-xl mt-0.5">
                          {plan.price}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {plan.tagline}
                        </p>
                        <ul className="mt-3 space-y-1.5">
                          {plan.highlights.map((h) => (
                            <li
                              key={h}
                              className="text-sm text-brand-navy flex items-start gap-2"
                            >
                              <CheckCircle2 className="h-4 w-4 text-brand-aqua shrink-0 mt-0.5" />
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
              <div className="rounded-xl border-2 border-brand-navy/15 bg-white p-5 space-y-2 max-w-2xl mx-auto">
                <Label htmlFor="inKindType">
                  Cuéntanos qué aporte en especie ofreces
                </Label>
                <Input
                  id="inKindType"
                  value={inKindType}
                  onChange={(e) => setInKindType(e.target.value)}
                  placeholder="Ej: Catering, transporte, equipos de sonido…"
                />
              </div>
            )}

            {submitError && (
              <p className="text-center text-sm text-red-600">{submitError}</p>
            )}

            <div className="text-center">
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
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-full px-10 h-14 text-base shadow-lg"
              >
                {confirmMutation.isPending
                  ? "Confirmando…"
                  : "Confirmar mi patrocinio"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
