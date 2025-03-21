"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitMerge, GitPullRequest, MessageSquare } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Legend,
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
  totalReviews: number;
  prsByMonth: Array<{ month: string; count: number }>;
  prStatus: Array<{ name: string; value: number }>;
}

export function StatsSection({ username }: { username: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`/api/stats/${username}`);
        if (!res.ok) {
          return notFound();
        }
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
      setLoading(false);
    }

    fetchStats();
  }, [username]);

  if (loading || !stats) {
    return (
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className={`${i > 2 ? 'col-span-full md:col-span-2' : ''} h-32`}>
            <CardContent className="p-6 flex items-center justify-center">
              <div className="w-full h-full bg-muted/30 rounded-md"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const COLORS = ["#10B981", "#6366F1", "#EF4444"];

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in-25 duration-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-background to-background/80">
          <CardTitle className="text-sm font-medium">
            Total Pull Requests
          </CardTitle>
          <GitPullRequest className="h-5 w-5 text-primary/60" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent animate-in slide-in-from-bottom-3 duration-500">{stats.totalPRs}</div>
        </CardContent>
      </Card>
      <Card className="overflow-hidden border border-purple-500/10 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in-25 duration-700 delay-150">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-background to-background/80">
          <CardTitle className="text-sm font-medium">
            Merged Pull Requests
          </CardTitle>
          <GitMerge className="h-5 w-5 text-purple-500 animate-pulse" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-700 bg-clip-text text-transparent animate-in slide-in-from-bottom-3 duration-500 delay-150">{stats.mergedPRs}</div>
          <p className="text-xs text-muted-foreground animate-in fade-in duration-700 delay-300">
            {((stats.mergedPRs / stats.totalPRs) * 100).toFixed(1)}% success
            rate
          </p>
        </CardContent>
      </Card>
      <Card className="overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in-25 duration-700 delay-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-background to-background/80">
          <CardTitle className="text-sm font-medium">Reviews Given</CardTitle>
          <MessageSquare className="h-5 w-5 text-primary/60" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent animate-in slide-in-from-bottom-3 duration-500 delay-300">{stats.totalReviews}</div>
        </CardContent>
      </Card>
      <Card className="col-span-full md:col-span-2 overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in-25 duration-700 delay-450 group">
        <CardHeader className="bg-gradient-to-r from-background to-background/80">
          <CardTitle>Pull Requests Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] p-4 group-hover:scale-[1.01] transition-transform duration-500 origin-center">
          <ResponsiveContainer width="100%" height="100%" className="animate-in fade-in duration-1000 delay-500">
            <AreaChart data={stats.prsByMonth}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#24bf4e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#24bf4e" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#24bf4e"
                strokeWidth={2}
                fill="url(#colorCount)"
                fillOpacity={1}
                animationDuration={1500}
              />
              <Legend wrapperStyle={{ paddingTop: '8px' }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-full lg:col-span-1 overflow-hidden border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in-25 duration-700 delay-600 group">
        <CardHeader className="bg-gradient-to-r from-background to-background/80">
          <CardTitle className="text-center">PR Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] p-4 group-hover:scale-[1.02] transition-transform duration-500 origin-center">
          <ResponsiveContainer width="100%" height="100%" className="animate-in fade-in duration-1000 delay-700">
            <PieChart>
              <Pie
                data={stats.prStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                animationDuration={1500}
                animationBegin={300}
              >
                {stats.prStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity duration-300"
                    strokeWidth={index === 0 ? 2 : 1}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: '16px' }} formatter={(value) => <span className="text-sm font-medium">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
