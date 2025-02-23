import { notFound } from "next/navigation";
import { ProfileSection } from "@/components/profile-section";
import { PullRequestsSection } from "@/components/pull-requests-section";
import { StatsSection } from "@/components/stats-section";

async function getGitHubUser(username: string) {
  try {
    const res = await fetch(`${process.env.GITHUB_URL}/users/${username}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    });
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    return json;
  } catch (error) {
    return null;
  }
}

export default async function UserProfile({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  const user = await getGitHubUser(username);

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ProfileSection user={user} />
        <StatsSection username={username} />
        <PullRequestsSection username={username} />
      </div>
    </main>
  );
}
