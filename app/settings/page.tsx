"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ArrowLeft, Check } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading, hasOrganization, hasPermission, refreshSession } = useAuth();

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canManage = hasPermission("ORGANIZATION_MANAGE");

  // Redirect if not authenticated or no permission
  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        router.push("/login");
      } else if (!hasOrganization) {
        router.push("/onboarding");
      } else if (!canManage) {
        router.push("/");
      }
    }
  }, [isLoading, isLoggedIn, hasOrganization, canManage, router]);

  // Load organization data
  const loadOrganization = useCallback(async () => {
    try {
      const response = await fetch("/api/organizations/settings");
      if (response.ok) {
        const data = await response.json();
        setOrganization(data.organization);
        setName(data.organization.name);
        setSlug(data.organization.slug);
      }
    } catch (error) {
      console.error("Failed to load organization:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && hasOrganization && canManage) {
      loadOrganization();
    }
  }, [isLoggedIn, hasOrganization, canManage, loadOrganization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const response = await fetch("/api/organizations/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        setSaving(false);
        return;
      }

      setOrganization(data.organization);
      setSuccess(true);

      // Refresh session to update org name in header
      await refreshSession();

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    organization && (name !== organization.name || slug !== organization.slug);

  if (isLoading || !isLoggedIn || !hasOrganization || !canManage) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 overflow-auto">
        <div className="container max-w-2xl mx-auto py-6 px-4">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Configurações</h1>
              <p className="text-muted-foreground">
                Gerencie as configurações da sua organização
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações da Organização</CardTitle>
              <CardDescription>
                Altere o nome e identificador da sua organização
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8 text-muted-foreground">
                  Carregando...
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-md">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-950/50 rounded-md flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Configurações salvas com sucesso!
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Organização</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Minha Empresa"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Identificador (slug)</Label>
                    <Input
                      id="slug"
                      type="text"
                      placeholder="minha-empresa"
                      value={slug}
                      onChange={(e) =>
                        setSlug(
                          e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                        )
                      }
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Apenas letras minúsculas, números e hífens. Usado como
                      identificador único.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={saving || !hasChanges}
                    >
                      {saving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
