import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, LinkIcon, Github, Twitter } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { cn } from "@/lib/utils";

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
    <Card className="overflow-hidden border-none shadow-lg relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row justify-between relative">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative w-32 h-32 md:w-40 md:h-40 animate-in zoom-in-50 duration-700">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="relative">
              <Image
                src={user.avatar_url || "/placeholder.svg"}
                alt={user.login}
                width={200}
                height={200}
                className="w-full h-auto object-cover rounded-full border-2 border-background shadow-md group-hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>
          <div className="space-y-4 animate-in fade-in slide-in-from-left-5 duration-700 delay-150">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">{user.name}</h1>
              <p className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <a href={`https://github.com/${user.login}`} target="_blank" className="flex items-center gap-1">
                  <Github className="h-4 w-4" />
                  @{user.login}
                </a>
              </p>
            </div>
            {user.bio && <p className="text-lg opacity-90">{user.bio}</p>}
            <div className="flex flex-wrap gap-4 animate-in fade-in duration-1000 delay-300">
              {user.location && (
                <div className="flex items-center gap-2 text-muted-foreground group/item hover:text-primary transition-colors duration-300">
                  <MapPin className="h-4 w-4 group-hover/item:animate-bounce" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground group/item hover:text-primary transition-colors duration-300">
                <Users className="h-4 w-4 group-hover/item:animate-pulse" />
                <span>
                  <span className="font-semibold">{user.followers}</span> followers · <span className="font-semibold">{user.following}</span> following
                </span>
              </div>
              {user.blog && (
                <div className="flex items-center gap-2 text-muted-foreground group/item hover:text-primary transition-colors duration-300">
                  <LinkIcon className="h-4 w-4 group-hover/item:animate-spin-slow" />
                  <a
                    href={
                      user.blog.startsWith("http")
                        ? user.blog
                        : `https://${user.blog}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {user.blog}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0 animate-in fade-in slide-in-from-right-5 duration-700">
          <ThemeToggle />
        </div>
      </CardContent>
    </Card>
  );
}
