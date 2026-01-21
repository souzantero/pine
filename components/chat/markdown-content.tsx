"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

function CodeBlock({
  language,
  children,
}: {
  language: string | undefined;
  children: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3">
      <div className="flex items-center justify-between bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-t-md">
        <span>{language || "text"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors"
          aria-label="Copiar código"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || "text"}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: "0.375rem",
          borderBottomRightRadius: "0.375rem",
          fontSize: "0.8125rem",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Blocos de código
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");

          // Código inline vs bloco
          const isInline = !match && !codeString.includes("\n");

          if (isInline) {
            return (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          }

          return <CodeBlock language={match?.[1]}>{codeString}</CodeBlock>;
        },

        // Links
        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {children}
            </a>
          );
        },

        // Headers
        h1({ children }) {
          return (
            <h1 className="text-xl font-bold mt-4 mb-2 first:mt-0">
              {children}
            </h1>
          );
        },
        h2({ children }) {
          return (
            <h2 className="text-lg font-semibold mt-3 mb-2 first:mt-0">
              {children}
            </h2>
          );
        },
        h3({ children }) {
          return (
            <h3 className="text-base font-semibold mt-3 mb-1 first:mt-0">
              {children}
            </h3>
          );
        },

        // Parágrafos
        p({ children }) {
          return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
        },

        // Listas
        ul({ children }) {
          return <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>;
        },
        ol({ children }) {
          return (
            <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
          );
        },
        li({ children }) {
          return <li className="leading-relaxed">{children}</li>;
        },

        // Blockquote
        blockquote({ children }) {
          return (
            <blockquote className="border-l-2 border-muted-foreground/30 pl-3 italic text-muted-foreground my-2">
              {children}
            </blockquote>
          );
        },

        // Tabelas
        table({ children }) {
          return (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          );
        },
        thead({ children }) {
          return <thead className="bg-muted">{children}</thead>;
        },
        th({ children }) {
          return (
            <th className="border border-border px-3 py-1.5 text-left font-semibold">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border border-border px-3 py-1.5">{children}</td>
          );
        },

        // Linha horizontal
        hr() {
          return <hr className="my-4 border-border" />;
        },

        // Pre (wrapper de código) - deixar o componente code tratar
        pre({ children }) {
          return <>{children}</>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}
