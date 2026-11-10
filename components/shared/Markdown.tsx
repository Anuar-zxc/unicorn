"use client";

import { forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Renders AI output (markdown with tables) safely: react-markdown does not
 * render raw HTML, so model output cannot inject markup.
 */
export const Markdown = forwardRef<HTMLDivElement, { children: string; className?: string }>(
  function Markdown({ children, className }, ref) {
    return (
      <div ref={ref} className={cn("lexo-prose", className)}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children: linkChildren }) => (
              <a href={href} target="_blank" rel="noopener noreferrer nofollow">
                {linkChildren}
              </a>
            ),
            table: ({ children: tableChildren }) => (
              <div className="lexo-table-wrap">
                <table>{tableChildren}</table>
              </div>
            )
          }}
        >
          {children}
        </ReactMarkdown>
      </div>
    );
  }
);
