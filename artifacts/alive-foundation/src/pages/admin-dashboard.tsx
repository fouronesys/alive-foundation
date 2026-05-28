import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminMe,
  useAdminLogout,
  useListInvitations,
  useCreateInvitation,
  useDeleteInvitation,
  getListInvitationsQueryKey,
  getAdminMeQueryKey,
} from "@workspace/api-client-react";
import type { Invitation } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, Link2, LogOut, Plus, Trash2, Check, Mail, Calendar, TrendingUp, Clock, CheckCircle2, Send } from "lucide-react";

const PUBLIC_DOMAIN =
  typeof window !== "undefined" ? window.location.origin : "";

const PLAN_LABELS: Record<string, string> = {
  comunidad: "Plan Comunidad",
  inclusion: "Plan Inclusión",
  impacto: "Plan Impacto",
  especie: "Aliado en Especie",
};

const PLAN_VALUES: Record<string, number> = {
  comunidad: 20000,
  inclusion: 50000,
  impacto: 100000,
  especie: 0,
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("es-DO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  }).format(amount);
}

const STATUS_BADGES: Record<
  string,
  { label: string; className: string }
> = {
  pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  confirmed: { label: "Confirmado", className: "bg-green-100 text-green-800 border-green-300" },
  declined: { label: "Rechazado", className: "bg-red-100 text-red-800 border-red-300" },
};

function buildInvitationUrl(token: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const isLocalOrPreview =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".replit.dev") ||
    host.endsWith(".replit.app") ||
    host.endsWith(".repl.co");
  const origin = isLocalOrPreview && typeof window !== "undefined"
    ? window.location.origin
    : PUBLIC_DOMAIN;
  return `${origin}${base}/invitacion/${token}`;
}

function CopyLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const url = buildInvitationUrl(token);
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          window.prompt("Copia el enlace:", url);
        }
      }}
      className="gap-2"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "¡Copiado!" : "Copiar enlace"}
    </Button>
  );
}

