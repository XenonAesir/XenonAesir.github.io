"use client";

import { useState, type ComponentProps, type MouseEvent } from "react";

export function CodePre(props: ComponentProps<"pre">) {
  const [copied, setCopied] = useState(false);

  async function copy(event: MouseEvent<HTMLButtonElement>) {
    const text =
      event.currentTarget.closest("[data-rehype-pretty-code-figure]")?.querySelector("pre")
        ?.textContent ?? "";
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="group relative">
      <pre {...props} />
      <button
        type="button"
        onClick={copy}
        className="absolute top-2 right-2 rounded-none border border-border bg-card/80 px-2 py-1 text-[0.68rem] tracking-[0.1em] text-muted-foreground uppercase opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        {copied ? "已复制" : "复制"}
      </button>
    </div>
  );
}
