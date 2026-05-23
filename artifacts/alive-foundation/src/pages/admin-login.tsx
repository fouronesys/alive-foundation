import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminLogin,
  useAdminMe,
  getAdminMeQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import logo from "@/assets/logo.jpg";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: me } = useAdminMe();

  const loginMutation = useAdminLogin({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getAdminMeQueryKey() });
        navigate("/admin");
      },
      onError: (err) => {
        const status = (err as { status?: number } | null)?.status;
        if (status === 401) {
          setError("Contraseña incorrecta. Intenta de nuevo.");
        } else {
          setError("No pudimos iniciar sesión. Revisa tu conexión e intenta otra vez.");
        }
      },
    },
  });

  useEffect(() => {
    if (me?.authenticated) navigate("/admin");
  }, [me, navigate]);

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-brand-aqua/10 via-white to-brand-orange/10">
      <Card className="w-full max-w-md border-2 border-brand-navy/10 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <img
            src={logo}
            alt="Alive Foundation"
            className="h-20 w-20 rounded-full object-cover mx-auto border-2 border-brand-orange"
          />
          <CardTitle className="font-heading text-2xl text-brand-navy flex items-center justify-center gap-2">
            <Lock className="h-5 w-5 text-brand-orange" />
            Panel de Administración
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Ingresa tu contraseña para gestionar las invitaciones del festival.
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              loginMutation.mutate({ data: { password } });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              disabled={loginMutation.isPending || !password}
              className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold"
            >
              {loginMutation.isPending ? "Ingresando…" : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
