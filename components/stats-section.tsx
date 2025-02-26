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
    return null;
  }

  const COLORS = ["#10B981", "#6366F1", "#EF4444"];

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Pull Requests
          </CardTitle>
          <GitPullRequest className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPRs}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Merged Pull Requests
          </CardTitle>
          <GitMerge className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.mergedPRs}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.mergedPRs / stats.totalPRs) * 100).toFixed(1)}% success
            rate
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reviews Given</CardTitle>
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalReviews}</div>
        </CardContent>
      </Card>
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Pull Requests Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.prsByMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#24bf4e"
                fill="#24bf4e"
                fillOpacity={0.2}
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-center">PR Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.prStatus}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={110}
                dataKey="value"
              >
                {stats.prStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
