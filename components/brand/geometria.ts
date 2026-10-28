// Geometria da pinha, sem CSS: usada pelos componentes e pela imagem OG
// Mesma geometria de brand/_gerador/gerar.py: 89 pinhões em espiral pelo ângulo áureo
export const N_PINHOES = 89;
const RAIO = 270;
const ANGULO_AUREO = (137.508 * Math.PI) / 180;

export const f = (n: number) => n.toFixed(2);

// Gota pontuda com a ponta apontando para `ang` (0 = para cima, sentido horário)
export function pinhao(cx: number, cy: number, ang: number, comp: number) {
  const larg = comp * 0.6;
  const pts = [
    [0, -comp / 2], [larg / 2, -comp / 4], [larg / 2, comp / 2], [0, comp / 2],
    [-larg / 2, comp / 2], [-larg / 2, -comp / 4],
  ];
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const p = pts.map(([x, y]) => `${f(cx + x * c - y * s)} ${f(cy + x * s + y * c)}`);
  return `M${p[0]}C${p[1]} ${p[2]} ${p[3]}C${p[4]} ${p[5]} ${p[0]}Z`;
}

export const PINHOES = Array.from({ length: N_PINHOES }, (_, i) => {
  const n = i + 1;
  const r = (RAIO / Math.sqrt(N_PINHOES)) * Math.sqrt(n);
  const th = n * ANGULO_AUREO;
  const x = r * Math.sin(th);
  const y = -r * Math.cos(th);
  return { d: pinhao(x, y, th, 16 + 0.2 * r), x, y };
});

// Um pinhão sozinho, centrado na origem (viewBox "-6 -10 12 20"), para ícones
export const PINHAO_D = pinhao(0, 0, 0, 20);

