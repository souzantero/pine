# Brandkit PINE

Tudo o que define a marca: conceito, tom de voz, logo, cores e tipografia. Abra `index.html` no navegador para ver o guia visual.

## Conceito

**Você pede. Acontece.** A PINE entrega soluções digitais em dias, usando tecnologia e IA. A marca precisa passar duas coisas ao mesmo tempo: a velocidade e a precisão da tecnologia, e a confiança de quem tem raiz.

**A pinha.** O símbolo é uma pinha de araucária, a árvore de Curitiba, onde a PINE nasceu. É origem, é semente, é algo que cresce.

**A espiral.** Os 89 pinhões não estão soltos: seguem o ângulo áureo (137,5°), a mesma regra matemática que a natureza usa para organizar sementes numa pinha de verdade. 89 é um número de Fibonacci. Por fora, a marca é orgânica; por dentro, é cálculo. É exatamente o que a PINE faz: tecnologia e IA organizando o trabalho para que ele simplesmente aconteça.

**O pinhão verde.** Um único pinhão é diferente dos outros. Ele é o que acontece: a entrega, o resultado, o que se destaca. Na comunicação, o verde aparece pouco e sempre com intenção.

## Tom de voz

A PINE fala como quem já fez. Direta, confiante e curta, sem precisar convencer ninguém.

| Somos | Não somos |
|---|---|
| Diretos: uma ideia por frase | Prolixos ou cheios de jargão |
| Confiantes: afirmamos | Arrogantes ou agressivos |
| Elegantes: menos é mais | Vendedores: sem "imperdível", sem urgência falsa |
| Curiosos: provocamos | Explicativos: não detalhamos o modelo de negócio |
| Seletivos: o santo precisa bater | Para todo mundo |

**Exemplos**

- Sim: "Você pede. Acontece." / "Se é digital, acontece." / "A PINE não é pra todo mundo. E tudo bem."
- Não: "Somos uma agência completa de soluções digitais inovadoras!" / "Aproveite nossas condições especiais!"

**Regras de escrita**

- "PINE" sempre em maiúsculas.
- Não usar "agência", "software house" ou "service as software".
- Não usar travessões; prefira ponto final ou vírgula.
- Sem preços e sem catálogo: cada entrega tem escopo, prazo e preço próprios.
- Credibilidade vem de estar na frente: vivemos uma revolução, e a PINE acompanha cada mudança de perto.

## Logo

| Formato | Quando usar |
|---|---|
| `horizontal` (pinha antes do nome) | Padrão: cabeçalho do site, assinaturas, documentos |
| `vertical` (pinha grande em cima do nome) | Capas, abertura de apresentações, materiais quadrados |
| `simbolo` (só a pinha) | Quando a marca já foi apresentada: avatar, selo, marca d'água, favicon |

| Versão | Fundo |
|---|---|
| `cor` | Escuro (tinta). **Versão principal da marca** |
| `negativo` | Claro (creme ou branco) |
| `mono-escuro` | Claro, quando só há uma cor disponível |
| `mono-claro` | Escuro ou sobre terracota, uma cor só |

**Cuidados**

- Na versão horizontal, a pinha tem 1,8 vez a altura das maiúsculas. Não altere a proporção.
- Respiro mínimo em volta do logo: a altura do "P".
- Tamanho mínimo da versão horizontal: 96px de largura. Abaixo disso, use só o símbolo.
- Não gire a pinha, não troque a cor dos pinhões individualmente e não mova o pinhão verde.

## Cores

| Nome | Hex | Uso |
|---|---|---|
| Tinta | `#1B1410` | Fundo principal |
| Creme | `#F3EBDD` | Texto sobre o escuro e fundo claro |
| Terracota | `#9C4A2B` | A pinha e destaques |
| Verde-pinho | `#2F6B4F` | Acento: o pinhão diferente, botões, um destaque por tela |
| Verde-pinho claro | `#5B9E78` | O acento sobre fundo escuro |

A marca vive no escuro: o logo principal é a versão `cor`, sobre tinta. Proporção sugerida em uma tela: muita tinta, creme para texto, terracota pontual e verde quase nunca. Versões claras existem para quando o fundo não pode ser escuro.

## Tipografia

| Papel | Fonte | Peso |
|---|---|---|
| Nome (logo) | Inter | SemiBold 600, caixa alta, espaçamento 0,16em |
| Títulos | Fraunces | Regular 400, caixa normal, grande e com respiro |
| Texto | Inter | Regular 400 |
| Etiquetas, menu, rótulos | JetBrains Mono | Regular 400, caixa alta, espaçamento 0,12em |

Todas estão no Google Fonts. Tokens prontos em `tokens.css`.

## Arquivos

```
brand/
├── index.html            # guia visual
├── tokens.css            # cores e fontes em CSS
├── logo/svg/             # pine-{formato}-{versao}.svg (fundo transparente, texto em curvas)
├── logo/png/             # os mesmos em PNG
├── favicon/              # favicon.svg, favicon.ico, apple-touch-icon, icon-192, icon-512
├── social/               # avatares 1080x1080, peças de Instagram e LinkedIn, textos.md
├── _gerador/gerar.py     # gera logo, favicon e avatares
└── _gerador/redes.py     # gera as peças de redes (precisa também de uharfbuzz)
```

Para regenerar (requer `rsvg-convert`, via `brew install librsvg`):

```bash
python3 -m venv /tmp/pine-venv && /tmp/pine-venv/bin/pip install fonttools pillow
/tmp/pine-venv/bin/python brand/_gerador/gerar.py
```
