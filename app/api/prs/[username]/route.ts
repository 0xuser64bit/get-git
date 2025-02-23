import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { username: string } },
) {
  const { username } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const query =
    type === "created" ? `author:${username}` : `reviewed-by:${username}`;

  try {
    const res = await fetch(
      `${process.env.GITHUB_URL}/search/issues?q=${query}+is:pr&sort=created&order=desc&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch PRs");
    }

    const data = await res.json();
    return NextResponse.json(data.items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch PRs" }, { status: 500 });
  }
}
