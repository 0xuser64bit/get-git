"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { isGitHubUsername } from "@/lib/github";

const EXAMPLES = ["torvalds", "gaearon", "sindresorhus", "antfu", "shadcn"];

/** Pull a clean handle out of an @mention or a pasted github.com URL. */
function normalizeHandle(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  let handle = value;
  if (/^(?:https?:\/\/)?(?:www\.)?github\.com(?:[/?#]|$)/i.test(value)) {
    try {
      const url = new URL(
        /^https?:\/\//i.test(value) ? value : `https://${value}`,
      );
      const hostname = url.hostname.toLowerCase();
      if (
        (hostname !== "github.com" && hostname !== "www.github.com") ||
        url.username ||
        url.password
      ) {
        return null;
      }
      handle = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } catch {
      return null;
    }
  } else if (/^https?:\/\//i.test(value)) {
    return null;
  }

  handle = handle.replace(/^@/, "");
  return isGitHubUsername(handle) ? handle : null;
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
  const [error, setError] = useState("");
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const go = (raw: string) => {
    const handle = normalizeHandle(raw);
    if (!handle) {
      setError("Enter a valid GitHub username or profile URL.");
      inputRef.current?.focus();
      return;
    }
    setError("");
    setLoading(true);
    router.push(`/${encodeURIComponent(handle)}`);
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
        <label htmlFor={inputId} className="sr-only">
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
            id={inputId}
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
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError("");
            }}
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

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-2 text-center font-mono text-xs text-closed"
        >
          {error}
        </p>
      )}

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
