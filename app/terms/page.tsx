import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Uso | PINE",
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-8">Termos de Uso</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">
            Última atualização: Outubro de 2026
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar o site pine.net.br ou entrar em contato com a PINE,
              operada pela Pine Technology (CNPJ 37.100.281/0001-64), você
              concorda com estes Termos de Uso. Se não concordar, não utilize o
              site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. Sobre a PINE</h2>
            <p>
              A PINE desenvolve soluções digitais sob demanda usando engenharia e
              inteligência artificial. Nossos serviços incluem:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Entregas:</strong> desenvolvimento de landing pages,
                sites, aplicativos, automações, agentes de IA, criativos, vídeos
                e outras soluções digitais.
              </li>
              <li>
                <strong>IA na sua empresa:</strong> diagnóstico da operação,
                relatório de oportunidades de uso de IA e, opcionalmente,
                implementação da infraestrutura correspondente.
              </li>
              <li>
                <strong>Treinamento:</strong> capacitação de equipes no uso de
                agentes de IA.
              </li>
            </ul>
            <p>
              As informações do site, incluindo exemplos de serviços e prazos,
              têm caráter ilustrativo e não constituem oferta vinculante.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. Propostas e Contratação</h2>
            <p>
              Cada serviço é contratado a partir de uma proposta específica, que
              define escopo, prazo, preço e condições de pagamento. Em caso de
              divergência entre estes termos e a proposta ou contrato aceito, a
              proposta ou contrato prevalece.
            </p>
            <p>
              Os prazos citados no site são referências para serviços típicos.
              O prazo vinculante é o informado na proposta e começa a contar a
              partir da aprovação e do recebimento das informações e materiais
              necessários.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Responsabilidades do Cliente</h2>
            <p>Para que o prazo combinado seja cumprido, o cliente se compromete a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer informações verdadeiras, completas e atualizadas.</li>
              <li>Enviar materiais, conteúdos e acessos necessários em tempo hábil.</li>
              <li>Responder a dúvidas e aprovações dentro dos prazos combinados.</li>
              <li>
                Garantir que tem os direitos sobre os conteúdos e marcas que
                fornece para uso nos projetos.
              </li>
            </ul>
            <p>
              Atrasos causados pela falta desses itens suspendem o prazo de
              entrega pelo período correspondente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Uso de Inteligência Artificial</h2>
            <p>
              A PINE utiliza ferramentas de inteligência artificial de
              terceiros na execução dos serviços. Todo resultado entregue passa
              por revisão da nossa equipe.
            </p>
            <p>
              Quando uma solução é implementada sobre plataformas, agentes ou
              ferramentas de terceiros, o uso delas pelo cliente está sujeito aos
              termos e aos custos de cada fornecedor, que não estão incluídos no
              preço do serviço, salvo indicação expressa na proposta.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">6. Confidencialidade</h2>
            <p>
              Informações, dados e acessos compartilhados pelo cliente são
              tratados como confidenciais e usados apenas para a execução do
              serviço contratado, conforme nossa{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">7. Propriedade Intelectual</h2>
            <p>
              O site da PINE, incluindo textos, design e marcas, é propriedade
              da Pine Technology e protegido por leis de propriedade
              intelectual. A titularidade e o licenciamento do que é entregue em
              cada projeto são definidos na respectiva proposta ou contrato.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">8. Limitação de Responsabilidade</h2>
            <p>Na máxima extensão permitida por lei, a PINE não se responsabiliza por:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Danos indiretos, incidentais ou consequenciais.</li>
              <li>Perda de lucros ou oportunidades de negócio.</li>
              <li>
                Indisponibilidade, mudanças de termos ou de preços de serviços e
                ferramentas de terceiros.
              </li>
              <li>Decisões tomadas pelo cliente com base nos resultados entregues.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">9. Links de Terceiros</h2>
            <p>
              O site contém links para serviços de terceiros, como WhatsApp,
              Instagram e LinkedIn. O uso desses serviços é regido pelos termos e
              políticas de cada um.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">10. Alterações nos Termos</h2>
            <p>
              Podemos modificar estes termos a qualquer momento. A data da
              última atualização fica sempre no topo desta página. Serviços já
              contratados seguem as condições da proposta aceita.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">11. Legislação Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis brasileiras. Qualquer disputa
              será resolvida no foro da comarca de Curitiba/PR.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">12. Contato</h2>
            <p>Para dúvidas sobre estes termos, entre em contato:</p>
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
