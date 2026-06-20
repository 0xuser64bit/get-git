import { cn } from "@/lib/utils";

/**
 * Ambient backdrop for the product: a faded dotted grid with a single violet
 * glow. Pure CSS, fixed behind content — intentionally quiet so the signature
 * elements (the search prompt, the merge ledger) carry the page.
 */
export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background",
        className,
      )}
    >
      <div className="absolute inset-0 bg-dot-grid mask-radial-faded opacity-70" />
      {/* merge-violet glow, top center */}
      <div className="absolute left-1/2 top-[-18rem] h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px] dark:bg-primary/15" />
      {/* gentle floor fade */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
