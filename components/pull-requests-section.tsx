"use client";

import { DateRangePicker } from "@/components/date-range-picker";
import { PRList } from "@/components/pr-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export function PullRequestsSection({ username }: { username: string }) {
  const [groupBy, setGroupBy] = useState("repo");
  const [status, setStatus] = useState("merged");
  const [dateRange, setDateRange] = useState<
    | {
        from: Date | undefined;
        to?: Date | undefined;
      }
    | undefined
  >();

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Pull Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="created" className="space-y-4">
          <TabsList>
            <TabsTrigger value="created">Created</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap gap-4">
            <Select value={groupBy} onValueChange={setGroupBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Group by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="repo">Repository</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="merged">Merged</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
          <TabsContent value="created" className="space-y-4">
            <PRList
              type="created"
              username={username}
              groupBy={groupBy}
              status={status}
              dateRange={dateRange}
            />
          </TabsContent>
          <TabsContent value="reviewed" className="space-y-4">
            <PRList
              type="reviewed"
              username={username}
              groupBy={groupBy}
              status={status}
              dateRange={dateRange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
