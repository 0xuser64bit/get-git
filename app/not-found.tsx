import { SearchBar } from "@/components/search-bar";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <GridBackdrop />
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-5 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 font-mono text-xs text-muted-foreground">
          <SearchX className="h-3.5 w-3.5" />
          404 · no such handle
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          That developer isn&apos;t on GitHub
        </h1>
        <p className="mt-4 text-pretty text-muted-foreground">
          We couldn&apos;t find a GitHub user with that username. Check the
          spelling, or try another handle below.
        </p>
        <div className="mt-8 w-full">
          <SearchBar />
        </div>
      </main>
    </>
  );
}
