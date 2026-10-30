"""Gera as peças de Instagram e LinkedIn da PINE em brand/social/.

Uso (a partir da raiz do repo):
    python3 -m venv /tmp/pine-venv && /tmp/pine-venv/bin/pip install fonttools pillow uharfbuzz
    /tmp/pine-venv/bin/python brand/_gerador/redes.py

Requer `rsvg-convert`. As fontes são baixadas do Google Fonts na primeira execução e
os textos saem em curvas. `artes.json` é a exportação de components/brand/artes.ts.
"""

import json
import subprocess
import urllib.parse
import urllib.request
from io import BytesIO
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image

from gerar import CREME, PINHA, TERRACOTA, TINTA, VERDE_CLARO, pinhao

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "social"
LOGO = AQUI.parent / "logo" / "svg"
ARTES = json.loads((AQUI / "artes.json").read_text())

FONTES_URL = "https://github.com/google/fonts/raw/main/ofl/"
FONTES = {
    # Mesmos eixos que a LP recebe do Google Fonts
    "titulo": ("fraunces/Fraunces[SOFT,WONK,opsz,wght].ttf", {"wght": 400, "opsz": 14, "SOFT": 0, "WONK": 0}),
    "texto": ("inter/Inter[opsz,wght].ttf", {"wght": 400, "opsz": 14}),
    "etiqueta": ("jetbrainsmono/JetBrainsMono[wght].ttf", {"wght": 400}),
}

SERVICOS = [
    ("landing", "24 horas", "Landing pages", "Feita pra campanha, rápida e medindo tudo."),
    ("site", "3 dias", "Sites", "Institucional, blog ou multilíngue, com SEO desde o primeiro dia."),
    ("app", "2 semanas", "Apps", "Web ou mobile, do protótipo à loja."),
    ("sistema", "Sob medida", "Sistemas", "Gestão, portal do cliente, painel. Conversando com o que você já usa."),
    ("automacao", "Sob medida", "Automações", "Planilha, CRM, email e WhatsApp trabalhando sozinhos."),
    ("agente", "Sob medida", "Agentes de IA", "Atendimento, vendas e suporte respondendo a qualquer hora."),
]

PASSOS = [
    ("Você pede.", "Conta o que você precisa, do seu jeito. Uma conversa resolve.", "Pedido recebido"),
    ("A gente entende.", "A gente mergulha no problema e devolve escopo, prazo e preço em 24 horas.", "Briefing"),
    ("Você escolhe.", "Você recebe protótipos e escolhe o caminho antes de qualquer linha de código.", "Protótipos"),
    ("A gente desenvolve.", "Com IA fazendo o volume e gente experiente cuidando do resultado.", "Desenvolvimento"),
    ("Você ajusta.", "Duas ou três rodadas de ajuste, até ficar do jeito certo.", "Ajustes"),
    ("Acontece.", "No ar, funcionando. Você pediu. Aconteceu.", "No ar"),
]


class Fonte:
    def __init__(self, papel):
        caminho, eixos = FONTES[papel]
        arquivo = AQUI / f"redes-{papel}.ttf"
        if not arquivo.exists():
            url = FONTES_URL + urllib.parse.quote(caminho)
            original = TTFont(BytesIO(urllib.request.urlopen(url).read()))
            instancer.instantiateVariableFont(original, eixos, inplace=True).save(arquivo)
        self.tt = TTFont(arquivo)
        self.glifos = self.tt.getGlyphSet()
        self.ordem = self.tt.getGlyphOrder()
        self.upm = self.tt["head"].unitsPerEm
        self.hb = hb.Font(hb.Face(arquivo.read_bytes()))

    def formar(self, texto):
        buf = hb.Buffer()
        buf.add_str(texto)
        buf.guess_segment_properties()
        hb.shape(self.hb, buf)
        return list(zip(buf.glyph_infos, buf.glyph_positions))

    def largura(self, texto, tamanho, tracking=0.0):
        avancos = sum(p.x_advance for _, p in self.formar(texto))
        return avancos * tamanho / self.upm + tracking * tamanho * (len(texto) - 1)


FT = {papel: Fonte(papel) for papel in FONTES}


