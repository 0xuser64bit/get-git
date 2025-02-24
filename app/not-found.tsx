import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 text-center space-y-8">
        <Ghost className="h-24 w-24 mx-auto text-muted-foreground" />
        <h1 className="text-4xl font-bold">User Not Found</h1>
        <p className="text-xl text-muted-foreground max-w-[500px] mx-auto">
          The GitHub user you're looking for doesn't exist. Try searching for a
          different username.
        </p>
        <Button asChild>
          <Link href="/">Go Back Home</Link>
        </Button>
      </div>
    </main>
  );
}
