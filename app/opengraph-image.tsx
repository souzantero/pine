import { ImageResponse } from "next/og";

export const alt = "PINE. Você pede. Acontece.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagem OG gerada no build com a headline da LP
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#f8f6f2",
          color: "#0d1510",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 8 }}>PINE</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 1, textTransform: "uppercase" }}>
            Você pede.
          </div>
          <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 1, textTransform: "uppercase" }}>
            Acontece.
          </div>
        </div>
        <div style={{ fontSize: 30, opacity: 0.6 }}>
          Landing page em 24 horas. Site em 3 dias. App em 2 semanas.
        </div>
      </div>
    ),
    size
  );
}
