import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, LinkIcon } from "lucide-react";
import ThemeToggle from "./theme-toggle";

interface ProfileSectionProps {
  user: {
    avatar_url: string;
    name: string;
    login: string;
    bio: string;
    location: string;
    followers: number;
    following: number;
    blog: string;
  };
}

export function ProfileSection({ user }: ProfileSectionProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 flex justify-between">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative w-32 h-32 rounded-full overflow-hidden">
            <Image
              src={user.avatar_url || "/placeholder.svg"}
              alt={user.login}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">@{user.login}</p>
            </div>
            {user.bio && <p className="text-lg">{user.bio}</p>}
            <div className="flex flex-wrap gap-4">
              {user.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {user.followers} followers · {user.following} following
                </span>
              </div>
              {user.blog && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <LinkIcon className="h-4 w-4" />
                  <a
                    href={
                      user.blog.startsWith("http")
                        ? user.blog
                        : `https://${user.blog}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    {user.blog}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <ThemeToggle />
        </div>
      </CardContent>
    </Card>
  );
}
