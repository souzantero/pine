import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const SCRIPT_JS =
  "var h=document.documentElement;h.classList.add('js');" +
  "setTimeout(function(){if(!h.dataset.hidratado)h.classList.remove('js')},4000)";

export const metadata: Metadata = {
  metadataBase: new URL("https://pine.net.br"),
  title: "PINE",
  description: "Você pede. Acontece. Tecnologia e IA pra entregar em dias o que antes levava meses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Marca que há JS: só assim as revelações na rolagem escondem o conteúdo antes de animar.
            Se o app não carregar em 4s (script bloqueado, rede caiu), tira a marca e mostra tudo. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_JS }} />
      </head>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
