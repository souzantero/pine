"use client";

import { createContext, useCallback, useContext, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const WHATSAPP_NUMBER = "5541992413811";

interface LeadFormContextValue {
  openLeadForm: () => void;
}

const LeadFormContext = createContext<LeadFormContextValue | null>(null);

export function useLeadForm() {
  const ctx = useContext(LeadFormContext);
  if (!ctx) throw new Error("useLeadForm deve ser usado dentro de LeadFormProvider");
  return ctx;
}

// Monta a mensagem do WhatsApp com tudo o que a pessoa preencheu
function buildWhatsappUrl(data: {
  nome: string;
  empresa: string;
  contato: string;
  necessidade: string;
}) {
  const lines = [
    `Olá! Sou ${data.nome}${data.empresa ? `, da ${data.empresa}` : ""}.`,
    "",
    `O que eu preciso: ${data.necessidade}`,
    "",
    `Contato: ${data.contato}`,
  ];

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function LeadFormProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openLeadForm = useCallback(() => setOpen(true), []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const url = buildWhatsappUrl({
      nome: String(form.get("nome") ?? "").trim(),
      empresa: String(form.get("empresa") ?? "").trim(),
      contato: String(form.get("contato") ?? "").trim(),
      necessidade: String(form.get("necessidade") ?? "").trim(),
    });
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <LeadFormContext.Provider value={{ openLeadForm }}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md px-6 pt-14 pb-8 overflow-y-auto">
          <div className="space-y-2">
            <SheetTitle className="text-2xl font-bold uppercase tracking-tight">
              Me conta.
            </SheetTitle>
            <SheetDescription className="text-foreground/60">
              Conta o que você precisa. A conversa continua no WhatsApp.
            </SheetDescription>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="lead-nome">Nome</Label>
              <Input id="lead-nome" name="nome" required autoComplete="name" className="rounded-none" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-empresa">Empresa</Label>
              <Input id="lead-empresa" name="empresa" autoComplete="organization" className="rounded-none" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-contato">WhatsApp ou email</Label>
              <Input id="lead-contato" name="contato" required className="rounded-none" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-necessidade">O que você precisa?</Label>
              <Textarea id="lead-necessidade" name="necessidade" required rows={4} className="min-h-24 rounded-none" />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-widest px-8 py-4 hover:opacity-80 transition-opacity"
            >
              Enviar pelo WhatsApp
            </button>
          </form>
        </SheetContent>
      </Sheet>
    </LeadFormContext.Provider>
  );
}
