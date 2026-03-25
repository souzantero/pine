import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Building,
  Users,
  Shield,
  MessageSquare,
  Search,
  FileText,
  Settings,
  FolderOpen,
  Bot,
  Key,
  Globe,
  HardDrive,
  Brain,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export default function DocsPage() {
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

      {/* Hero */}
      <section className="py-16 md:py-24 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              Documentação
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Como funciona a plataforma
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Entenda a estrutura da PINE, como interagir com agentes de IA e
              o que você precisa configurar para aproveitar todos os recursos.
            </p>
          </div>
        </div>
      </section>

      {/* Navegação por seções */}
      <section className="py-12 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Nesta página
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <a href="#visao-geral" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Visão geral</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#organizacoes" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Organizações e equipes</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#conversas" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Conversas com IA</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#ferramentas" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Ferramentas e busca na web</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#conhecimento" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Base de conhecimento</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#provedores" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Configuração de provedores</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Visão Geral */}
      <section id="visao-geral" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                01
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Visão geral
              </h2>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                A PINE é uma plataforma de agentes de IA que funciona de forma
                semelhante a ferramentas de mercado como ChatGPT, Gemini, Claude e
                DeepSeek. A diferença é que você tem controle total sobre a
                infraestrutura: escolhe seus provedores, conecta seus documentos e
                gerencia o acesso da sua equipe.
              </p>
              <p>
                A plataforma é <strong className="text-foreground">multi-tenant</strong>. Isso significa
                que cada organização opera de forma isolada, com seus próprios
                membros, configurações, documentos e conversas. Um mesmo
                usuário pode participar de múltiplas organizações, cada uma com
                suas próprias regras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Organizações e Equipes */}
      <section id="organizacoes" className="py-16 md:py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                02
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Organizações e equipes
              </h2>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Ao criar sua conta, o primeiro passo é criar uma{" "}
                <strong className="text-foreground">organização</strong>. Ela
                é o espaço onde tudo acontece: conversas, documentos,
                configurações e membros.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-background border rounded-xl p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Membros</h3>
                <p className="text-sm text-muted-foreground">
                  Convide pessoas para sua organização por e-mail. Cada membro
                  acessa a plataforma com sua própria conta.
                </p>
              </div>
              <div className="bg-background border rounded-xl p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Papéis</h3>
                <p className="text-sm text-muted-foreground">
                  Crie papéis personalizados para definir o que cada grupo de
                  membros pode fazer dentro da organização.
                </p>
              </div>
              <div className="bg-background border rounded-xl p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Permissões</h3>
                <p className="text-sm text-muted-foreground">
                  Cada papel possui permissões específicas: gerenciar conversas,
                  membros, configurações, base de conhecimento e mais.
                </p>
              </div>
            </div>

            <div className="text-lg text-muted-foreground leading-relaxed">
              <p>
                Esse modelo garante que cada pessoa tenha acesso apenas ao que
                precisa. Um administrador pode gerenciar provedores e membros,
                enquanto um colaborador pode apenas criar conversas e consultar
                documentos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conversas com IA */}
      <section id="conversas" className="py-16 md:py-24 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                03
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Conversas com IA
              </h2>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                A experiência de uso é familiar: uma interface de chat onde você
                conversa diretamente com um agente de IA. Se você já usou
                ChatGPT, Gemini, Claude ou DeepSeek, a dinâmica é a mesma.
                Envie uma mensagem e receba uma resposta inteligente em tempo
                real.
              </p>
              <p>
                A diferença está no que acontece por trás. O agente da PINE
                pode acessar a base de conhecimento da sua organização,
                realizar buscas na web e utilizar as ferramentas configuradas
                para dar respostas mais completas e contextualizadas.
              </p>
              <p>
                Cada conversa fica registrada como uma{" "}
                <strong className="text-foreground">sessão</strong> dentro
                da organização, mantendo o histórico acessível para consultas
                futuras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ferramentas e Busca na Web */}
      <section id="ferramentas" className="py-16 md:py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                04
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Ferramentas e busca na web
              </h2>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                O agente não depende apenas do que ele já sabe. Quando
                necessário, ele pode buscar informações atualizadas na web em
                tempo real para complementar suas respostas.
              </p>
              <p>
                A busca na web é acionada automaticamente pelo agente quando
                ele identifica que a pergunta exige dados recentes ou
                informações que vão além do seu conhecimento base.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Busca na web</h3>
                  <p className="text-sm text-muted-foreground">
                    O agente pesquisa múltiplas fontes em paralelo, deduplica
                    os resultados e entrega o conteúdo processado para
                    fundamentar a resposta.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Leitura de páginas</h3>
                  <p className="text-sm text-muted-foreground">
                    Quando o usuário compartilha um link, o agente extrai o
                    conteúdo completo da página e o processa antes de
                    responder.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground">
                Engenharia de contexto
              </h3>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  A PINE não entrega o conteúdo bruto da web diretamente para
                  o agente. Cada página encontrada passa por uma etapa de
                  sumarização técnica que identifica o tema central, preserva
                  fatos, estatísticas, dados críticos e trechos relevantes,
                  descartando o que é ruído.
                </p>
                <p>
                  Essa sumarização é adaptada ao tipo de conteúdo. Páginas de
                  notícia são processadas com foco nos fatos essenciais.
                  Conteúdos científicos preservam metodologia, resultados e
                  conclusões. Documentações técnicas mantêm exemplos de código,
                  parâmetros e instruções. O resultado é um contexto muito mais
                  denso e relevante para o agente, o que se traduz em respostas
                  significativamente melhores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Base de Conhecimento */}
      <section id="conhecimento" className="py-16 md:py-24 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                05
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Base de conhecimento
              </h2>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Você pode enviar documentos PDF para a plataforma e
                utilizá-los como base de conhecimento para o agente. Isso
                permite que ele responda perguntas com base nas informações
                reais da sua empresa, como manuais, políticas, relatórios e
                qualquer outro documento relevante.
              </p>
              <p>
                Para organizar os documentos, a plataforma utiliza{" "}
                <strong className="text-foreground">coleções</strong>. Cada
                coleção agrupa documentos por tema, projeto ou equipe,
                facilitando a gestão e a busca.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-background border rounded-xl p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Coleções</h3>
                <p className="text-sm text-muted-foreground">
                  Organize seus documentos em coleções temáticas. Crie quantas
                  precisar para separar por área, projeto ou finalidade.
                </p>
              </div>
              <div className="bg-background border rounded-xl p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Documentos</h3>
                <p className="text-sm text-muted-foreground">
                  Faça upload de PDFs dentro das coleções. Os documentos são
                  processados e indexados automaticamente para consulta via
                  chat.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground">
                Busca híbrida: além do RAG tradicional
              </h3>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  A maioria das plataformas de RAG utiliza apenas busca
                  vetorial para encontrar trechos relevantes nos documentos.
                  A PINE vai além. Quando um documento é enviado, o conteúdo
                  é dividido em trechos e cada trecho passa por uma dupla
                  indexação: vetorial (embeddings que capturam o significado
                  semântico) e por palavras-chave (indexação de texto
                  completo com suporte à língua portuguesa).
                </p>
                <p>
                  Na hora da consulta, o agente realiza uma{" "}
                  <strong className="text-foreground">busca híbrida</strong>.
                  A busca vetorial encontra trechos semanticamente
                  semelhantes, mesmo que as palavras sejam diferentes. A
                  busca por palavras-chave encontra correspondências exatas
                  de termos específicos, como nomes, códigos e terminologias
                  técnicas. Os resultados das duas buscas são então
                  combinados por um algoritmo de fusão que prioriza trechos
                  que aparecem bem ranqueados em ambas as buscas.
                </p>
                <p>
                  Essa abordagem resolve uma limitação conhecida do RAG
                  vetorial tradicional: a dificuldade em localizar termos
                  exatos e nomenclaturas de domínio. Com a busca híbrida, a
                  plataforma entrega resultados mais precisos e confiáveis,
                  combinando compreensão semântica com precisão lexical.
                </p>
              </div>
            </div>

            <div className="text-lg text-muted-foreground leading-relaxed">
              <p>
                Quando o agente recebe uma pergunta, ele busca
                automaticamente nos documentos da organização para
                fundamentar a resposta, citando as fontes utilizadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Configuração de Provedores */}
      <section id="provedores" className="py-16 md:py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                06
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Configuração de provedores
              </h2>
            </div>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Para que cada funcionalidade esteja disponível, é necessário
                configurar os provedores correspondentes nas configurações da
                organização. A PINE não impõe um provedor específico. Você
                escolhe e conecta os serviços que prefere.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href="/platform/docs/llm-providers"
                className="bg-background border rounded-xl p-6 flex items-start gap-4 hover:border-primary/30 transition-colors group"
              >
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-green-600" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold">Provedor de LLM</h3>
                  <p className="text-sm text-muted-foreground">
                    Necessário para conversar com o agente. A plataforma
                    suporta <strong>OpenAI</strong> e <strong>OpenRouter</strong> como
                    provedores de modelos de linguagem.
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </Link>

              <Link
                href="/platform/docs/search-providers"
                className="bg-background border rounded-xl p-6 flex items-start gap-4 hover:border-primary/30 transition-colors group"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold">Provedor de busca na web</h3>
                  <p className="text-sm text-muted-foreground">
                    Necessário para habilitar a busca na web. Atualmente, a
                    plataforma suporta o <strong>Tavily</strong> como provedor
                    de pesquisa.
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </Link>

              <Link
                href="/platform/docs/storage-providers"
                className="bg-background border rounded-xl p-6 flex items-start gap-4 hover:border-primary/30 transition-colors group"
              >
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <HardDrive className="h-5 w-5 text-orange-600" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold">Provedor de armazenamento</h3>
                  <p className="text-sm text-muted-foreground">
                    Necessário para a base de conhecimento. O{" "}
                    <strong>Amazon S3</strong> é utilizado para armazenar os
                    arquivos enviados à plataforma.
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </Link>

              <Link
                href="/platform/docs/embedding-providers"
                className="bg-background border rounded-xl p-6 flex items-start gap-4 hover:border-primary/30 transition-colors group"
              >
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-semibold">Provedor de embeddings</h3>
                  <p className="text-sm text-muted-foreground">
                    Necessário para a base de conhecimento. Responsável pela
                    vetorização dos documentos, permitindo a busca semântica
                    nos conteúdos enviados.
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </Link>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Cada provedor é configurado independentemente. Você só precisa
                configurar os provedores das funcionalidades que deseja
                utilizar. Por exemplo, se não precisa de busca na web, não é
                necessário configurar o Tavily.
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
              Pronto para começar?
            </h2>
            <p className="text-muted-foreground">
              Crie sua conta gratuitamente e configure sua organização em
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