def texto(conteudo, papel, tamanho, x, y, cor=CREME, opacidade=1.0, tracking=0.0, ancora="inicio"):
    """Uma linha em curvas, com `y` na linha de base."""
    fonte = FT[papel]
    if ancora == "fim":
        x -= fonte.largura(conteudo, tamanho, tracking)
    elif ancora == "meio":
        x -= fonte.largura(conteudo, tamanho, tracking) / 2
    esc = tamanho / fonte.upm
    partes = []
    for info, pos in fonte.formar(conteudo):
        pen = SVGPathPen(fonte.glifos)
        trans = (esc, 0, 0, -esc, x + pos.x_offset * esc, y - pos.y_offset * esc)
        fonte.glifos[fonte.ordem[info.codepoint]].draw(TransformPen(pen, trans))
        partes.append(pen.getCommands())
        x += pos.x_advance * esc + tracking * tamanho
    return f'<path d="{"".join(partes)}" fill="{cor}" fill-opacity="{opacidade}"/>'


def quebrar(conteudo, papel, tamanho, largura):
    linhas, atual = [], ""
    for palavra in conteudo.split():
        tentativa = f"{atual} {palavra}".strip()
        if atual and FT[papel].largura(tentativa, tamanho) > largura:
            linhas.append(atual)
            atual = palavra
        else:
            atual = tentativa
    return linhas + [atual]


def paragrafo(conteudo, papel, tamanho, x, y, largura, entrelinha=1.4, **kw):
    """Parágrafo a partir da linha de base `y`. Retorna (svg, y da última linha)."""
    linhas = quebrar(conteudo, papel, tamanho, largura)
    passo = tamanho * entrelinha
    return "".join(texto(l, papel, tamanho, x, y + i * passo, **kw) for i, l in enumerate(linhas)), y + (len(linhas) - 1) * passo


def etiqueta(conteudo, x, y, tamanho=30, opacidade=0.6, ancora="inicio", cor=CREME):
    return texto(conteudo.upper(), "etiqueta", tamanho, x, y, cor, opacidade, 0.12, ancora)


def pinha_inteira(cx, cy, raio, cor_corpo=TERRACOTA, cor_destaque=VERDE_CLARO):
    """A pinha da marca centrada em (cx, cy). A geometria nasce com raio 270."""
    corpo, destaque, _ = PINHA
    esc = raio / 270
    return (f'<g transform="translate({cx} {cy}) scale({esc:.4f})"><path d="{corpo}" fill="{cor_corpo}"/>'
            f'<path d="{destaque}" fill="{cor_destaque}"/></g>')


def arte(id_servico, cx, cy, lado):
    esc = lado / 400
    pecas = "".join(f'<path d="{p["d"]}" fill="{VERDE_CLARO if p["verde"] else TERRACOTA}"/>' for p in ARTES[id_servico])
    return f'<g transform="translate({cx} {cy}) scale({esc:.4f})">{pecas}</g>'


def logo(x, y, altura, versao="cor", formato="horizontal"):
    """Embute o SVG do logo sem redesenhá-lo; `y` é o topo."""
    bruto = (LOGO / f"pine-{formato}-{versao}.svg").read_text()
    interno = bruto[bruto.index(">") + 1:bruto.rindex("</svg>")]
    vb = bruto.split('viewBox="')[1].split('"')[0].split()
    esc = altura / float(vb[3])
    return f'<g transform="translate({x} {y}) scale({esc:.4f})">{interno}</g>'


def rodape(l, a, margem=84):
    return logo(margem, a - margem - 48, 48) + etiqueta("pine.net.br", l - margem, a - margem - 12, 28, ancora="fim")


def exportar(caminho, l, a, conteudo, fundo=TINTA):
    caminho.parent.mkdir(parents=True, exist_ok=True)
    fonte = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {l} {a}" width="{l}" height="{a}">'
             f'<rect width="{l}" height="{a}" fill="{fundo}"/>{conteudo}</svg>')
    r = subprocess.run(["rsvg-convert"], input=fonte.encode(), capture_output=True, check=True)
    Image.open(BytesIO(r.stdout)).convert("RGB").save(caminho, optimize=True)


# Instagram, retrato 4:5
L, A = 1080, 1350
M = 84


def post_manifesto():
    c = texto("Você pede.", "titulo", 164, M, 300) + texto("Acontece.", "titulo", 164, M, 480)
    return c + pinha_inteira(790, 1090, 470) + logo(M, A - M - 48, 48)


def capa_jornada():
    c = etiqueta("Como acontece", M, 150)
    c += texto("Do pedido", "titulo", 132, M, 330) + texto("ao ar.", "titulo", 132, M, 480)
    c += pinha_inteira(790, 1090, 470)
    return c + logo(M, A - M - 48, 48)


