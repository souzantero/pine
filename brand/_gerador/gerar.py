"""Gera todos os arquivos do brandkit da PINE a partir da geometria da pinha.

Uso (a partir da raiz do repo):
    python3 -m venv /tmp/pine-venv && /tmp/pine-venv/bin/pip install fonttools pillow
    /tmp/pine-venv/bin/python brand/_gerador/gerar.py

Requer `rsvg-convert` (brew install librsvg) para exportar os PNGs.
A fonte Inter SemiBold é baixada do Google Fonts na primeira execução.
"""

import math
import subprocess
import urllib.request
from io import BytesIO
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
FONTE = Path(__file__).resolve().parent / "Inter-SemiBold.ttf"
FONTE_URL = "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf"

TERRACOTA = "#9C4A2B"
VERDE = "#2F6B4F"
VERDE_CLARO = "#5B9E78"
TINTA = "#1B1410"
CREME = "#F3EBDD"

# Cores de cada versão: (pinhões, pinhão de destaque, nome)
VERSOES = {
    "cor": (TERRACOTA, VERDE_CLARO, CREME),  # principal, sobre fundo escuro
    "negativo": (TERRACOTA, VERDE, TINTA),  # sobre fundo claro
    "mono-escuro": (TINTA, TINTA, TINTA),
    "mono-claro": (CREME, CREME, CREME),
}

ANGULO_AUREO = math.radians(137.508)


def pinhao(cx, cy, ang, comp, larg):
    """Gota pontuda com a ponta apontando para `ang` (0 = para cima, sentido horário)."""
    pts = [(0, -comp / 2), (larg / 2, -comp / 4), (larg / 2, comp / 2), (0, comp / 2),
           (-larg / 2, comp / 2), (-larg / 2, -comp / 4)]
    c, s = math.cos(ang), math.sin(ang)
    p = [(cx + x * c - y * s, cy + x * s + y * c) for x, y in pts]
    f = lambda q: f"{q[0]:.2f} {q[1]:.2f}"
    return f"M{f(p[0])}C{f(p[1])} {f(p[2])} {f(p[3])}C{f(p[4])} {f(p[5])} {f(p[0])}Z", p


def pinha(n_pinhoes, raio, tamanho):
    """Pinhões dispostos em espiral pelo ângulo áureo. O último é o pinhão de destaque."""
    c = raio / math.sqrt(n_pinhoes)
    corpo, pontos, destaque = [], [], None
    for n in range(1, n_pinhoes + 1):
        r = c * math.sqrt(n)
        th = n * ANGULO_AUREO
        comp = tamanho(r, c)
        d, p = pinhao(r * math.sin(th), -r * math.cos(th), th, comp, comp * 0.6)
        pontos += p
        if n == n_pinhoes:
            destaque = d
        else:
            corpo.append(d)
    xs, ys = [p[0] for p in pontos], [p[1] for p in pontos]
    return "".join(corpo), destaque, (min(xs), min(ys), max(xs), max(ys))


# A pinha da marca: 89 pinhões
PINHA = pinha(89, 270, lambda r, c: 16 + 0.2 * r)


def carregar_fonte():
    if not FONTE.exists():
        FONTE.write_bytes(urllib.request.urlopen(FONTE_URL).read())
    return TTFont(FONTE)


def nome_em_curvas(fonte, altura_maiuscula, espacamento=0.16):
    """Desenha "PINE" como curvas. Retorna (path d, largura, altura da maiúscula)."""
    upm = fonte["head"].unitsPerEm
    cap = fonte["OS/2"].sCapHeight
    escala = altura_maiuscula / cap
    glyphs = fonte.getGlyphSet()
    cmap = fonte.getBestCmap()
    tamanho_em = upm * escala
    x, partes = 0.0, []
    for i, ch in enumerate("PINE"):
        nome = cmap[ord(ch)]
        pen = SVGPathPen(glyphs)
        # Fonte tem y para cima; SVG tem y para baixo, com a linha de base em y = altura_maiuscula
        glyphs[nome].draw(TransformPen(pen, (escala, 0, 0, -escala, x, altura_maiuscula)))
        partes.append(pen.getCommands())
        x += fonte["hmtx"][nome][0] * escala
        if i < 3:
            x += espacamento * tamanho_em
    # Remove o respiro lateral do P (lsb) para alinhar a caixa ao desenho
    lsb_p = fonte["hmtx"][cmap[ord("P")]][1] * escala
    rsb_e = (fonte["hmtx"][cmap[ord("E")]][0] - fonte["glyf"][cmap[ord("E")]].xMax) * escala
    return "".join(partes), lsb_p, x - rsb_e


def svg(largura, altura, conteudo, vb_x=0, vb_y=0, fundo=None):
    rect = f'<rect x="{vb_x}" y="{vb_y}" width="{largura}" height="{altura}" fill="{fundo}"/>' if fundo else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb_x:.2f} {vb_y:.2f} {largura:.2f} {altura:.2f}" '
            f'width="{largura:.0f}" height="{altura:.0f}">{rect}{conteudo}</svg>\n')


