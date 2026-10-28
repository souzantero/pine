"use client";

import { cn } from "@/lib/utils";
import { Pinhao } from "@/components/brand/pinha";
import { useLeadForm } from "@/components/landing/lead-form";

interface CtaProps {
  children: React.ReactNode;
  // "escuro": botão creme sobre fundo tinta; "claro": botão tinta sobre fundo creme
  tom?: "claro" | "escuro";
  // Pinhão verde: só onde a ideia é "acontece" (hero)
  destaque?: boolean;
  className?: string;
}

export function Cta({ children, tom = "claro", destaque, className }: CtaProps) {
  const { openLeadForm } = useLeadForm();
  return (
    <button
      type="button"
      onClick={openLeadForm}
      className={cn(
        "group inline-flex items-center gap-3 px-7 py-[18px] text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors",
        tom === "escuro" ? "bg-creme text-tinta hover:bg-white" : "bg-tinta text-creme hover:bg-black",
        className
      )}
    >
      <Pinhao
        className={cn(
          "h-3.5 w-auto transition-transform duration-300 ease-[cubic-bezier(.3,1.6,.5,1)] group-hover:-translate-y-1 group-hover:-rotate-12",
          destaque ? (tom === "escuro" ? "text-verde" : "text-verde-claro") : "text-terracota"
        )}
      />
      {children}
    </button>
  );
}
