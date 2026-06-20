"use client";

import {
  PR_STATE_META,
  getDurationLabel,
  getPrStateKey,
  getRepoSlug,
} from "@/utils/helper";
import { PRListProps, PullRequest } from "@/utils/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, SearchX } from "lucide-react";

const PER_PAGE = 10;

export function PRList({ type, username, status, dateRange }: PRListProps) {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let active = true;
    async function fetchPRs() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/prs/${username}?type=${type}`);
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        if (active) setPullRequests(Array.isArray(data) ? data : []);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchPRs();
    return () => {
      active = false;
    };
  }, [username, type]);

  const filtered = pullRequests.filter((pr) => {
    if (status !== "all") {
      const key = getPrStateKey(pr);
      // Drafts are still open work, so include them under the "open" filter.
      const matches =
        status === "open" ? key === "open" || key === "draft" : key === status;
      if (!matches) return false;
    }
    if (dateRange) {
      const prDate = new Date(pr.created_at);
      if (dateRange.from && prDate < dateRange.from) return false;
      if (dateRange.to && prDate > dateRange.to) return false;
    }
    return true;
  });

  // Keep the page in range whenever the filtered set changes.
  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  useEffect(() => {
    setPage(0);
  }, [status, dateRange, type, pullRequests]);

  const current = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-[58px] animate-pulse rounded-lg border border-border bg-card/50"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
        Couldn&apos;t load pull requests. GitHub may be rate-limited — try again
        shortly.
      </div>
    );
  }

  if (filtered.length === 0) {
    const verb = type === "created" ? "opened" : "reviewed";
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/40 px-6 py-14 text-center">
        <SearchX className="h-7 w-7 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No {status !== "all" ? status : ""} pull requests {verb} here.
          {dateRange ? " Try widening the date range." : " Try another filter."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="font-mono text-xs text-muted-foreground">
        {filtered.length} {status !== "all" ? status : ""} pull request
        {filtered.length === 1 ? "" : "s"}
        {filtered.length > PER_PAGE &&
          ` · showing ${page * PER_PAGE + 1}–${Math.min(
            (page + 1) * PER_PAGE,
            filtered.length,
          )}`}
      </p>

      <ul className="space-y-2">
        {current.map((pr, index) => {
          const meta = PR_STATE_META[getPrStateKey(pr)];
          const Icon = meta.icon;
          return (
            <li
              key={pr.id}
              style={{ animationDelay: `${index * 40}ms` }}
              className="animate-in fade-in slide-in-from-bottom-1 duration-500"
            >
              <a
                href={pr.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex items-center gap-3 rounded-lg border border-l-2 border-border bg-card/60 px-4 py-3 transition-colors hover:bg-accent/40",
                  meta.border,
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", meta.text)} />
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground/90 transition-colors group-hover:text-primary">
                    {pr.title}
                  </span>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 font-mono text-xs text-muted-foreground">
                    <span className="truncate">{getRepoSlug(pr)}</span>
                    <span className="text-muted-foreground/60">
                      #{pr.number}
                    </span>
                    <span className="text-muted-foreground/40">·</span>
                    <span>
                      {format(new Date(pr.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:block">
                  {getDurationLabel(pr)}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </li>
          );
        })}
      </ul>

      {filtered.length > PER_PAGE && (
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card/60 px-3 py-1.5 text-sm transition-colors hover:bg-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <span className="font-mono text-xs text-muted-foreground">
            {page + 1} / {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={page >= pageCount - 1}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card/60 px-3 py-1.5 text-sm transition-colors hover:bg-accent/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
