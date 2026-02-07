"use client";

import {
  ArrowLeft,
  BarChart2,
  Edit,
  MessageSquare,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  Search,
} from "lucide-react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const agentsData = [
  {
    id: 1,
    name: "Dria Support Agent",
    description: "A helpful assistant for Dria platform users",
    status: "active",
    interactions: 756,
    successRate: 92,
    averageResponseTime: "1.3s",
    lastUpdated: "2 days ago",
    model: "GEMINI-2.0-FLASH",
  },
  {
    id: 2,
    name: "Node Setup Assistant",
    description: "Specialized agent for node setup and configuration",
    status: "active",
    interactions: 342,
    successRate: 95,
    averageResponseTime: "0.9s",
    lastUpdated: "5 days ago",
    model: "LLAMA3.1:8B-INSTRUCT-Q4_K_M",
  },
  {
    id: 3,
    name: "API Documentation Helper",
    description: "Agent for API documentation and usage examples",
    status: "paused",
    interactions: 189,
    successRate: 87,
    averageResponseTime: "1.8s",
    lastUpdated: "1 week ago",
    model: "LLAMA3.2:1B-INSTRUCT-Q4_K_M",
  },
];

export default function AgentManagementPage() {
  return (
    <MainLayout>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div className="flex items-center">
            <Link href="/agents">
              <Button className="mr-2" size="icon" variant="ghost">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-light text-2xl">Agent Management</h1>
          </div>

          <div className="flex w-full space-x-2 md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
              <Input
                className="bg-background pl-8"
                placeholder="Search agents..."
              />
            </div>
            <Link href="/agents/designer">
              <Button className="bg-primary text-black hover:bg-primary/90">
                New Agent
              </Button>
            </Link>
          </div>
        </div>

        <Tabs className="w-full" defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Agents</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-4" value="all">
            {agentsData.map((agent) => (
              <AgentCard agent={agent} key={agent.id} />
            ))}
          </TabsContent>

          <TabsContent className="space-y-4" value="active">
            {agentsData
              .filter((agent) => agent.status === "active")
              .map((agent) => (
                <AgentCard agent={agent} key={agent.id} />
              ))}
          </TabsContent>

          <TabsContent className="space-y-4" value="paused">
            {agentsData
              .filter((agent) => agent.status === "paused")
              .map((agent) => (
                <AgentCard agent={agent} key={agent.id} />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function AgentCard({ agent }: { agent: any }) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-4 md:flex-row md:p-6">
          <div className="flex-1">
            <div className="mb-2 flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-medium text-black">
                {agent.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{agent.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {agent.description}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4">
              <div>
                <div className="mb-1 text-muted-foreground text-xs">Status</div>
                <div className="flex items-center">
                  {agent.status === "active" ? (
                    <>
                      <div className="mr-1.5 h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm">Active</span>
                    </>
                  ) : (
                    <>
                      <div className="mr-1.5 h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-sm">Paused</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-1 text-muted-foreground text-xs">Model</div>
                <div className="text-sm">{agent.model}</div>
              </div>

              <div>
                <div className="mb-1 text-muted-foreground text-xs">
                  Interactions
                </div>
                <div className="text-sm">
                  {agent.interactions.toLocaleString()}
                </div>
              </div>

              <div>
                <div className="mb-1 text-muted-foreground text-xs">
                  Success Rate
                </div>
                <div className="text-sm">{agent.successRate}%</div>
              </div>

              <div>
                <div className="mb-1 text-muted-foreground text-xs">
                  Response Time
                </div>
                <div className="text-sm">{agent.averageResponseTime}</div>
              </div>

              <div>
                <div className="mb-1 text-muted-foreground text-xs">
                  Last Updated
                </div>
                <div className="text-sm">{agent.lastUpdated}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:flex-col md:items-stretch md:self-center">
            <Button size="icon" variant="outline">
              <BarChart2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              {agent.status === "active" ? (
                <PauseCircle className="h-4 w-4" />
              ) : (
                <PlayCircle className="h-4 w-4" />
              )}
            </Button>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
