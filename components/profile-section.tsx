import Image from "next/image";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Link2,
  MapPin,
} from "lucide-react";
import { formatCompact } from "@/utils/helper";

interface ProfileSectionProps {
  user: {
    avatar_url: string;
    name: string;
    login: string;
    bio: string;
    location: string;
    company: string;
    blog: string;
    followers: number;
    following: number;
    public_repos: number;
    html_url: string;
    twitter_username: string;
    created_at: string;
  };
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const joined = new Date(user.created_at).toLocaleString("en", {
    month: "short",
    year: "numeric",
  });
  const blogHref = user.blog
    ? user.blog.startsWith("http")
      ? user.blog
      : `https://${user.blog}`
    : "";

  const stats = [
    { label: "followers", value: user.followers },
    { label: "following", value: user.following },
    { label: "repos", value: user.public_repos },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/70 shadow-sm backdrop-blur animate-in fade-in slide-in-from-bottom-3 duration-700">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:p-8">
        <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
          <div className="absolute -inset-1 rounded-2xl bg-primary/20 blur-lg" />
          <Image
            src={user.avatar_url || "/placeholder.svg"}
            alt={user.login}
            width={160}
            height={160}
            className="relative h-full w-full rounded-2xl border border-border object-cover"
            priority
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
                {user.name}
              </h1>
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                @{user.login}
              </a>
            </div>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              GitHub
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {user.bio && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/90">
              {user.bio}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
            {user.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {user.location}
              </span>
            )}
            {user.company && (
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {user.company}
              </span>
            )}
            {blogHref && (
              <a
                href={blogHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
              >
                <Link2 className="h-3.5 w-3.5" />
                {user.blog.replace(/^https?:\/\//, "")}
              </a>
            )}
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              joined {joined}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
        {stats.map((s) => (
          <div key={s.label} className="px-6 py-4 text-center sm:text-left">
            <div className="font-mono text-xl font-semibold tracking-tight tabular-nums">
              {formatCompact(s.value)}
            </div>
            <div className="mt-0.5 font-mono text-xs text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
