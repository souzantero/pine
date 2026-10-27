import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade | PINE",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            Última atualização: Outubro de 2026
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Introdução</h2>
            <p>
              A Pine Technology (&quot;PINE&quot;, &quot;nós&quot; ou &quot;nosso&quot;), inscrita no CNPJ
              37.100.281/0001-64, com sede na Av. Sete de Setembro, 6556,
              Curitiba/PR, é responsável pelo tratamento dos seus dados pessoais
              conforme descrito nesta Política de Privacidade.
            </p>
            <p>
              Esta política descreve como coletamos, usamos, armazenamos e
              protegemos suas informações quando você visita o site pine.net.br,
              entra em contato com a PINE ou contrata nossos serviços.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. Dados que Coletamos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Dados de contato:</strong> nome, empresa, telefone,
                e-mail e a descrição do que você precisa, informados no
                formulário do site. O formulário não armazena esses dados no
                site: ao enviar, eles são transferidos para uma mensagem de
                WhatsApp que só chega à PINE se você confirmar o envio.
              </li>
              <li>
                <strong>Dados de conversa:</strong> mensagens e arquivos que
                você nos envia por WhatsApp, e-mail ou outros canais durante o
                atendimento.
              </li>
              <li>
                <strong>Dados de contratação:</strong> dados da empresa e dos
                responsáveis necessários para propostas, contratos e
                faturamento.
              </li>
              <li>
                <strong>Dados de projeto:</strong> materiais, informações e
                acessos a sistemas que o cliente nos fornece para a execução de
                um serviço contratado.
              </li>
              <li>
                <strong>Dados técnicos:</strong> informações registradas
                automaticamente pela infraestrutura que hospeda o site, como
                endereço IP, navegador e páginas acessadas. O site não utiliza
                cookies de rastreamento nem ferramentas de publicidade.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. Como Usamos seus Dados</h2>
            <p>Utilizamos suas informações para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Responder ao seu contato e entender o que você precisa.</li>
              <li>Elaborar propostas com escopo, prazo e preço.</li>
              <li>Executar os serviços contratados.</li>
              <li>Emitir documentos fiscais e cumprir obrigações legais.</li>
              <li>Manter o site funcionando com segurança.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Compartilhamento de Dados</h2>
            <p>
              Não vendemos seus dados pessoais. Compartilhamos informações
              apenas nas seguintes situações:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Canais de comunicação:</strong> mensagens enviadas por
                WhatsApp ou e-mail trafegam pelos serviços desses provedores e
                estão sujeitas às políticas deles.
              </li>
              <li>
                <strong>Ferramentas de IA e infraestrutura:</strong> na execução
                dos serviços, utilizamos ferramentas de inteligência artificial
                e serviços de nuvem de terceiros, que podem processar
                informações do projeto apenas na medida necessária para a
                entrega.
              </li>
              <li>
                <strong>Obrigações legais:</strong> quando exigido por lei ou
                ordem judicial.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Armazenamento e Segurança</h2>
            <p>
              Utilizamos criptografia em trânsito (HTTPS/TLS) e adotamos medidas
              técnicas e organizacionais para proteger suas informações contra
              acesso não autorizado, perda ou destruição. Acessos a sistemas do
              cliente são usados apenas para o serviço contratado e podem ser
              revogados pelo cliente a qualquer momento.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">6. Seus Direitos</h2>
            <p>
              Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Confirmar a existência de tratamento e acessar seus dados.</li>
              <li>Corrigir dados incompletos ou desatualizados.</li>
              <li>Solicitar a exclusão dos seus dados.</li>
              <li>Revogar consentimento a qualquer momento.</li>
              <li>Solicitar portabilidade dos dados.</li>
            </ul>
            <p>
              Para exercer seus direitos, entre em contato pelo e-mail{" "}
              <a
                href="mailto:ai@pine.net.br"
                className="text-primary hover:underline"
              >
                ai@pine.net.br
              </a>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">7. Retenção de Dados</h2>
            <p>
              Mantemos os dados de contato enquanto houver relacionamento
              comercial ou interesse em uma proposta. Dados de projeto são
              mantidos pelo tempo necessário à execução do serviço e conforme o
              que for acordado em contrato. Dados exigidos por obrigações legais
              e fiscais são mantidos pelos prazos previstos em lei.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">8. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta política periodicamente. A data da última
              atualização fica sempre no topo desta página.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">9. Contato</h2>
            <p>
              Para dúvidas sobre esta política ou sobre o tratamento dos seus
              dados, entre em contato:
            </p>
            <ul className="list-none space-y-1">
              <li>
                <strong>E-mail:</strong>{" "}
                <a
                  href="mailto:ai@pine.net.br"
                  className="text-primary hover:underline"
                >
                  ai@pine.net.br
                </a>
              </li>
              <li>
                <strong>Endereço:</strong> Av. Sete de Setembro, 6556, Curitiba/PR
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
