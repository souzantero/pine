import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  HardDrive,
  Key,
  Settings,
  ChevronRight,
  BookOpen,
  UserPlus,
  FolderPlus,
  ShieldCheck,
} from "lucide-react";

export default function StorageProvidersGuidePage() {
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
              Configurar provedor de armazenamento
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              O provedor de armazenamento é onde os documentos enviados à base
              de conhecimento ficam guardados. A plataforma utiliza o{" "}
              <strong className="text-foreground">Amazon S3</strong> para
              armazenamento de arquivos.
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
              <a href="#conta-aws" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <UserPlus className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium">Criar conta na AWS</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#criar-bucket" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <FolderPlus className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium">Criar bucket S3</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a href="#chaves-acesso" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background transition-colors group">
                <div className="h-8 w-8 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Key className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium">Gerar chaves de acesso</span>
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

      {/* Criar conta na AWS */}
      <section id="conta-aws" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                01
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Criar conta na AWS
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Se você ainda não tem uma conta na Amazon Web Services, o
                primeiro passo é criar uma.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Acesse o console da AWS</h3>
                  <p className="text-sm text-muted-foreground">
                    Acesse <strong>aws.amazon.com</strong> e clique em{" "}
                    <strong>Create an AWS Account</strong>. Preencha seu
                    e-mail, defina uma senha e escolha um nome para a conta.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Complete o cadastro</h3>
                  <p className="text-sm text-muted-foreground">
                    Informe seus dados de contato, adicione um cartão de
                    crédito para verificação e confirme sua identidade por
                    telefone. Selecione o plano{" "}
                    <strong>Basic Support (gratuito)</strong> para começar.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Nível gratuito:</strong> a
                AWS oferece 5 GB de armazenamento gratuito no S3 pelos
                primeiros 12 meses. Para a maioria dos casos de uso com a
                PINE, esse limite é suficiente para começar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Criar bucket S3 */}
      <section id="criar-bucket" className="py-16 md:py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                02
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Criar bucket S3
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                O bucket é o contêiner onde os arquivos serão armazenados. Você
                precisará do nome do bucket e da região para configurar na
                PINE.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Acesse o serviço S3</h3>
                  <p className="text-sm text-muted-foreground">
                    No console da AWS, pesquise por <strong>S3</strong> na
                    barra de busca e selecione o serviço. Clique em{" "}
                    <strong>Create bucket</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Defina o nome e a região</h3>
                  <p className="text-sm text-muted-foreground">
                    Escolha um nome único para o bucket (por exemplo,{" "}
                    <strong>minha-empresa-pine-docs</strong>) e selecione a
                    região mais próxima da sua operação (por exemplo,{" "}
                    <strong>sa-east-1</strong> para São Paulo). Anote o nome
                    e a região, pois serão usados na configuração da PINE.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Mantenha as configurações padrão</h3>
                  <p className="text-sm text-muted-foreground">
                    As configurações padrão da AWS já são adequadas. Mantenha
                    a opção{" "}
                    <strong>Block all public access</strong> ativada para
                    garantir que os arquivos fiquem privados. Clique em{" "}
                    <strong>Create bucket</strong> para finalizar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gerar chaves de acesso */}
      <section id="chaves-acesso" className="py-16 md:py-24 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                03
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Gerar chaves de acesso
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Para que a PINE consiga acessar o bucket, é necessário criar
                um usuário no IAM (Identity and Access Management) da AWS com
                permissão de acesso ao S3 e gerar as chaves de acesso
                programático.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Acesse o IAM</h3>
                  <p className="text-sm text-muted-foreground">
                    No console da AWS, pesquise por <strong>IAM</strong> na
                    barra de busca e selecione o serviço. No menu lateral,
                    clique em <strong>Users</strong> e depois em{" "}
                    <strong>Create user</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Crie o usuário</h3>
                  <p className="text-sm text-muted-foreground">
                    Dê um nome descritivo ao usuário (por exemplo,{" "}
                    <strong>pine-s3-access</strong>). Na etapa de
                    permissões, selecione{" "}
                    <strong>Attach policies directly</strong>, pesquise por{" "}
                    <strong>AmazonS3FullAccess</strong> e marque a
                    política. Clique em <strong>Create user</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-orange-600">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Gere as chaves</h3>
                  <p className="text-sm text-muted-foreground">
                    Clique no usuário recém-criado, vá na aba{" "}
                    <strong>Security credentials</strong> e clique em{" "}
                    <strong>Create access key</strong>. Selecione{" "}
                    <strong>Third-party service</strong> como caso de uso e
                    confirme. A AWS exibirá o{" "}
                    <strong>Access Key ID</strong> e o{" "}
                    <strong>Secret Access Key</strong>. Copie ambos
                    imediatamente, pois o Secret Access Key será exibido
                    apenas uma vez.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Segurança:</strong> as
                chaves de acesso da AWS funcionam como uma senha para o seu
                bucket. Nunca compartilhe publicamente. Na PINE, as
                credenciais são armazenadas de forma segura e nunca são
                expostas após a configuração.
              </p>
              <p>
                <strong className="text-foreground">Boas práticas:</strong> a
                AWS recomenda criar um usuário IAM dedicado para cada
                aplicação, em vez de usar as credenciais da conta principal.
                Isso permite revogar o acesso a qualquer momento sem afetar
                outros serviços.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Configurar na PINE */}
      <section id="configurar-pine" className="py-16 md:py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                04
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Configurar na PINE
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Com o bucket criado e as chaves em mãos, a configuração na
                PINE é feita em duas etapas: as credenciais e os dados do
                bucket.
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
                    <strong>Configurações &gt; Provedores</strong> e
                    selecione a aba <strong>Storage</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Adicione o provedor</h3>
                  <p className="text-sm text-muted-foreground">
                    Selecione <strong>Amazon S3</strong> como provedor.
                    Preencha o campo <strong>Access Key ID</strong> e o
                    campo <strong>Secret Access Key</strong> com as chaves
                    geradas no passo anterior. Clique em{" "}
                    <strong>Adicionar Provedor</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Etapa 2: Bucket e região
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">
                    Configure a base de conhecimento
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Vá em{" "}
                    <strong>
                      Configurações &gt; Base de Conhecimento
                    </strong>
                    . Na seção <strong>Storage</strong>, selecione o
                    provedor que você acabou de configurar e preencha o{" "}
                    <strong>nome do bucket</strong> e a{" "}
                    <strong>região</strong> (por exemplo,{" "}
                    <strong>sa-east-1</strong>). Salve as configurações.
                  </p>
                </div>
              </div>

              <div className="bg-background border rounded-xl p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">4</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Pronto para enviar documentos</h3>
                  <p className="text-sm text-muted-foreground">
                    Com o storage configurado, você já pode criar coleções e
                    enviar documentos para a base de conhecimento. Os
                    arquivos serão armazenados no seu bucket S3, sob o
                    controle da sua própria conta AWS.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Lembre-se:</strong> para
                a base de conhecimento funcionar por completo, além do
                storage, você também precisa configurar o{" "}
                <Link
                  href="/platform/docs/embedding-providers"
                  className="text-primary hover:underline"
                >
                  provedor de embeddings
                </Link>
                . O storage armazena os arquivos e o provedor de embeddings
                faz a vetorização para a busca semântica.
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
              Crie sua conta e conecte seu bucket S3 para habilitar a base de
              conhecimento.
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
