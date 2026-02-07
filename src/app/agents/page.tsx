import { Brain, Library, PencilRuler, Settings } from "lucide-react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AgentsPage() {
  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="mb-2 font-light text-2xl">AI Agents Dashboard</h1>
          <p className="text-muted-foreground">
            Create, manage, and deploy AI agents for decentralized inference
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <Link href="/agents/designer">
            <Card className="h-full cursor-pointer border-border bg-card transition-all hover:border-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PencilRuler className="mr-2 h-5 w-5 text-primary" />
                  Agent Designer
                </CardTitle>
                <CardDescription>
                  Create and customize new AI agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Use the visual designer to create agents with specific
                  capabilities, knowledge bases, and interaction styles. Define
                  what tools the agent can access and how it should respond to
                  user inputs.
                </p>
                <Button className="mt-4 bg-primary text-black hover:bg-primary/90">
                  Create New Agent
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/agents/management">
            <Card className="h-full cursor-pointer border-border bg-card transition-all hover:border-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-primary" />
                  Agent Management
                </CardTitle>
                <CardDescription>
                  Monitor and manage your deployed agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  View analytics, edit configurations, and monitor the
                  performance of your deployed agents. Adjust parameters, update
                  knowledge bases, and optimize for better results.
                </p>
                <Button className="mt-4 bg-primary text-black hover:bg-primary/90">
                  View Agents
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/agents/library">
            <Card className="h-full cursor-pointer border-border bg-card transition-all hover:border-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Library className="mr-2 h-5 w-5 text-primary" />
                  Agent Library
                </CardTitle>
                <CardDescription>
                  Browse pre-built agents and templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Explore a collection of pre-built agents for common tasks and
                  use cases. Import, customize, and deploy these templates to
                  quickly get started with specific AI capabilities.
                </p>
                <Button className="mt-4 bg-primary text-black hover:bg-primary/90">
                  Browse Library
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="h-full border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-primary" />
                Agent Stats
              </CardTitle>
              <CardDescription>
                Performance metrics and usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 text-muted-foreground text-sm">
                    Active Agents
                  </div>
                  <div className="font-light text-2xl text-primary">5</div>
                </div>
                <div>
                  <div className="mb-1 text-muted-foreground text-sm">
                    Total Interactions
                  </div>
                  <div className="font-light text-2xl text-primary">1,287</div>
                </div>
                <div>
                  <div className="mb-1 text-muted-foreground text-sm">
                    Average Response Time
                  </div>
                  <div className="font-light text-2xl text-primary">1.2s</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
