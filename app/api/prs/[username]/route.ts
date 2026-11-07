import { NextResponse } from "next/server";
import { Octokit } from "octokit";
import { isGitHubUsername } from "@/lib/github";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  if (!isGitHubUsername(username)) {
    return NextResponse.json(
      { error: "Invalid GitHub username" },
      { status: 400 },
    );
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  if (type !== "created" && type !== "reviewed") {
    return NextResponse.json(
      { error: "Invalid pull request type" },
      { status: 400 },
    );
  }

  const query =
    type === "created" ? `author:${username}` : `reviewed-by:${username}`;

  try {
    const response = await octokit.request("GET /search/issues", {
      q: `${query} is:pr is:public`,
      sort: "created",
      order: "desc",
      per_page: 100,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    return NextResponse.json(response.data.items);
  } catch {
    return NextResponse.json({ error: "Failed to fetch PRs" }, { status: 500 });
  }
}
