import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "PINE. Você pede. Acontece.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SUBTITULO = "Landing page em 24 horas. Site em 3 dias. App em 2 semanas.";

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
  const [fraunces, inter, pinha] = await Promise.all([
    fonte("Fraunces", 400, "Você pede.Acontece."),
    fonte("Inter", 400, SUBTITULO),
    readFile(join(process.cwd(), "brand/logo/svg/pine-simbolo-cor.svg")),
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
          <div style={{ fontFamily: "Inter", fontSize: 24, marginTop: 40, color: "rgb(243 235 221 / 0.6)" }}>
            {SUBTITULO}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/svg+xml;base64,${pinha.toString("base64")}`}
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
