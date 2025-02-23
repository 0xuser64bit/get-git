import { NextResponse } from "next/server";
import { format } from "date-fns";
import { PullRequest } from "@/utils/types";

export async function GET(
  request: Request,
  { params }: { params: { username: string } },
) {
  const { username } = await params;
  try {
    const [prsRes, reviewsRes] = await Promise.all([
      fetch(
        `${process.env.GITHUB_URL}/search/issues?q=author:${username}+is:pr&per_page=100`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        },
      ),
      fetch(
        `${process.env.GITHUB_URL}/search/issues?q=reviewed-by:${username}+is:pr&per_page=100`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        },
      ),
    ]);

    if (!prsRes.ok || !reviewsRes.ok) {
      throw new Error("Failed to fetch data");
    }

    const [prsData, reviewsData] = await Promise.all([
      prsRes.json(),
      reviewsRes.json(),
    ]);

    const totalPRs = prsData.total_count;
    const mergedPRs = prsData.items.filter(
      (pr: PullRequest) =>
        pr.state === "closed" && pr.pull_request.merged_at !== null,
    ).length;
    const totalReviews = reviewsData.total_count;

    // Calculate PRs by month
    const prsByMonth = prsData.items.reduce((acc: any[], pr: PullRequest) => {
      const month = format(new Date(pr.created_at), "MMM yyyy");
      const existing = acc.find((item) => item.month === month);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ month, count: 1 });
      }
      return acc;
    }, []);

    // Calculate PR status distribution
    const prStatus = [
      {
        name: "Open",
        value: prsData.items.filter((pr: any) => pr.state === "open").length,
      },
      { name: "Merged", value: mergedPRs },
      {
        name: "Closed",
        value: prsData.items.filter(
          (pr: any) =>
            pr.state === "closed" && pr.pull_request.merged_at === null,
        ).length,
      },
    ];

    return NextResponse.json({
      totalPRs,
      mergedPRs,
      totalReviews,
      prsByMonth,
      prStatus,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
