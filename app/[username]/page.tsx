import { notFound } from "next/navigation";
import Link from "next/link";
import { ProfileSection } from "@/components/profile-section";
import { PullRequestsSection } from "@/components/pull-requests-section";
import { StatsSection } from "@/components/stats-section";
import { SearchBar } from "@/components/search-bar";
import ThemeToggle from "@/components/theme-toggle";
import { GridBackdrop } from "@/components/ui/grid-backdrop";
import { Octokit } from "octokit";
import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function getGitHubUser(username: string) {
  try {
    const response = await octokit.request("GET /users/{username}", {
      username: username,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    return response.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const user = await getGitHubUser((await params).username);

  if (!user) {
    return {
      title: "User not found",
      description: "This GitHub user could not be found.",
    };
  }

  const name = user.name || user.login;
  const description = user.bio
    ? `${name} — ${user.bio}`
    : `${name}'s pull request impact on GitHub: ${user.followers} followers, ${user.public_repos} public repos. Explored with Get Git.`;

  return {
    title: name,
    description,
    openGraph: {
      title: `${name} · Get Git`,
      description,
      images: [
        {
          url: user.avatar_url,
          width: 400,
          height: 400,
          alt: `${name} on GitHub`,
        },
      ],
      type: "profile",
      siteName: "Get Git",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} · Get Git`,
      description,
      images: [user.avatar_url],
      creator: user.twitter_username ? `@${user.twitter_username}` : undefined,
    },
  };
}

export default async function UserProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getGitHubUser(username);

  if (!user) {
    notFound();
  }

  const processedUser = {
    avatar_url: user.avatar_url,
    name: user.name || user.login,
    login: user.login,
    bio: user.bio || "",
    location: user.location || "",
    company: user.company || "",
    blog: user.blog || "",
    followers: user.followers,
    following: user.following,
    public_repos: user.public_repos,
    html_url: user.html_url,
    twitter_username: user.twitter_username || "",
    created_at: user.created_at,
  };

  return (
    <>
      <GridBackdrop />
      <div className="min-h-screen">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 font-mono text-sm font-semibold tracking-tight"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              <span>
                <span className="text-primary">get</span>
                <span className="text-muted-foreground">-</span>
                <span className="text-foreground">git</span>
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <SearchBar
                size="sm"
                showExamples={false}
                autoFocus={false}
                className="hidden w-64 sm:block"
              />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl space-y-12 px-5 py-8 md:py-10">
          <ProfileSection user={processedUser} />

          <section>
            <SectionLabel>Impact</SectionLabel>
            <StatsSection username={username} />
          </section>

          <section>
            <SectionLabel>Pull requests</SectionLabel>
            <PullRequestsSection username={username} />
          </section>
        </main>

        <footer className="border-t border-border/60">
          <div className="mx-auto max-w-5xl px-5 py-6 text-center text-xs text-muted-foreground">
            Public data via the GitHub API · not affiliated with GitHub ·{" "}
            <Link
              href="https://github.com/0xuser64bit/get-git"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:text-foreground hover:underline"
            >
              Get Git
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {children}
      </h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
