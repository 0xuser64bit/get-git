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
import { GitPullRequest, GitBranchPlus } from "lucide-react";

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
    <Card className="mt-8 border-none shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-background to-background/80 relative">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-primary/5 via-primary/50 to-primary/5"></div>
        <CardTitle className="text-xl font-bold flex items-center bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Pull Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="created" className="space-y-4 animate-in fade-in-50 duration-500">
          <div className="border border-muted/20 rounded-xl p-1 shadow-sm bg-gradient-to-r from-background/90 to-background/70 backdrop-blur-sm">
            <TabsList className="w-full grid grid-cols-2 gap-2 rounded-lg bg-transparent">
              <TabsTrigger 
                value="created" 
                className="flex items-center justify-center gap-2 rounded-lg py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:backdrop-blur-md transition-all duration-300 hover:bg-muted/30"
              >
                <GitPullRequest className="h-4 w-4" />
                <span className="font-medium">Created</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reviewed" 
                className="flex items-center justify-center gap-2 rounded-lg py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:backdrop-blur-md transition-all duration-300 hover:bg-muted/30"
              >
                <GitBranchPlus className="h-4 w-4" />
                <span className="font-medium">Reviewed</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex flex-wrap justify-end gap-4 animate-in fade-in slide-in-from-right-5 duration-700 delay-150">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="md:w-[180px] bg-background/60 backdrop-blur-sm border-primary/10 shadow-sm hover:border-primary/30 transition-colors duration-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="border-primary/10 bg-background/80 backdrop-blur-md">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="merged">Merged</SelectItem>
              </SelectContent>
            </Select>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
          
          <TabsContent value="created" className="space-y-4 mt-2 animate-in fade-in-50 duration-500 relative">
            <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 animate-in fade-in duration-1000 delay-500"></div>
            <PRList
              type="created"
              username={username}
              status={status}
              dateRange={dateRange}
            />
          </TabsContent>
          <TabsContent value="reviewed" className="space-y-4 mt-2 animate-in fade-in-50 duration-500 relative">
            <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 animate-in fade-in duration-1000 delay-500"></div>
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
