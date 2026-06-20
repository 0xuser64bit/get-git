import { NextResponse } from "next/server";
import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const search = (q: string, perPage = 1) =>
  octokit.request("GET /search/issues", {
    q,
    per_page: perPage,
    sort: "created",
    order: "desc",
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
  });

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  try {
    // Counts come from total_count (accurate across all results), not the
    // first page — this is the fix for the previously misleading merge rate.
    const [authored, merged, open, reviews] = await Promise.all([
      search(`author:${username} is:pr`, 100),
      search(`author:${username} is:pr is:merged`),
      search(`author:${username} is:pr is:open`),
      search(`reviewed-by:${username} is:pr`),
    ]);

    const totalPRs = authored.data.total_count;
    const mergedPRs = merged.data.total_count;
    const openPRs = open.data.total_count;
    const closedPRs = Math.max(0, totalPRs - mergedPRs - openPRs);
    const totalReviews = reviews.data.total_count;
    const mergeRate = totalPRs > 0 ? (mergedPRs / totalPRs) * 100 : 0;

    // Timeline from the 100 most recent authored PRs, ordered oldest→newest
    // and trimmed to the last 12 active months for a readable chart.
    const byMonth = new Map<string, { label: string; count: number }>();
    for (const pr of authored.data.items) {
      const d = new Date(pr.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("en", { month: "short", year: "2-digit" });
      const entry = byMonth.get(key);
      if (entry) entry.count += 1;
      else byMonth.set(key, { label, count: 1 });
    }
    const prsByMonth = [...byMonth.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([, v]) => ({ month: v.label, count: v.count }));

    const prStatus = [
      { name: "Open", value: openPRs },
      { name: "Merged", value: mergedPRs },
      { name: "Closed", value: closedPRs },
    ];

    return NextResponse.json({
      totalPRs,
      mergedPRs,
      openPRs,
      closedPRs,
      totalReviews,
      mergeRate,
      prsByMonth,
      prStatus,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
