"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { AlertTriangle, Lightbulb, ShieldAlert, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const calloutMap = {
  tip: {
    label: "Tip",
    icon: Lightbulb,
    className: "border-emerald-200 bg-emerald-50 text-emerald-950",
  },
  warning: {
    label: "Warning",
    icon: TriangleAlert,
    className: "border-amber-200 bg-amber-50 text-amber-950",
  },
  mistake: {
    label: "Common mistake",
    icon: AlertTriangle,
    className: "border-rose-200 bg-rose-50 text-rose-950",
  },
  safety: {
    label: "Safety",
    icon: ShieldAlert,
    className: "border-sky-200 bg-sky-50 text-sky-950",
  },
};

type CalloutType = keyof typeof calloutMap;

function parseCallout(text: string) {
  const match = text.match(/^\[!(tip|warning|mistake|safety)\]\s*/i);
  if (!match) return null;
  return match[1].toLowerCase() as CalloutType;
}

function renderCallout(text: string, children: React.ReactNode) {
  const calloutType = parseCallout(text);
  if (!calloutType) return null;
  const config = calloutMap[calloutType];
  const Icon = config.icon;
  const cleaned = typeof text === "string" ? text.replace(/^\[!(tip|warning|mistake|safety)\]\s*/i, "") : "";
  return (
    <div
      className={cn(
        "rounded-xl border-l-4 border-l-primary bg-muted/40 px-4 py-3 text-sm",
        config.className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-background">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide">{config.label}</p>
      </div>
      <div className="prose prose-sm mt-2 max-w-none text-inherit leading-relaxed">
        {cleaned ? <p>{cleaned}</p> : children}
      </div>
    </div>
  );
}

export function MarkdownRenderer({
  content,
  className,
}: {
  content?: string | null;
  className?: string;
}) {
  const normalized = (content ?? "").replace(/\\n/g, "\n");
  return (
    <div className={cn("prose prose-slate max-w-none break-words prose-pre:overflow-x-auto", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          p({ children }) {
            const rawText = React.Children.toArray(children)
              .map((child) => (typeof child === "string" ? child : ""))
              .join("");
            const callout = renderCallout(rawText, children);
            if (callout) return callout;
            return <p>{children}</p>;
          },
          blockquote({ children, ...props }) {
            const rawText = React.Children.toArray(children)
              .map((child) => (typeof child === "string" ? child : ""))
              .join("");
            const callout = renderCallout(rawText, children);
            if (!callout) {
              return (
                <blockquote
                  {...props}
                  className="rounded-lg border-l-4 border-primary/40 bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
                >
                  {children}
                </blockquote>
              );
            }
            return callout;
          },
          h2({ children }) {
            return <h2 className="scroll-mt-24">{children}</h2>;
          },
        }}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  );
}
