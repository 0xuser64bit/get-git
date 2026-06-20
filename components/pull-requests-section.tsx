"use client";

import { DateRangePicker } from "@/components/date-range-picker";
import { PRList } from "@/components/pr-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Eye, GitPullRequest } from "lucide-react";

const triggerClass =
  "flex items-center justify-center gap-2 rounded-md py-1.5 font-mono text-sm text-muted-foreground transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm";

export function PullRequestsSection({ username }: { username: string }) {
  const [status, setStatus] = useState("merged");
  const [dateRange, setDateRange] = useState<
    | {
        from: Date | undefined;
        to?: Date | undefined;
      }
    | undefined
  >();

  return (
    <Tabs defaultValue="created" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TabsList className="grid h-auto grid-cols-2 gap-1 rounded-lg border border-border bg-secondary p-1 sm:w-[260px]">
          <TabsTrigger value="created" className={triggerClass}>
            <GitPullRequest className="h-4 w-4" />
            Created
          </TabsTrigger>
          <TabsTrigger value="reviewed" className={triggerClass}>
            <Eye className="h-4 w-4" />
            Reviewed
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-[130px] border-border bg-card/70 font-mono text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover font-mono text-xs">
              <SelectItem value="all">All states</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="merged">Merged</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      <TabsContent value="created" className="mt-0">
        <PRList
          type="created"
          username={username}
          status={status}
          dateRange={dateRange}
        />
      </TabsContent>
      <TabsContent value="reviewed" className="mt-0">
        <PRList
          type="reviewed"
          username={username}
          status={status}
          dateRange={dateRange}
        />
      </TabsContent>
    </Tabs>
  );
}
