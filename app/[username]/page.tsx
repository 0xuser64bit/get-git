import { notFound } from "next/navigation";
import { ProfileSection } from "@/components/profile-section";
import { PullRequestsSection } from "@/components/pull-requests-section";
import { StatsSection } from "@/components/stats-section";
import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function getGitHubUser(username: string) {
  try {
    const response = await octokit.request('GET /users/{username}', {
      username: username,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    return response.data;
  } catch (error) {
    return null;
  }
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
    followers: user.followers,
    following: user.following,
    blog: user.blog || "",
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ProfileSection user={processedUser} />
        <StatsSection username={username} />
        <PullRequestsSection username={username} />
      </div>
    </main>
  );
}
