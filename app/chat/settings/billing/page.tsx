"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/session";
import { useBilling } from "@/lib/hooks";
import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Check,
  Users,
  Database,
  MessageSquare,
  Wrench,
  HardDrive,
  Shield,
  MessageCircle,
  Mail,
} from "lucide-react";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function BillingPage() {
  const router = useRouter();
  const { isLoading: authLoading, hasPermission } = useSession();
  const { usage, isLoading } = useBilling();

  const canManage = hasPermission("ORGANIZATION_MANAGE");

  useEffect(() => {
    if (!authLoading && !canManage) {
      router.push("/chat");
    }
  }, [authLoading, canManage, router]);

  const pageLoading = authLoading || isLoading;

  if (!authLoading && !canManage) {
    return null;
  }

  const isEnterprise = usage?.plan === "ENTERPRISE";

  const formatLimit = (current: number, limit: number | null) => {
    if (limit === null) return `${current} / Ilimitado`;
    return `${current} / ${limit}`;
  };

  const formatStorageLimit = (current: number, limit: number | null) => {
    if (limit === null) return `${formatBytes(current)} / Ilimitado`;
    return `${formatBytes(current)} / ${formatBytes(limit)}`;
  };

  const getProgress = (current: number, limit: number | null) => {
    if (limit === null) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  return (
    <AppLayout loading={pageLoading}>
      <div className="max-w-3xl mx-auto py-6 px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Plano e Uso</h1>
            <p className="text-muted-foreground">
              Gerencie seu plano e veja o uso atual
            </p>
          </div>
        </div>

        {/* Plano Atual */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {isEnterprise ? (
                    <>
                      <Shield className="h-5 w-5 text-blue-500" />
                      Plano Enterprise
                    </>
                  ) : (
                    "Plano Free"
                  )}
                </CardTitle>
                <CardDescription>
                  {isEnterprise
                    ? "Você tem acesso a todos os recursos"
                    : "Entre em contato para desbloquear mais recursos"}
                </CardDescription>
              </div>
              {!isEnterprise && (
                <Button asChild className="cursor-pointer">
                  <a
                    href="https://wa.me/5541992413811?text=Olá! Tenho interesse no plano Enterprise do PINE."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Falar sobre Enterprise
                  </a>
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Uso Atual */}
        <Card>
          <CardHeader>
            <CardTitle>Uso Atual</CardTitle>
            <CardDescription>
              Veja quanto você está usando dos seus limites
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Membros */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Membros</span>
                </div>
                <span className="text-muted-foreground">
                  {usage &&
                    formatLimit(usage.members.current, usage.members.limit)}
                </span>
              </div>
              {usage?.members.limit && (
                <Progress
                  value={getProgress(
                    usage.members.current,
                    usage.members.limit
                  )}
                />
              )}
            </div>

            {/* Colecoes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span>Coleções de Conhecimento</span>
                </div>
                <span className="text-muted-foreground">
                  {usage &&
                    formatLimit(
                      usage.collections.current,
                      usage.collections.limit
                    )}
                </span>
              </div>
              {usage?.collections.limit && (
                <Progress
                  value={getProgress(
                    usage.collections.current,
                    usage.collections.limit
                  )}
                />
              )}
            </div>

            {/* Threads */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>Conversas</span>
                </div>
                <span className="text-muted-foreground">
                  {usage &&
                    formatLimit(usage.threads.current, usage.threads.limit)}
                </span>
              </div>
              {usage?.threads.limit && (
                <Progress
                  value={getProgress(
                    usage.threads.current,
                    usage.threads.limit
                  )}
                />
              )}
            </div>

            {/* Tool Calls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <span>Chamadas de Ferramentas (mensal)</span>
                </div>
                <span className="text-muted-foreground">
                  {usage &&
                    formatLimit(
                      usage.toolCalls.current,
                      usage.toolCalls.limit
                    )}
                </span>
              </div>
              {usage?.toolCalls.limit && (
                <Progress
                  value={getProgress(
                    usage.toolCalls.current,
                    usage.toolCalls.limit
                  )}
                />
              )}
              {usage?.toolCalls.limit && (
                <p className="text-xs text-muted-foreground">
                  Reseta em{" "}
                  {new Date(usage.toolCalls.resetsAt).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              )}
            </div>

            {/* Storage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span>Armazenamento</span>
                </div>
                <span className="text-muted-foreground">
                  {usage &&
                    formatStorageLimit(
                      usage.storage.current,
                      usage.storage.limit
                    )}
                </span>
              </div>
              {usage?.storage.limit && (
                <Progress
                  value={getProgress(
                    usage.storage.current,
                    usage.storage.limit
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comparação de Planos */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Comparação de Planos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${!isEnterprise ? "border-2 border-primary" : "border"}`}>
                <h3 className="font-semibold mb-3">Free</h3>
                <p className="text-xs text-muted-foreground mb-3">Para explorar a plataforma</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>1 membro</li>
                  <li>1 coleção de conhecimento</li>
                  <li>50 conversas</li>
                  <li>200 chamadas de ferramentas/mês</li>
                  <li>100MB de armazenamento</li>
                  <li>Arquivos até 10MB</li>
                </ul>
              </div>
              <div className={`p-4 rounded-lg ${isEnterprise ? "border-2 border-primary" : "border"}`}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  Enterprise
                  <Shield className="h-4 w-4 text-blue-500" />
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Todos os recursos ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Membros ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Armazenamento ilimitado
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Consultoria de implantação
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Suporte prioritário
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    SLA garantido
                  </li>
                </ul>
                <div className="mt-4 flex flex-col gap-2">
                  <a
                    href="https://wa.me/5541992413811?text=Olá! Tenho interesse no plano Enterprise do PINE."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a
                    href="mailto:ai@pine.net.br"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    ai@pine.net.br
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
