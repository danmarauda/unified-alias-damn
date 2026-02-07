"use client";

import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Database,
  ExternalLink,
  Globe,
  PanelLeft,
  Plus,
  RefreshCw,
  RocketIcon,
  Server,
  Terminal,
  Workflow,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AIAssistPanel } from "@/components/dashboard/AIAssistPanel";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types for deployment
interface Deployment {
  id: string;
  projectId: string;
  projectName: string;
  environment: "development" | "staging" | "production";
  status: "queued" | "in-progress" | "success" | "failed";
  startedAt: Date;
  finishedAt?: Date;
  deployedBy: string;
  version: string;
  commitHash: string;
  url?: string;
  logs?: string[];
}

interface Project {
  id: string;
  name: string;
  environments: {
    development: boolean;
    staging: boolean;
    production: boolean;
  };
  branches: string[];
  lastDeployment?: {
    environment: "development" | "staging" | "production";
    status: "success" | "failed";
    timestamp: Date;
  };
}

// Mock data for projects
const mockProjects: Project[] = [
  {
    id: "project-1",
    name: "Enterprise CRM Portal",
    environments: {
      development: true,
      staging: true,
      production: true,
    },
    branches: [
      "main",
      "develop",
      "feature/auth-integration",
      "bugfix/dashboard-layout",
    ],
    lastDeployment: {
      environment: "staging",
      status: "success",
      timestamp: new Date(Date.now() - 3_600_000),
    },
  },
  {
    id: "project-2",
    name: "Healthcare Analytics Platform",
    environments: {
      development: true,
      staging: true,
      production: false,
    },
    branches: ["main", "develop", "feature/patient-dashboard"],
    lastDeployment: {
      environment: "development",
      status: "success",
      timestamp: new Date(Date.now() - 7_200_000),
    },
  },
  {
    id: "project-3",
    name: "Financial Services Dashboard",
    environments: {
      development: true,
      staging: false,
      production: false,
    },
    branches: ["main", "develop"],
    lastDeployment: {
      environment: "development",
      status: "failed",
      timestamp: new Date(Date.now() - 86_400_000),
    },
  },
];

// Mock data for recent deployments
const mockDeployments: Deployment[] = [
  {
    id: "dep-1",
    projectId: "project-1",
    projectName: "Enterprise CRM Portal",
    environment: "staging",
    status: "success",
    startedAt: new Date(Date.now() - 3_600_000),
    finishedAt: new Date(Date.now() - 3_550_000),
    deployedBy: "Sarah Chen",
    version: "v2.3.0",
    commitHash: "a8e5d1c",
    url: "https://staging.crm-portal.alias-mosaic.com",
    logs: [
      "1:20:30 PM - Starting deployment...",
      "1:20:35 PM - Initializing build environment",
      "1:20:40 PM - Installing dependencies",
      "1:21:15 PM - Running build script",
      "1:21:40 PM - Running database migrations",
      "1:21:50 PM - Deploying frontend assets",
      "1:21:55 PM - Deployment complete",
      "1:21:56 PM - Application is live at https://staging.crm-portal.alias-mosaic.com",
    ],
  },
  {
    id: "dep-2",
    projectId: "project-2",
    projectName: "Healthcare Analytics Platform",
    environment: "development",
    status: "success",
    startedAt: new Date(Date.now() - 7_200_000),
    finishedAt: new Date(Date.now() - 7_150_000),
    deployedBy: "Michael Rodriguez",
    version: "v1.4.2",
    commitHash: "b2d7e3f",
    url: "https://dev.health-analytics.alias-mosaic.com",
    logs: [
      "11:45:30 AM - Starting deployment...",
      "11:45:35 AM - Initializing build environment",
      "11:45:40 AM - Installing dependencies",
      "11:46:15 AM - Running build script",
      "11:46:40 AM - Running database migrations",
      "11:46:50 AM - Deploying frontend assets",
      "11:46:55 AM - Deployment complete",
      "11:46:56 AM - Application is live at https://dev.health-analytics.alias-mosaic.com",
    ],
  },
  {
    id: "dep-3",
    projectId: "project-3",
    projectName: "Financial Services Dashboard",
    environment: "development",
    status: "failed",
    startedAt: new Date(Date.now() - 86_400_000),
    finishedAt: new Date(Date.now() - 86_380_000),
    deployedBy: "Alex Mercer",
    version: "v0.9.0",
    commitHash: "c3f8a2d",
    logs: [
      "8:30:00 AM - Starting deployment...",
      "8:30:05 AM - Initializing build environment",
      "8:30:10 AM - Installing dependencies",
      "8:30:45 AM - Running build script",
      "8:30:50 AM - ERROR: Build failed - TypeScript errors",
      "8:30:51 AM - ERROR: /src/components/dashboard/ChartPanel.tsx:125:10 - Property 'data' is missing in type '{ labels: string[]; }' but required in type 'ChartProps'",
      "8:30:52 AM - Deployment aborted due to build failures",
    ],
  },
  {
    id: "dep-4",
    projectId: "project-1",
    projectName: "Enterprise CRM Portal",
    environment: "development",
    status: "in-progress",
    startedAt: new Date(Date.now() - 300_000),
    deployedBy: "Lisa Johnson",
    version: "v2.3.1",
    commitHash: "d4e9b2a",
    logs: [
      "3:20:00 PM - Starting deployment...",
      "3:20:05 PM - Initializing build environment",
      "3:20:10 PM - Installing dependencies",
      "3:20:45 PM - Running build script",
      "3:21:15 PM - Running database migrations...",
    ],
  },
  {
    id: "dep-5",
    projectId: "project-1",
    projectName: "Enterprise CRM Portal",
    environment: "production",
    status: "queued",
    startedAt: new Date(Date.now() - 60_000),
    deployedBy: "Sarah Chen",
    version: "v2.2.0",
    commitHash: "e5f1c2b",
    logs: [
      "3:29:00 PM - Deployment added to queue",
      "3:29:01 PM - Waiting for available deployment slot...",
    ],
  },
];