def trilha(atual, y):
    """Os seis pinhões do rastreio: feitos em terracota, futuros apagados, o último verde ao chegar."""
    c = ""
    passo = (L - 2 * M - 40) / 5
    for i in range(6):
        cx = M + 20 + i * passo
        cor, opacidade = TERRACOTA, 1.0
        if i > atual:
            cor, opacidade = CREME, 0.15
        elif i == 5:
            cor = VERDE_CLARO
        d, _ = pinhao(cx, y, 0, 54, 32)
        c += f'<path d="{d}" fill="{cor}" fill-opacity="{opacidade}"/>'
    return c


def slide_jornada(i):
    frase, apoio, etapa = PASSOS[i]
    c = etiqueta(f"{i + 1:02d} de 06", M, 150) + etiqueta(etapa, L - M, 150, ancora="fim")
    tamanho = 148
    linhas = quebrar(frase, "titulo", tamanho, L - 2 * M)
    for k, linha in enumerate(linhas):
        c += texto(linha, "titulo", tamanho, M, 520 + k * tamanho * 1.08)
    y = 520 + (len(linhas) - 1) * tamanho * 1.08 + 110
    c += paragrafo(apoio, "texto", 42, M, y, L - 2 * M, opacidade=0.7)[0]
    return c + trilha(i, 1090) + rodape(L, A)


def post_servico(i):
    id_servico, prazo, nome, frase = SERVICOS[i]
    c = etiqueta(f"{i + 1:02d} · {prazo}", M, 150)
    c += arte(id_servico, L / 2, 520, 600)
    c += texto(nome, "titulo", 104, M, 985)
    c += paragrafo(frase, "texto", 36, M, 1060, 860, opacidade=0.7)[0]
    return c + rodape(L, A)


def post_fechamento():
    c, y = paragrafo("Tem uma ideia que não está aqui?", "titulo", 104, M, 260, L - 2 * M, 1.14)
    c += texto("Conta.", "titulo", 104, M, y + 190)
    c += paragrafo("Se for digital, acontece.", "titulo", 104, M, y + 380, L - 2 * M, 1.14)[0]
    return c + rodape(L, A)


# Capas dos destaques: 1080x1920, o Instagram recorta um círculo no centro
def destaque(id_servico):
    return arte(id_servico, 540, 960, 780)


def destaque_jornada():
    return pinha_inteira(540, 960, 390)


# LinkedIn. O logo ou a foto cobre o canto inferior esquerdo, então o texto fica à direita dele
def capa_empresa():
    l, a = 2256, 382
    c = texto("Você pede. Acontece.", "titulo", 96, 640, 170)
    c += etiqueta("Apps, sistemas e sites em dias. Com IA.", 643, 250, 30)
    return l, a, c + pinha_inteira(2030, 285, 235)


def capa_pessoal():
    l, a = 1584, 396
    c = texto("Você pede. Acontece.", "titulo", 64, 500, 185)
    c += etiqueta("Apps, sistemas e sites em dias. Com IA.", 502, 240, 19)
    return l, a, c + pinha_inteira(1380, 225, 175)


def main():
    ig = SAIDA / "instagram"
    exportar(ig / "01-manifesto.png", L, A, post_manifesto())

    slides = [ig / "02-como-acontece" / "00-capa.png"]
    exportar(slides[0], L, A, capa_jornada())
    for i in range(6):
        slides.append(ig / "02-como-acontece" / f"{i + 1:02d}.png")
        exportar(slides[-1], L, A, slide_jornada(i))

    for i, s in enumerate(SERVICOS):
        exportar(ig / "03-servicos" / f"{i + 1:02d}-{s[0]}.png", L, A, post_servico(i))
    exportar(ig / "04-se-for-digital.png", L, A, post_fechamento())

    exportar(ig / "destaques" / "como-acontece.png", 1080, 1920, destaque_jornada())
    for s in SERVICOS:
        exportar(ig / "destaques" / f"{s[0]}.png", 1080, 1920, destaque(s[0]))

    li = SAIDA / "linkedin"
    for nome, peca in [("capa-empresa", capa_empresa), ("capa-pessoal", capa_pessoal)]:
        l, a, c = peca()
        exportar(li / f"{nome}.png", l, a, c)

    # O LinkedIn publica carrossel como documento PDF
    paginas = [Image.open(p).convert("RGB") for p in slides]
    paginas[0].save(li / "carrossel-como-acontece.pdf", save_all=True, append_images=paginas[1:], resolution=72)

    print("Peças geradas em", SAIDA)


if __name__ == "__main__":
    main()
