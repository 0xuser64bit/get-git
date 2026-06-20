"use client";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { GitMerge, GitPullRequest, MessagesSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Stats {
  totalPRs: number;
  mergedPRs: number;
  openPRs: number;
  closedPRs: number;
  totalReviews: number;
  mergeRate: number;
  prsByMonth: Array<{ month: string; count: number }>;
  prStatus: Array<{ name: string; value: number }>;
}

const DEFAULT_COLORS = {
  open: "#3FB950",
  merged: "#A371F7",
  closed: "#F85149",
  primary: "#8B5CF6",
  grid: "#1E1E24",
  axis: "#8B8B96",
};

export function StatsSection({ username }: { username: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState(DEFAULT_COLORS);

  useEffect(() => {
    let active = true;
    async function fetchStats() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/stats/${username}`);
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        if (active) setStats(data);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchStats();
    return () => {
      active = false;
    };
  }, [username]);

  // Resolve chart colors from the active theme's CSS variables.
  useEffect(() => {
    const s = getComputedStyle(document.documentElement);
    const read = (name: string, fallback: string) => {
      const v = s.getPropertyValue(name).trim();
      return v ? `hsl(${v})` : fallback;
    };
    setColors({
      open: read("--open", DEFAULT_COLORS.open),
      merged: read("--merged", DEFAULT_COLORS.merged),
      closed: read("--closed", DEFAULT_COLORS.closed),
      primary: read("--primary", DEFAULT_COLORS.primary),
      grid: read("--border", DEFAULT_COLORS.grid),
      axis: read("--muted-foreground", DEFAULT_COLORS.axis),
    });
  }, [resolvedTheme]);

  if (loading) return <StatsSkeleton />;

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
        Couldn&apos;t load contribution stats right now. The GitHub API may be
        rate-limited — try again in a moment.
      </div>
    );
  }

  const tiles = [
    {
      label: "Merged",
      value: stats.mergedPRs,
      sub: `${stats.mergeRate.toFixed(0)}% merge rate`,
      icon: GitMerge,
      accent: "text-merged",
      hero: true,
    },
    {
      label: "Authored",
      value: stats.totalPRs,
      sub: "pull requests opened",
      icon: GitPullRequest,
      accent: "text-foreground",
    },
    {
      label: "Reviews",
      value: stats.totalReviews,
      sub: "given to other people",
      icon: MessagesSquare,
      accent: "text-foreground",
    },
    {
      label: "Open",
      value: stats.openPRs,
      sub: "in flight right now",
      icon: GitPullRequest,
      accent: "text-open",
    },
  ];

  const statusColor: Record<string, string> = {
    Open: colors.open,
    Merged: colors.merged,
    Closed: colors.closed,
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t, i) => {
          const Icon = t.icon;
          return (
            <div
              key={t.label}
              style={{ animationDelay: `${i * 70}ms` }}
              className={`rounded-xl border bg-card/70 p-5 backdrop-blur animate-in fade-in slide-in-from-bottom-2 duration-500 ${
                t.hero ? "border-merged/30" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {t.label}
                </span>
                <Icon className={`h-4 w-4 ${t.accent}`} />
              </div>
              <div
                className={`mt-3 font-mono text-3xl font-semibold tracking-tight ${t.accent}`}
              >
                <AnimatedNumber value={t.value} compact />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{t.sub}</p>
              {t.hero && (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-merged transition-all duration-1000"
                    style={{ width: `${Math.min(100, stats.mergeRate)}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card/70 p-5 backdrop-blur lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Output over time</h3>
            <span className="font-mono text-xs text-muted-foreground">
              last {stats.prsByMonth.length} active months
            </span>
          </div>
          <div className="mt-4 h-[260px]">
            {stats.prsByMonth.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.prsByMonth}
                  margin={{ top: 6, right: 6, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="prArea" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={colors.primary}
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor={colors.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={colors.grid}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={colors.axis}
                    tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke={colors.axis}
                    tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    width={36}
                  />
                  <Tooltip
                    cursor={{ stroke: colors.grid }}
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 10,
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      color: "hsl(var(--foreground))",
                    }}
                    labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="PRs"
                    stroke={colors.primary}
                    strokeWidth={2}
                    fill="url(#prArea)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                    animationDuration={1100}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/70 p-5 backdrop-blur">
          <h3 className="text-sm font-medium">Status mix</h3>
          <div className="mt-2 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.prStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                  animationDuration={900}
                >
                  {stats.prStatus.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={statusColor[entry.name] ?? colors.primary}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 10,
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-1.5">
            {stats.prStatus.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between text-xs"
              >
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: statusColor[s.name] }}
                  />
                  {s.name}
                </span>
                <span className="font-mono tabular-nums text-foreground">
                  {s.value.toLocaleString("en")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[132px] animate-pulse rounded-xl border border-border bg-card/50"
          />
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="h-[332px] animate-pulse rounded-xl border border-border bg-card/50 lg:col-span-2" />
        <div className="h-[332px] animate-pulse rounded-xl border border-border bg-card/50" />
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      No recent pull request activity to chart.
    </div>
  );
}