// Helper function to format dates
function formatDate(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Helper function to get status badge
function getStatusBadge(status: string) {
  switch (status) {
    case "success":
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 font-medium text-green-800 text-xs dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="mr-1 h-3 w-3" />
          Success
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 font-medium text-red-800 text-xs dark:bg-red-900/30 dark:text-red-400">
          <XCircle className="mr-1 h-3 w-3" />
          Failed
        </span>
      );
    case "in-progress":
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-800 text-xs dark:bg-blue-900/30 dark:text-blue-400">
          <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
          In Progress
        </span>
      );
    case "queued":
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 font-medium text-xs text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          <Clock className="mr-1 h-3 w-3" />
          Queued
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-800 text-xs dark:bg-gray-800 dark:text-gray-400">
          {status}
        </span>
      );
  }
}

// Helper function to get environment badge
function getEnvironmentBadge(environment: string) {
  switch (environment) {
    case "development":
      return (
        <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 font-medium text-purple-800 text-xs dark:bg-purple-900/30 dark:text-purple-400">
          <Server className="mr-1 h-3 w-3" />
          Development
        </span>
      );
    case "staging":
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-800 text-xs dark:bg-blue-900/30 dark:text-blue-400">
          <Database className="mr-1 h-3 w-3" />
          Staging
        </span>
      );
    case "production":
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 font-medium text-green-800 text-xs dark:bg-green-900/30 dark:text-green-400">
          <Globe className="mr-1 h-3 w-3" />
          Production
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-800 text-xs dark:bg-gray-800 dark:text-gray-400">
          {environment}
        </span>
      );
  }
}

