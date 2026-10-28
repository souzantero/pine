import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

const title = "PINE | Você pede. Acontece.";
const description =
  "Apps, sistemas e sites em dias. Com IA. Não somos a ferramenta. Somos o resultado.";

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
