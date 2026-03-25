import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Brain,
  Key,
  Settings,
  ChevronRight,
  BookOpen,
  Layers,
  Cpu,
} from "lucide-react";

export default function EmbeddingProvidersGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo size="md" />
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Começar grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto px-4 h-12 flex items-center">
          <Link
            href="/platform/docs"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Documentação
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 md:py-24 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              Guia de configuração
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Configurar provedor de embeddings
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              O provedor de embeddings é responsável pela vetorização dos
              documentos enviados à base de conhecimento. Ele transforma textos
              em representações numéricas que permitem a busca semântica.
              Atualmente, a plataforma suporta a{" "}
              <strong className="text-foreground">OpenAI</strong> como
              provedor de embeddings.
            </p>
          </div>
        </div>
      </section>

      {/* Navegação */}
      <section className="py-12 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Nesta página
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <a href="#o-que-sao" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">O que são embeddings</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#obter-chave" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Key className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">Obter chave da OpenAI</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#configurar-pine" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Configurar na PINE</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#modelos" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Layers className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Modelos disponíveis</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* O que são embeddings */}
      <section id="o-que-sao" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                01
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                O que são embeddings
              </h2>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Embeddings são representações numéricas de textos. Quando você
                envia um documento para a base de conhecimento da PINE, o
                conteúdo é dividido em trechos menores e cada trecho é
                convertido em um vetor numérico pelo provedor de embeddings.
              </p>
              <p>
                Esses vetores capturam o significado semântico do texto. Quando
                o agente recebe uma pergunta, a pergunta também é convertida em
                um vetor e comparada com os vetores dos documentos. Assim, a
                busca encontra os trechos mais relevantes mesmo que as palavras
                exatas não coincidam.
              </p>
              <p>
                Sem o provedor de embeddings configurado, a funcionalidade de
                base de conhecimento não fica disponível.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Obter chave */}
      <section id="obter-chave" className="py-16 md:py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                02
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Obter chave da OpenAI
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                O provedor de embeddings da PINE utiliza a API da OpenAI. O
                processo para obter a chave é o mesmo utilizado para o
                provedor de LLM.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-600">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Crie sua conta na OpenAI</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesse <strong>platform.openai.com</strong> e clique em{" "}
                    <strong>Sign up</strong>. Cadastre-se com e-mail, Google,
                    Microsoft ou Apple. Verifique seu e-mail e confirme seu
                    número de telefone via SMS.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-600">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Configure o faturamento</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesse <strong>Settings &gt; Billing</strong> e adicione um
                    cartão de crédito. Novas contas recebem US$ 5 em créditos
                    gratuitos válidos por 3 meses. Os modelos de embeddings
                    possuem custo bastante reduzido em comparação com modelos
                    de linguagem.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-green-600">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Gere sua API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    No menu lateral, clique em <strong>API keys</strong> e
                    depois em <strong>Create new secret key</strong>. Copie a
                    chave imediatamente, pois a OpenAI exibe a chave apenas uma
                    vez.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Dica:</strong> se você já
                configurou a OpenAI como provedor de LLM, pode usar a mesma
                conta. Porém, na PINE, o provedor de embeddings é configurado
                separadamente na aba <strong>Embeddings</strong> da página de
                provedores. Você pode reutilizar a mesma API Key ou gerar uma
                chave dedicada para cada finalidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Configurar na PINE */}
      <section id="configurar-pine" className="py-16 md:py-24 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                03
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Configurar na PINE
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A configuração do provedor de embeddings é feita em duas
                etapas: primeiro você adiciona as credenciais e depois
                seleciona o modelo na configuração da base de conhecimento.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Etapa 1: Credenciais
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Acesse os provedores</h3>
                  <p className="text-sm text-muted-foreground">
                    Dentro da plataforma, vá em{" "}
                    <strong>Configurações &gt; Provedores</strong>. Você
                    precisa ter a permissão de gerenciar a organização para
                    acessar essa página.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Selecione a aba Embeddings</h3>
                  <p className="text-sm text-muted-foreground">
                    Na página de provedores, selecione a aba{" "}
                    <strong>Embeddings</strong>. Selecione{" "}
                    <strong>OpenAI Embeddings</strong> como provedor, cole sua
                    API Key e clique em <strong>Adicionar Provedor</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Etapa 2: Modelo de embedding
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">
                    Acesse as configurações de conhecimento
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Vá em{" "}
                    <strong>
                      Configurações &gt; Base de Conhecimento
                    </strong>
                    . Nessa página, na seção <strong>Embedding</strong>,
                    selecione o provedor que você acabou de configurar e
                    escolha o modelo desejado.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">4</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Salve e comece a usar</h3>
                  <p className="text-sm text-muted-foreground">
                    Salve as configurações. A partir de agora, os documentos
                    enviados às coleções serão automaticamente vetorizados e
                    estarão disponíveis para consulta pelo agente no chat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modelos disponíveis */}
      <section id="modelos" className="py-16 md:py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                04
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Modelos disponíveis
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A PINE suporta três modelos de embeddings da OpenAI. Cada um
                possui características diferentes de dimensionalidade, custo e
                qualidade.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Cpu className="h-5 w-5 text-purple-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">text-embedding-3-large</h3>
                  <p className="text-sm text-muted-foreground">
                    O modelo mais preciso da OpenAI para embeddings. Gera
                    vetores de maior dimensionalidade, o que se traduz em
                    buscas semânticas mais precisas. Recomendado quando a
                    qualidade da busca é prioridade.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Cpu className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">text-embedding-3-small</h3>
                  <p className="text-sm text-muted-foreground">
                    Um bom equilíbrio entre custo e qualidade. Mais rápido e
                    mais barato que o modelo large, com desempenho adequado
                    para a maioria dos casos de uso.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Cpu className="h-5 w-5 text-green-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">text-embedding-ada-002</h3>
                  <p className="text-sm text-muted-foreground">
                    O modelo legado da OpenAI. Ainda amplamente utilizado e
                    suportado, com vetores de 1536 dimensões. Funciona bem para
                    a maioria dos cenários, mas os modelos mais recentes
                    oferecem melhor desempenho.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Importante:</strong> ao
                trocar o modelo de embeddings após já ter documentos
                indexados, os documentos existentes precisarão ser
                reprocessados, pois cada modelo gera vetores em formatos
                diferentes. Escolha o modelo antes de começar a enviar
                documentos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Pronto para configurar?
            </h2>
            <p className="text-muted-foreground">
              Crie sua conta e configure o provedor de embeddings para
              habilitar a base de conhecimento.
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/signup">Criar conta grátis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <Link href="/">
                <Logo size="md" />
              </Link>
              <p className="text-sm text-muted-foreground">
                Seus dados, seus sistemas, sua IA.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Contato</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <a
                    href="mailto:ai@pine.net.br"
                    className="hover:text-foreground transition-colors"
                  >
                    ai@pine.net.br
                  </a>
                </p>
                <p>Av. Sete de Setembro, 6556</p>
                <p>Curitiba/PR</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Política de Privacidade
                  </Link>
                </p>
                <p>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Termos de Uso
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <span>&copy; 2025 Pine Software. Todos os direitos reservados.</span>
            <span>CNPJ: 37.100.281/0001-64</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
