import { notFound } from "next/navigation";
import { ProfileSection } from "@/components/profile-section";
import { PullRequestsSection } from "@/components/pull-requests-section";
import { StatsSection } from "@/components/stats-section";
import { Octokit } from "octokit";
import { Metadata, ResolvingMetadata } from "next";

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
  } catch (error) {
    return null;
  }
}

// Generate dynamic metadata for this page
export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // Fetch the GitHub user data
  const user = await getGitHubUser((await params).username);

  // If the user doesn't exist, return default metadata
  if (!user) {
    return {
      title: "User not found | Get Git",
      description: "This GitHub user could not be found.",
    };
  }

  // Create a descriptive string about the user
  const userDescription = user.bio
    ? `${user.name || user.login} - ${user.bio}`
    : `GitHub profile for ${user.name || user.login}. Followers: ${user.followers}, Following: ${user.following}`;

  // Return the metadata including Open Graph and Twitter card data
  return {
    title: `${user.name || user.login} | Get Git`,
    description: userDescription,
    openGraph: {
      title: `${user.name || user.login} | Get Git`,
      description: userDescription,
      images: [
        {
          url: user.avatar_url,
          width: 400,
          height: 400,
          alt: `Profile picture of ${user.name || user.login}`,
        },
      ],
      type: "website",
      siteName: "Get Git",
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.name || user.login} | Get Git`,
      description: userDescription,
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
    followers: user.followers,
    following: user.following,
    blog: user.blog || "",
  };

  return (
    <main className="min-h-screen bg-background bg-gradient-to-b from-background to-background/60 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8 animate-in slide-in-from-bottom duration-1000 fade-in-25">
          <ProfileSection user={processedUser} />
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-30" />
            <div className="relative bg-background rounded-lg p-4">
              <StatsSection username={username} />
            </div>
          </div>
          <div className="relative mt-4">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-lg blur opacity-30" />
            <div className="relative bg-background rounded-lg p-4">
              <PullRequestsSection username={username} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
