import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          PineAI
        </h1>
        <p className="text-lg text-muted-foreground">
          Plataforma de agentes de IA
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/auth/login">Entrar</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/signup">Criar conta</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
