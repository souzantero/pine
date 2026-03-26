import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Bot,
  ExternalLink,
  Key,
  CreditCard,
  UserPlus,
  Settings,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function LlmProvidersGuidePage() {
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
              Configurar provedor de LLM
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Para conversar com o agente de IA na PINE, você precisa
              configurar um provedor de modelos de linguagem. A plataforma
              suporta <strong className="text-foreground">OpenAI</strong> e{" "}
              <strong className="text-foreground">OpenRouter</strong>.
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
              <a href="#openai" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">Obter chave da OpenAI</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#openrouter" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium">Obter chave da OpenRouter</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#configurar-pine" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Configurar na PINE</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#qual-escolher" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Qual provedor escolher?</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* OpenAI */}
      <section id="openai" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                01
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Obter chave da OpenAI
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A OpenAI é a empresa por trás dos modelos GPT. Para usar
                modelos como GPT-4o e GPT-4.1 na PINE, você precisa de uma API
                Key da OpenAI.
              </p>
            </div>

            <div className="space-y-6">
              {/* Passo 1 */}
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <UserPlus className="h-5 w-5 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">1. Crie sua conta</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesse{" "}
                    <strong>platform.openai.com</strong>{" "}
                    e clique em <strong>Sign up</strong>. Você pode se
                    cadastrar com e-mail, Google, Microsoft ou Apple.
                    Será necessário verificar seu e-mail e confirmar seu
                    número de telefone via SMS.
                  </p>
                </div>
              </div>

              {/* Passo 2 */}
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">2. Configure o faturamento</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesse <strong>Settings &gt; Billing</strong> e adicione
                    um cartão de crédito. Novas contas recebem US$ 5 em
                    créditos gratuitos válidos por 3 meses. Após esse
                    período, o uso é cobrado pelo consumo.
                  </p>
                </div>
              </div>

              {/* Passo 3 */}
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Key className="h-5 w-5 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">3. Gere sua API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    No menu lateral, clique em <strong>API keys</strong> e
                    depois em <strong>Create new secret key</strong>. Dê um
                    nome descritivo e confirme. Copie a chave
                    imediatamente, pois a OpenAI exibe a chave apenas uma
                    vez. Guarde em um local seguro.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Importante:</strong> nunca
                compartilhe sua API Key publicamente. Trate como uma
                senha. Na PINE, suas credenciais são armazenadas de forma
                segura e nunca são expostas após a configuração.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OpenRouter */}
      <section id="openrouter" className="py-16 md:py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                02
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Obter chave da OpenRouter
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A OpenRouter é um gateway que dá acesso a mais de 100 modelos
                de diferentes provedores (OpenAI, Anthropic, Google, Meta e
                outros) através de uma única API Key.
              </p>
            </div>

            <div className="space-y-6">
              {/* Passo 1 */}
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <UserPlus className="h-5 w-5 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">1. Crie sua conta</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesse{" "}
                    <strong>openrouter.ai</strong>{" "}
                    e clique em <strong>Sign up</strong>. Você pode se
                    cadastrar com Google, GitHub ou e-mail. Verifique seu
                    e-mail para ativar a conta.
                  </p>
                </div>
              </div>

              {/* Passo 2 */}
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">2. Adicione créditos</h3>
                  <p className="text-sm text-muted-foreground">
                    A OpenRouter utiliza um sistema de créditos pré-pagos.
                    Acesse a página de <strong>Credits</strong> e adicione
                    saldo à sua conta. Você precisa ter créditos
                    disponíveis antes de utilizar a API.
                  </p>
                </div>
              </div>

              {/* Passo 3 */}
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Key className="h-5 w-5 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">3. Gere sua API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    Na página inicial, clique em{" "}
                    <strong>Get API Key</strong> ou acesse a seção{" "}
                    <strong>Keys</strong> no painel. Clique em{" "}
                    <strong>Create</strong>, dê um nome descritivo e,
                    opcionalmente, defina um limite de crédito e uma data
                    de expiração. Copie a chave imediatamente, pois a
                    OpenRouter exibe a chave apenas uma vez.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Dica:</strong> a
                OpenRouter permite definir um limite de crédito por chave.
                Isso é útil para controlar gastos e evitar cobranças
                inesperadas.
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
                Com a API Key em mãos, o próximo passo é adicioná-la à sua
                organização na PINE.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Acesse as configurações</h3>
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
                  <h3 className="font-semibold">Selecione a aba LLM</h3>
                  <p className="text-sm text-muted-foreground">
                    Na página de provedores, selecione a aba{" "}
                    <strong>LLM</strong>. Essa é a categoria dos provedores
                    de modelos de linguagem.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Adicione o provedor</h3>
                  <p className="text-sm text-muted-foreground">
                    Selecione o provedor desejado (OpenAI ou OpenRouter),
                    cole sua API Key no campo indicado e clique em{" "}
                    <strong>Adicionar Provedor</strong>. Após salvar, o
                    provedor aparecerá na lista de provedores configurados.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">4</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Comece a conversar</h3>
                  <p className="text-sm text-muted-foreground">
                    Com o provedor configurado, volte para o chat e
                    selecione o modelo desejado. Pronto. O agente já está
                    disponível para uso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qual escolher */}
      <section id="qual-escolher" className="py-16 md:py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                04
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Qual provedor escolher?
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-background border rounded-xl p-6 space-y-4">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold">OpenAI</h3>
                <p className="text-sm text-muted-foreground">
                  Acesso direto aos modelos da OpenAI (GPT-4o, GPT-4.1 e
                  outros). Ideal se você pretende usar exclusivamente
                  modelos GPT.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">+</span>
                    Conexão direta com a OpenAI
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">+</span>
                    Menor latência para modelos GPT
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">+</span>
                    Créditos gratuitos para novas contas
                  </li>
                </ul>
              </div>

              <div className="bg-background border rounded-xl p-6 space-y-4">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-semibold">OpenRouter</h3>
                <p className="text-sm text-muted-foreground">
                  Gateway unificado com acesso a mais de 100 modelos de
                  diferentes provedores. Ideal se você quer flexibilidade
                  para experimentar modelos variados.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">+</span>
                    Acesso a modelos de múltiplos provedores
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">+</span>
                    Uma única chave para tudo
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-0.5">+</span>
                    Controle de limite de crédito por chave
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Você pode configurar ambos os provedores na mesma
                organização. Isso permite escolher o modelo mais adequado
                para cada conversa diretamente no chat.
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
              Crie sua conta e configure seu provedor de LLM em minutos.
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
