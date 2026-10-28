"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "./secoes.css";

interface RevealProps {
  as?: "section" | "div";
  className?: string;
  children: React.ReactNode;
}

// Ganha a classe "visivel" quando 20% do elemento entra na tela, uma vez só.
// Os filhos com data-anima animam via secoes.css.
export function Reveal({ as: Tag = "div", className, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={cn("reveal", visivel && "visivel", className)}>
      {children}
    </Tag>
  );
}
