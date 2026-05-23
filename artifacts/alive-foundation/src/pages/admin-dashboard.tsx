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
import { Copy, Link2, LogOut, Plus, Trash2, Check } from "lucide-react";

const PLAN_LABELS: Record<string, string> = {
  comunidad: "Patrocinador Comunidad",
  inclusion: "Patrocinador Inclusión",
  impacto: "Patrocinador Impacto",
  especie: "Patrocinador en Especie",
};

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
  return `${window.location.origin}${base}/invitacion/${token}`;
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
            <p className="text-sm text-muted-foreground">
              {inv.contactName}
              {inv.contactName && inv.contactEmail && " · "}
              {inv.contactEmail}
            </p>
          )}
          {inv.selectedPlan && (
            <p className="text-sm font-semibold text-brand-orange">
              Plan elegido: {PLAN_LABELS[inv.selectedPlan] ?? inv.selectedPlan}
              {inv.inKindType && <span className="text-muted-foreground"> · {inv.inKindType}</span>}
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
