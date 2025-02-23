import { GitMerge, GitPullRequest, XCircle } from "lucide-react";
import { PullRequest } from "./types";

export const getStatusIcon = (pr: PullRequest) => {
  if (pr.state === "open")
    return <GitPullRequest className="h-4 w-4 text-green-500" />;
  if (pr.state === "closed" && pr.pull_request.merged_at)
    return <GitMerge className="h-4 w-4 text-purple-500" />;
  return <XCircle className="h-4 w-4 text-red-500" />;
};

export const getTotalTimeSpentOnPR = (pr: PullRequest) => {
  const createdAt = new Date(pr.created_at);
  const closedAt = new Date(pr.closed_at ?? new Date());
  const timeDiff = closedAt.getTime() - createdAt.getTime();
  const timeDiffInDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  if (timeDiffInDays === 0) {
    if (hours === 0) {
      if (minutes === 0) {
        return `${seconds} seconds`;
      }
      return `${minutes} minutes`;
    }
    return `${hours} hours`;
  }
  return `${timeDiffInDays} days`;
};