export default function DeployPage() {
  const [showAssistant, setShowAssistant] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] =
    useState<string>("development");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [deploying, setDeploying] = useState(false);
  const [selectedDeployment, setSelectedDeployment] =
    useState<Deployment | null>(null);
  const [expandedLogDeployment, setExpandedLogDeployment] = useState<
    string | null
  >(null);

  // Set default project on first load
  useEffect(() => {
    if (mockProjects.length > 0 && !selectedProject) {
      setSelectedProject(mockProjects[0]);
      setSelectedBranch(mockProjects[0].branches[0]);
    }
  }, []);

  // Handle project change
  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = event.target.value;
    const project = mockProjects.find((p) => p.id === projectId) || null;
    setSelectedProject(project);
    if (project && project.branches.length > 0) {
      setSelectedBranch(project.branches[0]);
    }
  };

  // Handle deployment
  const handleDeploy = () => {
    if (!selectedProject) return;

    setDeploying(true);

    // Simulate deployment process
    setTimeout(() => {
      setDeploying(false);
      // Show success message or redirect to deployment details
      alert(
        `Deployed ${selectedProject.name} to ${selectedEnvironment} environment successfully!`
      );
    }, 3000);
  };

  // Filter deployments by selected project
  const filteredDeployments = selectedProject
    ? mockDeployments.filter((d) => d.projectId === selectedProject.id)
    : mockDeployments;

  // Toggle deployment logs
  const toggleDeploymentLogs = (deploymentId: string) => {
    if (expandedLogDeployment === deploymentId) {
      setExpandedLogDeployment(null);
    } else {
      setExpandedLogDeployment(deploymentId);
    }
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 lg:flex-row">
          <div>
            <h1 className="flex items-center font-normal text-2xl">
              <RocketIcon className="mr-2 h-6 w-6 text-primary" />
              Project Deployment
            </h1>
            <p className="max-w-3xl text-muted-foreground">
              Deploy your MOSAIC projects to various environments. Configure
              build settings, monitor deployments, and manage your
              infrastructure.
            </p>
          </div>

          <Button
            onClick={() => setShowAssistant(!showAssistant)}
            size="sm"
            variant="outline"
          >
            <PanelLeft className="mr-1 h-4 w-4" />
            {showAssistant ? "Hide Assistant" : "Show Assistant"}
          </Button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className={`flex-1 ${showAssistant ? "lg:w-2/3" : "w-full"}`}>
            <Tabs className="space-y-6" defaultValue="deploy">
              <TabsList>
                <TabsTrigger value="deploy">Deploy</TabsTrigger>
                <TabsTrigger value="history">Deployment History</TabsTrigger>
                <TabsTrigger value="settings">Environment Settings</TabsTrigger>
              </TabsList>

              <TabsContent className="space-y-6" value="deploy">
                <Card>
                  <CardHeader>
                    <CardTitle>Deploy Project</CardTitle>
                    <CardDescription>
                      Select a project and environment to deploy your
                      application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="font-medium text-sm">Project</label>
                        <select
                          className="w-full rounded border border-border bg-background p-2"
                          onChange={handleProjectChange}
                          value={selectedProject?.id || ""}
                        >
                          {mockProjects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="font-medium text-sm">
                          Environment
                        </label>
                        <select
                          className="w-full rounded border border-border bg-background p-2"
                          onChange={(e) =>
                            setSelectedEnvironment(e.target.value)
                          }
                          value={selectedEnvironment}
                        >
                          <option value="development">Development</option>
                          <option value="staging">Staging</option>
                          <option value="production">Production</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="font-medium text-sm">Branch</label>
                        <select
                          className="w-full rounded border border-border bg-background p-2"
                          onChange={(e) => setSelectedBranch(e.target.value)}
                          value={selectedBranch}
                        >
                          {selectedProject?.branches.map((branch) => (
                            <option key={branch} value={branch}>
                              {branch}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="font-medium text-sm">
                          Build Command
                        </label>
                        <Input
                          className="bg-background"
                          defaultValue="npm run build"
                          placeholder="npm run build"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-medium text-sm">
                        Environment Variables
                      </label>
                      <div className="rounded-md border border-border bg-background p-4">
                        <div className="mb-2 grid grid-cols-2 gap-2">
                          <div className="font-semibold text-sm">Key</div>
                          <div className="font-semibold text-sm">Value</div>
                        </div>
                        <div className="mb-2 grid grid-cols-2 gap-2">
                          <Input
                            className="text-sm"
                            defaultValue="DATABASE_URL"
                            placeholder="DATABASE_URL"
                          />
                          <Input
                            className="text-sm"
                            defaultValue="postgres://user:password@localhost:5432/db"
                            placeholder="postgres://..."
                          />
                        </div>
                        <div className="mb-2 grid grid-cols-2 gap-2">
                          <Input
                            className="text-sm"
                            defaultValue="API_KEY"
                            placeholder="API_KEY"
                          />
                          <Input
                            className="text-sm"
                            defaultValue="sk_test_***************"
                            placeholder="..."
                          />
                        </div>
                        <div className="mb-4 grid grid-cols-2 gap-2">
                          <Input
                            className="text-sm"
                            defaultValue="NODE_ENV"
                            placeholder="NODE_ENV"
                          />
                          <Input
                            className="text-sm"
                            defaultValue="production"
                            placeholder="..."
                          />
                        </div>
                        <Button size="sm" variant="outline">
                          <Plus className="mr-1 h-4 w-4" />
                          Add Variable
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-medium text-sm">
                        Advanced Options
                      </label>
                      <div className="divide-y rounded-md border border-border dark:divide-border">
                        <div className="flex items-center justify-between p-3">
                          <div>
                            <div className="font-medium">
                              Run Database Migrations
                            </div>
                            <div className="text-muted-foreground text-sm">
                              Automatically run migrations before deployment
                            </div>
                          </div>
                          <input
                            className="h-4 w-4 rounded border-border bg-background"
                            defaultChecked
                            type="checkbox"
                          />
                        </div>
                        <div className="flex items-center justify-between p-3">
                          <div>
                            <div className="font-medium">
                              Cache Dependencies
                            </div>
                            <div className="text-muted-foreground text-sm">
                              Cache node_modules between deployments
                            </div>
                          </div>
                          <input
                            className="h-4 w-4 rounded border-border bg-background"
                            defaultChecked
                            type="checkbox"
                          />
                        </div>
                        <div className="flex items-center justify-between p-3">
                          <div>
                            <div className="font-medium">
                              Zero Downtime Deploy
                            </div>
                            <div className="text-muted-foreground text-sm">
                              Deploy without interrupting users
                            </div>
                          </div>
                          <input
                            className="h-4 w-4 rounded border-border bg-background"
                            defaultChecked
                            type="checkbox"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-border border-t p-4">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <AlertTriangle className="mr-1 h-4 w-4 text-yellow-500" />
                      {selectedEnvironment === "production"
                        ? "Deploying to production will affect live users."
                        : "This will deploy to a testing environment."}
                    </div>
                    <Button
                      className={
                        selectedEnvironment === "production"
                          ? "bg-red-600 hover:bg-red-700"
                          : ""
                      }
                      disabled={deploying || !selectedProject}
                      onClick={handleDeploy}
                    >
                      {deploying ? (
                        <>
                          <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        <>
                          <RocketIcon className="mr-1 h-4 w-4" />
                          Deploy to {selectedEnvironment}
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                {/* Quick deployment history */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-normal text-base">
                      Recent Deployments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredDeployments.slice(0, 3).map((deployment) => (
                        <div
                          className="rounded-md border border-border p-3"
                          key={deployment.id}
                        >
                          <div className="mb-2 flex items-start justify-between">
                            <div>
                              <div className="font-medium">
                                {deployment.projectName}
                              </div>
                              <div className="text-muted-foreground text-sm">
                                {deployment.version} ({deployment.commitHash})
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {getEnvironmentBadge(deployment.environment)}
                              {getStatusBadge(deployment.status)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Deployed by:
                              </span>{" "}
                              {deployment.deployedBy}
                            </div>
                            <div className="text-muted-foreground">
                              {formatDate(deployment.startedAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Deployment History</CardTitle>
                    <CardDescription>
                      View the history of all deployments across your
                      environments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col divide-y rounded-md border border-border dark:divide-border">
                        {mockDeployments.map((deployment) => (
                          <div className="p-4" key={deployment.id}>
                            <div className="mb-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <div>
                                <div className="flex items-center font-medium">
                                  {deployment.projectName}
                                  {deployment.url && (
                                    <a
                                      className="ml-2 text-primary hover:text-primary/80"
                                      href={deployment.url}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  )}
                                </div>
                                <div className="text-muted-foreground text-sm">
                                  {deployment.version} ({deployment.commitHash})
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {getEnvironmentBadge(deployment.environment)}
                                {getStatusBadge(deployment.status)}
                              </div>
                            </div>

                            <div className="mb-2 flex flex-col justify-between text-sm md:flex-row md:items-center">
                              <div>
                                <span className="text-muted-foreground">
                                  Deployed by:
                                </span>{" "}
                                {deployment.deployedBy}
                              </div>
                              <div className="text-muted-foreground">
                                Started: {formatDate(deployment.startedAt)}
                                {deployment.finishedAt &&
                                  ` • Finished: ${formatDate(deployment.finishedAt)}`}
                              </div>
                            </div>

                            {deployment.logs && (
                              <div>
                                <Button
                                  className="h-auto p-0 text-primary"
                                  onClick={() =>
                                    toggleDeploymentLogs(deployment.id)
                                  }
                                  size="sm"
                                  variant="ghost"
                                >
                                  {expandedLogDeployment === deployment.id ? (
                                    <ChevronUp className="mr-1 h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="mr-1 h-4 w-4" />
                                  )}
                                  {expandedLogDeployment === deployment.id
                                    ? "Hide logs"
                                    : "Show logs"}
                                </Button>

                                {expandedLogDeployment === deployment.id && (
                                  <div className="mt-2 max-h-60 overflow-auto rounded-md bg-black/90 p-3 font-mono text-gray-300 text-xs">
                                    {deployment.logs.map((log, index) => (
                                      <div key={index}>{log}</div>
                                    ))}
                                    {deployment.status === "in-progress" && (
                                      <div className="animate-pulse text-primary">
                                        Deployment in progress...
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Environment Settings</CardTitle>
                    <CardDescription>
                      Configure your deployment environments and CI/CD pipelines
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">
                        Environment Configuration
                      </h3>

                      <div className="rounded-md border border-border">
                        <div className="border-border border-b p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">Development</h4>
                              <p className="text-muted-foreground text-sm">
                                For testing and development purposes
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                          <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div>
                              <div className="mb-1 font-medium">Domain</div>
                              <div className="text-muted-foreground">
                                dev.alias-mosaic.com
                              </div>
                            </div>
                            <div>
                              <div className="mb-1 font-medium">
                                Auto-Deploy Branch
                              </div>
                              <div className="text-muted-foreground">
                                develop
                              </div>
                            </div>
                            <div>
                              <div className="mb-1 font-medium">
                                Server Resources
                              </div>
                              <div className="text-muted-foreground">
                                1 CPU, 2GB RAM
                              </div>
                            </div>
                            <div>
                              <div className="mb-1 font-medium">
                                Auto-scaling
                              </div>
                              <div className="text-muted-foreground">
                                Disabled
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border-border border-b p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">Staging</h4>
                              <p className="text-muted-foreground text-sm">
                                Pre-production testing environment
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                          <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div>
                              <div className="mb-1 font-medium">Domain</div>
                              <div className="text-muted-foreground">
                                staging.alias-mosaic.com
                              </div>
                            </div>
                            <div>
                              <div className="mb-1 font-medium">
                                Auto-Deploy Branch
                              </div>
                              <div className="text-muted-foreground">main</div>
                            </div>
                            <div>
                              <div className="mb-1 font-medium">
                                Server Resources
                              </div>
                              <div className="text-muted-foreground">
                                2 CPU, 4GB RAM
                              </div>
                            </div>
                            <div>
                              <div className="mb-1 font-medium">
                                Auto-scaling
                              </div>
                              <div className="text-muted-foreground">
                                Enabled (1-3 instances)
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">Production</h4>
                              <p className="text-muted-foreground text-sm">
                                Live environment for end users
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                          <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                            <div>
                              <div className="mb-1 font-medium">Domain</div>
                              <div className="text-muted-foreground">
                                app.alias-mosaic.com
                              </div>
                            </div>
                            <div>
                              <div className="mb-1 font-medium">
                                Auto-Deploy Branch
                              </div>
                              <div className="text-muted-foreground">
                                None (Manual deployments only)
                              </div>
                            </div>
                            <div>
                              <div className="mb-1 font-medium">
                                Server Resources
                              </div>
                              <div className="text-muted-foreground">
                                4 CPU, 8GB RAM
                              </div>
                            </div>
                            <div>
                              <div className="mb-1 font-medium">
                                Auto-scaling
                              </div>
                              <div className="text-muted-foreground">
                                Enabled (2-10 instances)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">
                        CI/CD Integrations
                      </h3>

                      <div className="divide-y rounded-md border border-border dark:divide-border">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center">
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-background">
                              <svg
                                fill="none"
                                height="24"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium">GitHub Actions</h4>
                              <p className="text-muted-foreground text-sm">
                                Connected to alias-mosaic/project-repo
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <div className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 font-medium text-green-800 text-xs dark:bg-green-900/30 dark:text-green-400">
                              Active
                            </div>
                            <Button size="sm" variant="outline">
                              Configure
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center">
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-background">
                              <Terminal className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-medium">Jenkins</h4>
                              <p className="text-muted-foreground text-sm">
                                Not configured
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <div className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-800 text-xs dark:bg-gray-800 dark:text-gray-400">
                              Inactive
                            </div>
                            <Button size="sm" variant="outline">
                              Connect
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center">
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-background">
                              <Workflow className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-medium">CircleCI</h4>
                              <p className="text-muted-foreground text-sm">
                                Not configured
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <div className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-800 text-xs dark:bg-gray-800 dark:text-gray-400">
                              Inactive
                            </div>
                            <Button size="sm" variant="outline">
                              Connect
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {showAssistant && (
            <div className="h-[700px] lg:w-1/3">
              <AIAssistPanel />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
