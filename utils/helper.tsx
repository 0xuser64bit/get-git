import {
  GitMerge,
  GitPullRequest,
  GitPullRequestClosed,
  GitPullRequestDraft,
  LucideIcon,
} from "lucide-react";
import { PullRequest } from "./types";

export type PrStateKey = "open" | "merged" | "closed" | "draft";

/** Resolve a PR's lifecycle state from the GitHub search payload. */
export function getPrStateKey(pr: PullRequest): PrStateKey {
  if (pr.state === "open") return pr.draft ? "draft" : "open";
  if (pr.pull_request?.merged_at) return "merged";
  return "closed";
}

export const PR_STATE_META: Record<
  PrStateKey,
  { label: string; icon: LucideIcon; text: string; dot: string; border: string }
> = {
  open: {
    label: "Open",
    icon: GitPullRequest,
    text: "text-open",
    dot: "bg-open",
    border: "border-l-open",
  },
  merged: {
    label: "Merged",
    icon: GitMerge,
    text: "text-merged",
    dot: "bg-merged",
    border: "border-l-merged",
  },
  closed: {
    label: "Closed",
    icon: GitPullRequestClosed,
    text: "text-closed",
    dot: "bg-closed",
    border: "border-l-closed",
  },
  draft: {
    label: "Draft",
    icon: GitPullRequestDraft,
    text: "text-draft",
    dot: "bg-draft",
    border: "border-l-draft",
  },
};

/** Backwards-compatible icon helper, now driven by the shared state map. */
export const getStatusIcon = (pr: PullRequest) => {
  const meta = PR_STATE_META[getPrStateKey(pr)];
  const Icon = meta.icon;
  return <Icon className={`h-4 w-4 ${meta.text}`} />;
};

/** "owner/repo" from the API repository_url. */
export function getRepoSlug(pr: PullRequest): string {
  const parts = pr.repository_url.split("/").slice(-2);
  return parts.length === 2 ? parts.join("/") : pr.repository_url;
}

/** Compact duration like "3d", "5h", "12m". */
export function getPrDuration(pr: PullRequest): string {
  const start = new Date(pr.created_at).getTime();
  const endRaw = pr.pull_request?.merged_at ?? pr.closed_at;
  const end = endRaw ? new Date(endRaw).getTime() : Date.now();
  const ms = Math.max(0, end - start);

  const days = Math.floor(ms / 86_400_000);
  if (days >= 1) return `${days}d`;
  const hours = Math.floor(ms / 3_600_000);
  if (hours >= 1) return `${hours}h`;
  const minutes = Math.floor(ms / 60_000);
  if (minutes >= 1) return `${minutes}m`;
  return "<1m";
}

/** Contextual right-aligned stamp for a ledger row. */
export function getDurationLabel(pr: PullRequest): string {
  const key = getPrStateKey(pr);
  const d = getPrDuration(pr);
  if (key === "merged") return `merged in ${d}`;
  if (key === "closed") return `closed in ${d}`;
  return `open · ${d}`;
}

/** Kept for any legacy callers. */
export const getTotalTimeSpentOnPR = (pr: PullRequest) => getPrDuration(pr);

/** 1248 -> "1.2k". */
export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}
