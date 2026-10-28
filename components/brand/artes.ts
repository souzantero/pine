import { pinhao } from "@/components/brand/pinha";

// Artes dos serviços, todas feitas de pinhões, num viewBox "-200 -200 400 400".
// Cada pinhão: posição, ângulo (0 = ponta para cima, sentido horário), comprimento e se é o verde.
type Peca = [x: number, y: number, ang: number, comp: number, verde?: boolean];

export type Arte = { d: string; verde: boolean }[];
export type ServicoId = "landing" | "site" | "app" | "sistema" | "automacao" | "agente";

const rad = (graus: number) => (graus * Math.PI) / 180;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);

// Landing pages: funil. Muitos em cima, afunilando até o verde (a conversão)
function landing(): Peca[] {
  const pecas: Peca[] = [];
  [9, 7, 5, 3].forEach((n, linha) => {
    for (const k of range(n)) pecas.push([(k - (n - 1) / 2) * 38, -140 + linha * 62, rad(180), 30]);
  });
  pecas.push([0, 170, rad(180), 38, true]);
  return pecas;
}

// Sites: globo (contorno, paralelos e meridianos); o verde é o site no mapa
function site(): Peca[] {
  const pecas: Peca[] = [];
  const raio = 175;
  for (const k of range(44)) {
    const t = (2 * Math.PI * k) / 44;
    pecas.push([raio * Math.sin(t), -raio * Math.cos(t), t + Math.PI / 2, 16]);
  }
  // Paralelos: só a metade da frente
  for (const lat of [-45, 0, 45]) {
    const rx = raio * Math.cos(rad(lat));
    const y0 = -raio * Math.sin(rad(lat));
    const n = Math.floor(18 * Math.cos(rad(lat))) + 4;
    for (let k = 1; k < n; k++) {
      const t = (Math.PI * k) / n;
      const ang = Math.atan2(rx * Math.sin(t), -rx * 0.3 * Math.cos(t));
      pecas.push([-rx * Math.cos(t), y0 + rx * 0.3 * Math.sin(t), ang, 13]);
    }
  }
  for (const lon of [-50, 0, 50]) {
    const rx = raio * Math.sin(rad(lon));
    for (let k = 1; k < 12; k++) {
      const t = -Math.PI / 2 + (Math.PI * k) / 12;
      const ang = Math.atan2(-rx * Math.sin(t), -raio * Math.cos(t));
      pecas.push([rx * Math.cos(t), raio * Math.sin(t), ang, 13]);
    }
  }
  pecas.push([62, -68, 0, 30, true]);
  return pecas;
}

// Apps: celular com uma grade de ícones; o verde é o do meio
function app(): Peca[] {
  const pecas: Peca[] = [];
  const curva = (v: number) => Math.sign(v) * Math.abs(v) ** 0.35;
  for (let g = 0; g < 360; g += 9) {
    const a = rad(g);
    pecas.push([95 * curva(Math.cos(a)), 175 * curva(Math.sin(a)), a + rad(90), 16]);
  }
  for (const linha of range(5)) {
    for (const col of range(3)) {
      pecas.push([-50 + col * 50, -105 + linha * 50, 0, 28, linha === 2 && col === 1]);
    }
  }
  return pecas;
}

// Sistemas: rede de nós ligados, o contrário do emaranhado; o nó central é verde
function sistema(): Peca[] {
  const pecas: Peca[] = [];
  const externos = range(6).map((i) => {
    const a = rad(-90 + i * 60);
    return [130 * Math.cos(a), 130 * Math.sin(a)];
  });
  externos.forEach(([x, y], i) => {
    for (const t of [0.33, 0.5, 0.67]) pecas.push([x * t, y * t, Math.atan2(x, -y), 10]);
    const [nx, ny] = externos[(i + 1) % 6];
    for (const t of [0.35, 0.65]) {
      pecas.push([x + (nx - x) * t, y + (ny - y) * t, Math.atan2(nx - x, -(ny - y)), 10]);
    }
  });
  [[0, 0], ...externos].forEach(([cx, cy], i) => {
    for (const k of range(6)) {
      const a = rad(k * 60);
      pecas.push([cx + 16 * Math.sin(a), cy - 16 * Math.cos(a), a, 20]);
    }
    pecas.push([cx, cy, 0, 20, i === 0]);
  });
  return pecas;
}

// Automações: pinhões correndo num laço infinito
function automacao(): Peca[] {
  return range(46).map((k) => {
    const t = (2 * Math.PI * k) / 46;
    const ang = Math.atan2(160 * Math.cos(t), -90 * Math.cos(2 * t));
    return [160 * Math.sin(t), 90 * Math.sin(t) * Math.cos(t), ang, 22, k === 9] as Peca;
  });
}

// Agentes de IA: anéis irradiando de um centro verde
function agente(): Peca[] {
  const pecas: Peca[] = [];
  const aneis = [[55, 8, 22], [100, 14, 26], [145, 20, 30], [185, 26, 26]];
  aneis.forEach(([r, n, comp], anel) => {
    for (const k of range(n)) {
      const a = (2 * Math.PI * (k + anel * 0.5)) / n;
      pecas.push([r * Math.sin(a), -r * Math.cos(a), a, comp]);
    }
  });
  pecas.push([0, 0, 0, 34, true]);
  return pecas;
}

const GERADORES: Record<ServicoId, () => Peca[]> = { landing, site, app, sistema, automacao, agente };

// O verde vai sempre para o fim da lista: na animação, ele chega por último
function montar(pecas: Peca[]): Arte {
  return [...pecas]
    .sort((a, b) => Number(Boolean(a[4])) - Number(Boolean(b[4])))
    .map(([x, y, ang, comp, verde]) => ({ d: pinhao(x, y, ang, comp), verde: Boolean(verde) }));
}

export const ARTES = Object.fromEntries(
  Object.entries(GERADORES).map(([id, gerar]) => [id, montar(gerar())])
) as Record<ServicoId, Arte>;