function ResendButton({ inv }: { inv: Invitation }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!inv.contactEmail) return null;

  async function handleResend() {
    setState("sending");
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/admin/invitations/${inv.id}/send`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { message?: string }).message ?? "Error al enviar");
      }
      setState("sent");
      setTimeout(() => setState("idle"), 3000);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Error al enviar");
      setState("error");
      setTimeout(() => setState("idle"), 4000);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        size="sm"
        variant="outline"
        disabled={state === "sending" || state === "sent"}
        onClick={handleResend}
        className={
          state === "sent"
            ? "gap-2 text-green-600 border-green-300 hover:text-green-600"
            : state === "error"
              ? "gap-2 text-red-600 border-red-300 hover:text-red-600"
              : "gap-2"
        }
      >
        {state === "sent" ? (
          <><Check className="h-3.5 w-3.5" /> ¡Enviado!</>
        ) : state === "sending" ? (
          <><Send className="h-3.5 w-3.5 animate-pulse" /> Enviando…</>
        ) : (
          <><Send className="h-3.5 w-3.5" /> Reenviar</>
        )}
      </Button>
      {state === "error" && errorMsg && (
        <p className="text-xs text-red-600">{errorMsg}</p>
      )}
    </div>
  );
}

function InvitationRow({ inv }: { inv: Invitation }) {
  const queryClient = useQueryClient();
  const url = buildInvitationUrl(inv.token);
  const deleteMutation = useDeleteInvitation({
    mutation: {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: getListInvitationsQueryKey() }),
    },
  });
  const statusBadge = STATUS_BADGES[inv.status] ?? STATUS_BADGES.pending;

  return (
    <div className="rounded-xl border border-brand-navy/10 bg-white p-4 sm:p-5 hover:border-brand-orange/40 transition-colors">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading font-bold text-lg text-brand-navy">
              {inv.recipientCompany}
            </h3>
            <Badge variant="outline" className={statusBadge.className}>
              {statusBadge.label}
            </Badge>
            <Badge variant="outline" className="border-brand-aqua/40 text-brand-aqua">
              {inv.sponsorType === "new" ? "Nuevo aliado" : "Aliado de siempre"}
            </Badge>
          </div>
          {(inv.contactName || inv.contactEmail) && (
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
              {inv.contactName && <span>{inv.contactName}</span>}
              {inv.contactEmail && (
                <>
                  {inv.contactName && <span>·</span>}
                  <Mail className="h-3 w-3" />
                  <a
                    href={`mailto:${inv.contactEmail}`}
                    className="hover:text-brand-orange underline-offset-2 hover:underline"
                  >
                    {inv.contactEmail}
                  </a>
                </>
              )}
            </p>
          )}
          {inv.status === "confirmed" && inv.selectedPlan && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 mt-2">
              <p className="text-sm font-bold text-green-900 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Aceptó: {PLAN_LABELS[inv.selectedPlan] ?? inv.selectedPlan}
                {PLAN_VALUES[inv.selectedPlan] > 0 && (
                  <span className="text-green-700">
                    · {formatCurrency(PLAN_VALUES[inv.selectedPlan])}
                  </span>
                )}
              </p>
              {inv.inKindType && (
                <p className="text-xs text-green-800 mt-1">
                  Aporte en especie: <strong>{inv.inKindType}</strong>
                </p>
              )}
              {inv.confirmedAt && (
                <p className="text-xs text-green-700 mt-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Confirmado el {formatDate(inv.confirmedAt)}
                </p>
              )}
            </div>
          )}
          {inv.status === "pending" && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Enviada el {formatDate(inv.createdAt)}
            </p>
          )}
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Link2 className="h-3 w-3" />
            <span className="font-mono truncate max-w-[300px] sm:max-w-[420px]" title={url}>
              {url}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <CopyLinkButton token={inv.token} />
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(url, "_blank", "noopener")}
          >
            Ver
          </Button>
          <ResendButton inv={inv} />
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={deleteMutation.isPending}
            onClick={() => {
              if (confirm(`¿Eliminar la invitación de "${inv.recipientCompany}"?`)) {
                deleteMutation.mutate({ id: inv.id });
              }
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CreateInvitationForm() {
  const queryClient = useQueryClient();
  const [recipientCompany, setRecipientCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [sponsorType, setSponsorType] = useState<"new" | "returning">("new");
  const [customMessage, setCustomMessage] = useState("");

  const [createError, setCreateError] = useState<string | null>(null);
  const createMutation = useCreateInvitation({
    mutation: {
      onSuccess: () => {
        setCreateError(null);
        setRecipientCompany("");
        setContactName("");
        setContactEmail("");
        setCustomMessage("");
        setSponsorType("new");
        queryClient.invalidateQueries({ queryKey: getListInvitationsQueryKey() });
      },
      onError: () =>
        setCreateError("No pudimos crear la invitación. Intenta de nuevo."),
    },
  });

  return (
    <Card className="border-2 border-brand-orange/20 shadow-md">
      <CardHeader>
        <CardTitle className="font-heading text-xl text-brand-navy flex items-center gap-2">
          <Plus className="h-5 w-5 text-brand-orange" />
          Crear nueva invitación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate({
              data: {
                recipientCompany: recipientCompany.trim(),
                contactName: contactName.trim() || null,
                contactEmail: contactEmail.trim() || null,
                sponsorType,
                customMessage: customMessage.trim() || null,
              },
            });
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="recipientCompany">Empresa o persona invitada *</Label>
            <Input
              id="recipientCompany"
              value={recipientCompany}
              onChange={(e) => setRecipientCompany(e.target.value)}
              required
              placeholder="Ej: Banco Popular, Cervecería Nacional…"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactName">Nombre del contacto</Label>
            <Input
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Opcional"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Correo de contacto</Label>
            <Input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Opcional"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sponsorType">Tipo de aliado</Label>
            <Select
              value={sponsorType}
              onValueChange={(v) => setSponsorType(v as "new" | "returning")}
            >
              <SelectTrigger id="sponsorType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Nuevo aliado</SelectItem>
                <SelectItem value="returning">Aliado de siempre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="customMessage">Mensaje personalizado (opcional)</Label>
            <Textarea
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
              placeholder="Un mensaje cálido que verá quien abra la invitación…"
            />
          </div>
          {createError && (
            <p className="sm:col-span-2 text-sm text-red-600">{createError}</p>
          )}
          <div className="sm:col-span-2">
            <Button
              type="submit"
              disabled={createMutation.isPending || !recipientCompany.trim()}
              className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold"
            >
              {createMutation.isPending ? "Generando…" : "Generar invitación"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { data: me, isLoading: meLoading } = useAdminMe();
  const {
    data: invitations,
    isLoading,
    error: listError,
  } = useListInvitations({
    query: {
      queryKey: getListInvitationsQueryKey(),
      enabled: !!me?.authenticated,
    },
  });
  const logoutMutation = useAdminLogout({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getAdminMeQueryKey() });
        navigate("/admin/login");
      },
    },
  });

  useEffect(() => {
    if (!meLoading && !me?.authenticated) navigate("/admin/login");
  }, [me, meLoading, navigate]);

  if (meLoading || !me?.authenticated) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex items-center justify-center">
        <p className="text-muted-foreground">Verificando sesión…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-brand-navy">
            Panel de Invitaciones
          </h1>
          <p className="text-muted-foreground mt-1">
            Genera enlaces únicos para cada patrocinador y haz seguimiento a sus respuestas.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="gap-2 self-start"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>

      <div className="space-y-8">
        {invitations && invitations.length > 0 && (() => {
          const total = invitations.length;
          const confirmed = invitations.filter((i) => i.status === "confirmed").length;
          const pending = invitations.filter((i) => i.status === "pending").length;
          const raised = invitations
            .filter((i) => i.status === "confirmed" && i.selectedPlan)
            .reduce((sum, i) => sum + (PLAN_VALUES[i.selectedPlan!] ?? 0), 0);
          const conversion = total > 0 ? Math.round((confirmed / total) * 100) : 0;
          return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl bg-white border border-brand-navy/10 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-bold">Total enviadas</p>
                <p className="font-heading text-3xl font-black text-brand-navy mt-1">{total}</p>
              </div>
              <div className="rounded-xl bg-white border border-yellow-200 p-4">
                <p className="text-xs uppercase tracking-wide text-yellow-700 font-bold flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Pendientes
                </p>
                <p className="font-heading text-3xl font-black text-yellow-800 mt-1">{pending}</p>
              </div>
              <div className="rounded-xl bg-white border border-green-200 p-4">
                <p className="text-xs uppercase tracking-wide text-green-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Confirmadas
                </p>
                <p className="font-heading text-3xl font-black text-green-800 mt-1">
                  {confirmed} <span className="text-base text-green-600">({conversion}%)</span>
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-brand-orange to-brand-yellow text-white p-4">
                <p className="text-xs uppercase tracking-wide font-bold flex items-center gap-1 opacity-90">
                  <TrendingUp className="h-3 w-3" /> Recaudado
                </p>
                <p className="font-heading text-2xl font-black mt-1">
                  {formatCurrency(raised)}
                </p>
                <p className="text-[10px] opacity-80 mt-0.5">+ aportes en especie</p>
              </div>
            </div>
          );
        })()}

        <CreateInvitationForm />

        <div>
          <h2 className="font-heading text-2xl font-bold text-brand-navy mb-4">
            Invitaciones generadas{" "}
            {invitations && (
              <span className="text-base font-medium text-muted-foreground">
                ({invitations.length})
              </span>
            )}
          </h2>
          {isLoading ? (
            <p className="text-muted-foreground">Cargando…</p>
          ) : listError ? (
            <div className="rounded-xl border-2 border-red-300 bg-red-50 p-6 text-center">
              <p className="text-red-700 font-medium">
                No pudimos cargar las invitaciones. Refresca la página o intenta más tarde.
              </p>
            </div>
          ) : !invitations || invitations.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-brand-navy/15 p-10 text-center">
              <p className="text-muted-foreground">
                Aún no hay invitaciones. Crea la primera arriba.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {invitations.map((inv) => (
                <InvitationRow key={inv.id} inv={inv} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
