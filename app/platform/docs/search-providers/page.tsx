import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Globe,
  Key,
  Settings,
  ChevronRight,
  BookOpen,
  UserPlus,
} from "lucide-react";

export default function SearchProvidersGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/platform">
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
              Configurar provedor de busca na web
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              O provedor de busca na web permite que o agente pesquise
              informações atualizadas na internet em tempo real. Atualmente, a
              plataforma suporta o{" "}
              <strong className="text-foreground">Tavily</strong> como
              provedor de pesquisa.
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
              <a href="#o-que-e" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">O que é o Tavily</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#obter-chave" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Key className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Obter chave do Tavily</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#configurar-pine" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Configurar na PINE</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* O que é o Tavily */}
      <section id="o-que-e" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                01
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                O que é o Tavily
              </h2>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                O Tavily é uma API de pesquisa na web projetada especificamente
                para agentes de IA. Diferente de mecanismos de busca
                tradicionais, o Tavily retorna conteúdos já extraídos e
                estruturados, prontos para serem consumidos por modelos de
                linguagem.
              </p>
              <p>
                Na PINE, o Tavily é utilizado em duas ferramentas: a busca na
                web, que pesquisa informações em múltiplas fontes, e a leitura
                de páginas, que extrai o conteúdo completo de um link
                compartilhado pelo usuário.
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
                Obter chave do Tavily
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                O processo é rápido e não exige cartão de crédito. O plano
                gratuito inclui 1.000 chamadas de API por mês.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">1. Crie sua conta</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesse <strong>tavily.com</strong> e clique em{" "}
                    <strong>Get API Key</strong> ou{" "}
                    <strong>Sign Up</strong>. Você pode se cadastrar com
                    e-mail, Google ou GitHub. Verifique seu e-mail para
                    ativar a conta.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Key className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">2. Copie sua API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    Após o login, o painel principal do Tavily já exibe sua
                    API Key. A chave começa com{" "}
                    <strong>tvly-</strong> seguido de uma sequência
                    alfanumérica. Copie a chave e guarde em um local seguro.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Plano gratuito:</strong> o
                Tavily oferece 1.000 chamadas de API gratuitas por mês, sem
                necessidade de cartão de crédito. Para a maioria dos casos de
                uso, esse limite é suficiente para começar. Planos pagos estão
                disponíveis para volumes maiores.
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
                Com a API Key copiada, a configuração na PINE é feita em
                poucos passos.
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
                  <h3 className="font-semibold">Selecione a aba Busca na Web</h3>
                  <p className="text-sm text-muted-foreground">
                    Na página de provedores, selecione a aba{" "}
                    <strong>Busca na Web</strong>. Selecione{" "}
                    <strong>Tavily</strong> como provedor, cole sua API Key
                    e clique em <strong>Adicionar Provedor</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Pronto para usar</h3>
                  <p className="text-sm text-muted-foreground">
                    Com o provedor configurado, o agente já pode realizar
                    buscas na web e ler páginas durante as conversas. A
                    busca é acionada automaticamente quando o agente
                    identifica que a pergunta exige informações atualizadas.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Dica:</strong> após
                configurar o Tavily, você também pode ajustar o comportamento
                da busca na web em{" "}
                <strong>Configurações &gt; Ferramentas</strong>. Lá é
                possível habilitar a sumarização de conteúdo, que aplica a
                engenharia de contexto da PINE para entregar resultados mais
                precisos ao agente.
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
              Crie sua conta e habilite a busca na web para o agente em
              minutos.
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
