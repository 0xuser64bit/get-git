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
          <TabsList className="w-full">
            <TabsTrigger value="created" className="w-full">
              Created
            </TabsTrigger>
            <TabsTrigger value="reviewed" className="w-full">
              Reviewed
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap justify-end gap-4">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="md:w-[180px]">
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
              status={status}
              dateRange={dateRange}
            />
          </TabsContent>
          <TabsContent value="reviewed" className="space-y-4">
            <PRList
              type="reviewed"
              username={username}
              status={status}
              dateRange={dateRange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
