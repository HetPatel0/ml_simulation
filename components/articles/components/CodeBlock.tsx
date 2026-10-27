// PrismLight + explicit language registration keeps only the 4 grammars we
// use. Rendering happens on the server: no Prism JS or theme objects ship
// to the article route. Token colors live in globals.css.
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeCopyButton } from "./CodeCopyButton";

SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);

interface CodeBlockProps {
  code: string;
  language?: "python" | "bash" | "javascript" | "typescript" | "text";
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

const languageLabels: Record<string, string> = {
  python: "Python",
  bash: "Bash",
  javascript: "JavaScript",
  typescript: "TypeScript",
  text: "Text",
};

const languageColors: Record<string, string> = {
  python: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  bash: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  javascript: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  typescript: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  text: "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20",
};

export function CodeBlock({
  code,
  language = "python",
  title,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  return (
    <div
      className={cn(
        "ml-code relative my-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          {title && (
            <span className="text-sm font-medium text-foreground">
              {title}
            </span>
          )}
          <span
            className={cn(
              "rounded-md border px-2 py-0.5 font-mono text-xs",
              languageColors[language] || languageColors.text,
            )}
          >
            {languageLabels[language] || language}
          </span>
        </div>

        <CodeCopyButton code={code} />
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          useInlineStyles={false}
          showLineNumbers={showLineNumbers}
          codeTagProps={{
            className: language ? `language-${language}` : undefined,
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
