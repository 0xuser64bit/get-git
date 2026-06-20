"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

const EXAMPLES = ["torvalds", "gaearon", "sindresorhus", "antfu", "shadcn"];

/** Pull a clean handle out of an @mention or a pasted github.com URL. */
function normalizeHandle(raw: string): string {
  let value = raw.trim();
  const urlMatch = value.match(/github\.com\/([^/?#]+)/i);
  if (urlMatch) value = urlMatch[1];
  return value.replace(/^@/, "").replace(/\/+$/, "").trim();
}

export function SearchBar({
  size = "lg",
  showExamples = true,
  autoFocus = true,
  className,
}: {
  size?: "lg" | "sm";
  showExamples?: boolean;
  autoFocus?: boolean;
  className?: string;
}) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const go = (raw: string) => {
    const handle = normalizeHandle(raw);
    if (!handle) {
      inputRef.current?.focus();
      return;
    }
    setLoading(true);
    router.push(`/${handle}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    go(value);
  };

  // Reset the spinner if the user navigates back to this view.
  useEffect(() => setLoading(false), [router]);

  const lg = size === "lg";

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="gh-username" className="sr-only">
          GitHub username
        </label>
        <div
          className={cn(
            "group flex items-center gap-2 rounded-xl border border-border bg-card/70 shadow-sm backdrop-blur transition-colors",
            "focus-within:border-primary/60 focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]",
            lg ? "h-14 pl-4 pr-2" : "h-11 pl-3 pr-1.5",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "select-none font-mono font-semibold text-primary",
              lg ? "text-lg" : "text-sm",
            )}
          >
            ❯
          </span>
          <input
            id="gh-username"
            ref={inputRef}
            type="text"
            inputMode="text"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="off"
            autoFocus={autoFocus}
            placeholder="github username"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={loading}
            className={cn(
              "min-w-0 flex-1 bg-transparent font-mono text-foreground placeholder:text-muted-foreground/70 focus:outline-none disabled:opacity-60",
              lg ? "text-base" : "text-sm",
            )}
          />
          <button
            type="submit"
            disabled={loading || !value.trim()}
            aria-label="View profile"
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40",
              lg ? "h-10 px-4 text-sm" : "h-8 px-3 text-xs",
            )}
          >
            {loading ? (
              <LoaderCircle
                className={cn("animate-spin", lg ? "h-4 w-4" : "h-3.5 w-3.5")}
              />
            ) : (
              <>
                <span className={lg ? "" : "hidden sm:inline"}>View</span>
                <ArrowRight className={lg ? "h-4 w-4" : "h-3.5 w-3.5"} />
              </>
            )}
          </button>
        </div>
      </form>

      {showExamples && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">try</span>
          {EXAMPLES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => go(name)}
              disabled={loading}
              className="rounded-full border border-border bg-card/50 px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
