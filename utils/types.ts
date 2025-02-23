import { DateRange } from "react-day-picker";

export interface PullRequest {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
  };
  labels: string[];
  state: string;
  locked: boolean;
  assignee: null | string;
  assignees: string[];
  milestone: null | string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  author_association: string;
  sub_issues_summary: {
    total: number;
    completed: number;
    percent_completed: number;
  };
  active_lock_reason: string | null;
  draft: boolean;
  pull_request: {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    merged_at: string | null;
  };
  body: string;
  reactions: {
    url: string;
    total_count: number;
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
  };
  timeline_url: string;
  performed_via_github_app: null | string;
  state_reason: string | null;
  score: number;
}

export interface PRListProps {
  type: "created" | "reviewed";
  username: string;
  groupBy?: string;
  status: string;
  dateRange?:
    | {
        from: Date | undefined;
        to?: Date | undefined;
      }
    | undefined;
}

export interface DateRangePickerProps {
  value?: DateRange
  onChange?: (value?: DateRange) => void
}