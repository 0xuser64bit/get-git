import { NextResponse } from "next/server";
import { format } from "date-fns";
import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  try {
    const [prsResponse, reviewsResponse] = await Promise.all([
      octokit.request("GET /search/issues", {
        q: `author:${username}+is:pr`,
        per_page: 100,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }),
      octokit.request("GET /search/issues", {
        q: `reviewed-by:${username}+is:pr`,
        per_page: 100,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }),
    ]);

    const prsData = prsResponse.data;
    const reviewsData = reviewsResponse.data;

    const totalPRs = prsData.total_count;
    const mergedPRs = prsData.items.filter(
      (pr: any) =>
        pr.state === "closed" &&
        pr.pull_request?.merged_at !== null &&
        pr.pull_request?.merged_at !== undefined,
    ).length;
    const totalReviews = reviewsData.total_count;

    // Calculate PRs by month
    const prsByMonth = prsData.items.reduce(
      (acc: Array<{ month: string; count: number }>, pr: any) => {
        const month = format(new Date(pr.created_at), "MMM yyyy");
        const existing = acc.find((item) => item.month === month);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ month, count: 1 });
        }
        return acc;
      },
      [],
    );

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
            pr.state === "closed" &&
            (!pr.pull_request?.merged_at || pr.pull_request.merged_at === null),
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
