"use client";

import { cn } from "@/lib/utils";

interface Parameter {
  name: string;
  type: string;
  default: string;
  description: string;
  impact?: string;
}

interface ParameterTableProps {
  parameters: Parameter[];
  title?: string;
  className?: string;
}

export function ParameterTable({
  parameters,
  title,
  className,
}: ParameterTableProps) {
  return (
    <div className={cn("my-6", className)}>
      {title && (
        <h4 className="font-semibold text-lg mb-3">{title}</h4>
      )}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 font-semibold">Parameter</th>
              <th className="text-left px-4 py-3 font-semibold">Type</th>
              <th className="text-left px-4 py-3 font-semibold">Default</th>
              <th className="text-left px-4 py-3 font-semibold">What it does</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, index) => (
              <tr
                key={param.name}
                className={cn(
                  "border-b border-border last:border-b-0",
                  index % 2 === 0 ? "bg-background" : "bg-muted/20"
                )}
              >
                <td className="px-4 py-3">
                  <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
                    {param.name}
                  </code>
                </td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                  {param.type}
                </td>
                <td className="px-4 py-3">
                  <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">
                    {param.default}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <p className="text-foreground">{param.description}</p>
                  {param.impact && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      {param.impact}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Simple key-value style for fewer parameters
export function ParameterList({
  parameters,
  className,
}: {
  parameters: Array<{
    name: string;
    description: string;
    tip?: string;
  }>;
  className?: string;
}) {
  return (
    <ul className={cn("my-4 space-y-3", className)}>
      {parameters.map((param) => (
        <li key={param.name} className="flex items-start gap-2">
          <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs shrink-0 mt-0.5">
            {param.name}
          </code>
          <div>
            <span className="text-foreground">{param.description}</span>
            {param.tip && (
              <span className="text-muted-foreground italic ml-1">
                ({param.tip})
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
