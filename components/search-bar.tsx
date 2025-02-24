"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Circle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchBar() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setLoading(true);
      router.push(`/${username.trim()}`);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [router]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        type="text"
        placeholder="Enter GitHub username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="pl-10 rounded-full text-black dark:text-white"
        autoFocus
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
        size="sm"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
        disabled={!username.trim()}
      >
        {loading ? <Circle className="h-4 w-4 animate-spin" /> : "Search"}
      </Button>
    </form>
  );
}