def simbolo_g(dados, cor, cor_destaque, escala=1.0, dx=0.0, dy=0.0):
    corpo, destaque, (x0, y0, x1, y1) = dados
    t = f'translate({dx:.2f} {dy:.2f}) scale({escala:.5f}) translate({-x0:.2f} {-y0:.2f})'
    return f'<g transform="{t}"><path d="{corpo}" fill="{cor}"/><path d="{destaque}" fill="{cor_destaque}"/></g>'


def dims(dados):
    x0, y0, x1, y1 = dados[2]
    return x1 - x0, y1 - y0


def simbolo(versao, dados=PINHA, fundo=None, margem=0.0):
    cor, destaque, _ = VERSOES[versao]
    w, h = dims(dados)
    m = max(w, h) * margem
    return svg(w + 2 * m, h + 2 * m, simbolo_g(dados, cor, destaque, dx=m, dy=m), fundo=fundo)


def horizontal(versao, nome_curvas, cap):
    """Pinha antes do nome, com 1,8x a altura das maiúsculas."""
    d, lsb, larg_nome = nome_curvas
    cor, destaque, cor_nome = VERSOES[versao]
    w, h = dims(PINHA)
    alt_pinha = 1.8 * cap
    esc = alt_pinha / h
    larg_pinha = w * esc
    gap = 0.42 * cap
    # Centro vertical da pinha alinhado ao centro das maiúsculas
    topo = (cap - alt_pinha) / 2
    nome = f'<path transform="translate({larg_pinha + gap - lsb:.2f} {-topo:.2f})" d="{d}" fill="{cor_nome}"/>'
    return svg(larg_pinha + gap + larg_nome - lsb, alt_pinha, simbolo_g(PINHA, cor, destaque, esc) + nome)


def vertical(versao, nome_curvas, cap):
    """Pinha grande em cima do nome."""
    d, lsb, larg_nome = nome_curvas
    cor, destaque, cor_nome = VERSOES[versao]
    w, h = dims(PINHA)
    alt_pinha = 3.6 * cap
    esc = alt_pinha / h
    larg_pinha = w * esc
    gap = 0.4 * cap
    larg = max(larg_pinha, larg_nome - lsb)
    g = simbolo_g(PINHA, cor, destaque, esc, (larg - larg_pinha) / 2, 0)
    nome = f'<path transform="translate({(larg - (larg_nome - lsb)) / 2 - lsb:.2f} {alt_pinha + gap:.2f})" d="{d}" fill="{cor_nome}"/>'
    return svg(larg, alt_pinha + gap + cap, g + nome)


def png(svg_path, png_path, largura=None, altura=None):
    args = ["rsvg-convert", "-o", str(png_path)]
    if largura:
        args += ["-w", str(largura)]
    if altura:
        args += ["-h", str(altura)]
    subprocess.run(args + [str(svg_path)], check=True)


def png_bytes(svg_text, lado):
    r = subprocess.run(["rsvg-convert", "-w", str(lado), "-h", str(lado)], input=svg_text.encode(),
                       capture_output=True, check=True)
    return Image.open(BytesIO(r.stdout)).convert("RGBA")


def main():
    cap = 100.0
    nome_curvas = nome_em_curvas(carregar_fonte(), cap)
    logo_svg, logo_png = RAIZ / "logo" / "svg", RAIZ / "logo" / "png"
    for p in (logo_svg, logo_png, RAIZ / "favicon", RAIZ / "social"):
        p.mkdir(parents=True, exist_ok=True)

    # Logo: 3 formatos x 4 versões, em SVG (fundo transparente) e PNG
    for versao in VERSOES:
        arquivos = {
            "simbolo": (simbolo(versao), 1024),
            "horizontal": (horizontal(versao, nome_curvas, cap), 2400),
            "vertical": (vertical(versao, nome_curvas, cap), 1600),
        }
        for formato, (conteudo, largura) in arquivos.items():
            nome = f"pine-{formato}-{versao}"
            (logo_svg / f"{nome}.svg").write_text(conteudo)
            png(logo_svg / f"{nome}.svg", logo_png / f"{nome}.png", largura=largura)

    # Favicon e ícones de app
    fav = RAIZ / "favicon"
    fav_svg = simbolo("negativo", margem=0.04)
    (fav / "favicon.svg").write_text(fav_svg)
    tamanhos = [16, 32, 48]
    imgs = [png_bytes(fav_svg, t) for t in tamanhos]
    imgs[-1].save(fav / "favicon.ico", sizes=[(t, t) for t in tamanhos], append_images=imgs[:-1])
    icone = simbolo("cor", fundo=TINTA, margem=0.18)
    (fav / "icon.svg").write_text(icone)
    for lado, nome in [(180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")]:
        png_bytes(icone, lado).save(fav / nome)

    # Avatares para redes sociais
    social = RAIZ / "social"
    for versao, fundo, nome in [("negativo", CREME, "avatar-claro"), ("cor", TINTA, "avatar-escuro")]:
        conteudo = simbolo(versao, fundo=fundo, margem=0.2)
        (social / f"{nome}.svg").write_text(conteudo)
        png(social / f"{nome}.svg", social / f"{nome}.png", largura=1080, altura=1080)

    print("Brandkit gerado em", RAIZ)


if __name__ == "__main__":
    main()
