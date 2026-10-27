import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

const title = "PINE | Você pede. Acontece.";
const description =
  "Landing page em 24 horas. Site em 3 dias. App em 2 semanas. Tecnologia e IA trabalhando juntas pra entregar em dias o que antes levava meses.";

// Server component só para exportar metadata; a página em si é client
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "pt_BR",
    siteName: "PINE",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function Page() {
  return <LandingPage />;
}
