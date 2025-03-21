"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getStatusIcon, getTotalTimeSpentOnPR } from "@/utils/helper";
import { PRListProps, PullRequest } from "@/utils/types";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PRList({ type, username, status, dateRange }: PRListProps) {
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [filteredPRs, setFilteredPRs] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalFilteredPRs, setTotalFilteredPRs] = useState<PullRequest[]>([]);
  const cardPerPage = 10;

  useEffect(() => {
    async function fetchPRs() {
      setLoading(true);
      try {
        const res = await fetch(`/api/prs/${username}?type=${type}`);
        if (!res.ok) {
          return notFound();
        }
        const data = await res.json();
        setPullRequests(data);
      } catch (error) {
        console.error("Failed to fetch PRs:", error);
      }
      setLoading(false);
    }

    fetchPRs();
  }, [username, type]);

  useEffect(() => {
    if (!pullRequests || pullRequests.length === 0) {
      return;
    }

    const newPullRequests = pullRequests.filter((pr) => {
      if (status !== "all") {
        if (status === "open" && pr.state !== "open") return false;
        if (
          status === "merged" &&
          (pr.state !== "closed" || pr.pull_request.merged_at === null)
        )
          return false;
        if (
          status === "closed" &&
          (pr.state !== "closed" || pr.pull_request.merged_at !== null)
        )
          return false;
      }

      if (dateRange) {
        const prDate = new Date(pr.created_at);
        if (
          (dateRange.from && prDate < dateRange.from) ||
          (dateRange.to && prDate > dateRange.to)
        )
          return false;
      }

      return true;
    });

    setTotalFilteredPRs(newPullRequests);
    setFilteredPRs(
      newPullRequests.slice(page * cardPerPage, (page + 1) * cardPerPage),
    );
  }, [pullRequests, page, dateRange, status]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="border border-muted/20 shadow-sm animate-pulse"
          >
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const hasNextPage = totalFilteredPRs.length > (page + 1) * cardPerPage;
  const hasPrevPage = page > 0;

  const goToNextPage = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };

  const goToPrevPage = () => {
    if (hasPrevPage) {
      setPage(page - 1);
    }
  };

  return (
    <div className="space-y-4">
      {filteredPRs.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground animate-in fade-in-50 duration-500">
          <p className="text-lg">
            No pull requests found matching your filters
          </p>
        </div>
      ) : (
        filteredPRs.map((pr, index) => (
          <Card
            key={pr.id}
            className="border border-muted/10 shadow-sm hover:shadow-md transition-all group overflow-hidden animate-in fade-in-25 slide-in-from-bottom-3 duration-700"
            style={{ animationDelay: `${100 * index}ms` }}
          >
            <CardContent className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="flex items-start gap-4 relative">
                <div
                  className="mt-1 animate-in zoom-in-50 duration-500"
                  style={{ animationDelay: `${150 * index}ms` }}
                >
                  {getStatusIcon(pr)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <a
                      href={pr.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline text-foreground/90 hover:text-primary transition-colors duration-300"
                    >
                      {pr.title}
                    </a>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">
                      {pr.repository_url.split("/").slice(-1)[0] ||
                        "No RepoName"}
                    </span>{" "}
                    · {format(new Date(pr.created_at), "MMM d, yyyy")}
                  </div>
                </div>
                <div
                  className="text-sm font-medium text-foreground/70 animate-in fade-in duration-700"
                  style={{ animationDelay: `${200 * index}ms` }}
                >
                  {getTotalTimeSpentOnPR(pr)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      {totalFilteredPRs.length > 0 && (
        <div className="flex items-center justify-center gap-4 animate-in fade-in duration-1000 delay-300">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={!hasPrevPage}
            className={`flex items-center gap-1 ${!hasPrevPage ? "opacity-50" : "hover:bg-muted cursor-pointer"} z-20`}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>

          <div className="text-sm text-muted-foreground px-4">
            Page {page + 1} of{" "}
            {Math.ceil(totalFilteredPRs.length / cardPerPage) || 1}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={!hasNextPage}
            className={`flex items-center gap-1 ${!hasNextPage ? "opacity-50" : "hover:bg-muted cursor-pointer"} z-20`}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
