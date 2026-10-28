import { ImageResponse } from "next/og";
import { PINHOES } from "@/components/brand/geometria";

export const alt = "PINE. Você pede. Acontece.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A pinha da marca como SVG, montada da mesma geometria do site (sem ler arquivo: roda no Worker)
const PINHA_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-310 -310 620 620">${PINHOES.map(
  (p, i) => `<path d="${p.d}" fill="${i === PINHOES.length - 1 ? "#5B9E78" : "#9C4A2B"}"/>`
).join("")}</svg>`;

const SUBTITULO = "Apps, sistemas e sites em dias. Com IA.";

// Baixa do Google Fonts só os glifos usados (o ImageResponse precisa de TTF/OTF)
async function fonte(familia: string, peso: number, texto: string) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=${familia}:wght@${peso}&text=${encodeURIComponent(texto)}`
    )
  ).text();
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error(`Fonte ${familia} não encontrada`);
  return (await fetch(url)).arrayBuffer();
}

// Imagem OG gerada no build: headline em Fraunces e a pinha da marca
export default async function OpengraphImage() {
  const [fraunces, inter] = await Promise.all([
    fonte("Fraunces", 400, "Você pede.Acontece."),
    fonte("Inter", 400, SUBTITULO),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          position: "relative",
          padding: "0 80px",
          background: "#1B1410",
          color: "#F3EBDD",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Fraunces", fontSize: 112, lineHeight: 1 }}>Você pede.</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 112, lineHeight: 1 }}>Acontece.</div>
          <div style={{ fontFamily: "Inter", fontSize: 28, marginTop: 40, color: "rgb(243 235 221 / 0.6)" }}>
            {SUBTITULO}
          </div>
        </div>
        <img
          src={`data:image/svg+xml;base64,${btoa(PINHA_SVG)}`}
          width={430}
          height={430}
          alt=""
          style={{ position: "absolute", right: -90, top: 100, objectFit: "contain" }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 400 },
        { name: "Inter", data: inter, weight: 400 },
      ],
    }
  );
}
