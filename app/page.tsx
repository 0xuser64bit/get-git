import { SearchBar } from "@/components/search-bar";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { GitMerge, LineChart, MessagesSquare, Star } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: GitMerge,
    accent: "text-merged",
    label: "Shipped",
    body: "Every pull request they've opened — grouped by repo, dated, and filtered down to what actually merged.",
  },
  {
    icon: MessagesSquare,
    accent: "text-open",
    label: "Reviewed",
    body: "The reviews they've left on other people's work — the collaboration that never shows up on a commit graph.",
  },
  {
    icon: LineChart,
    accent: "text-primary",
    label: "Velocity",
    body: "Merge rate and output over time, so a profile reads as momentum instead of a wall of numbers.",
  },
];

export default function Home() {
  return (
    <>
      <GridBackdrop />
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5">
        <header className="flex items-center justify-between py-5">
          <span className="font-mono text-sm font-semibold tracking-tight">
            <span className="text-primary">get</span>
            <span className="text-muted-foreground">-</span>
            <span className="text-foreground">git</span>
          </span>
          <Link
            href="https://github.com/user-64bit/get-git"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Star className="h-3.5 w-3.5" />
            Star on GitHub
          </Link>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 font-mono text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              the pull request lens
            </span>
          </div>

          <h1 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 sm:text-5xl md:text-6xl">
            See what a developer has actually{" "}
            <span className="relative whitespace-nowrap text-primary">
              shipped
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-2 w-full text-primary/40"
              >
                <path
                  d="M2 8 C 50 2, 150 2, 198 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 sm:text-lg">
            Drop in a GitHub username. Get a focused read on the pull requests
            they&apos;ve merged, the reviews they&apos;ve left, and how their
            momentum moves over time.
          </p>

          <div className="mt-9 w-full max-w-lg animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <SearchBar />
          </div>
        </main>

        <section className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, accent, label, body }) => (
            <div key={label} className="bg-card/60 p-6 backdrop-blur">
              <Icon className={`h-5 w-5 ${accent}`} />
              <h2 className="mt-4 font-mono text-sm font-semibold tracking-tight">
                {label}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </section>

        <footer className="flex flex-col items-center justify-between gap-2 py-6 text-center text-xs text-muted-foreground sm:flex-row">
          <p className="font-mono">
            built for people who read pull requests, not résumés
          </p>
          <p>Public data via the GitHub API · not affiliated with GitHub</p>
        </footer>
      </div>
    </>
  );
}
