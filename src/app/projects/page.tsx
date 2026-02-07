"use client";

import {
  AlertTriangle,
  BarChart2,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  FileCode,
  FileText,
  Plus,
  Search,
  Star,
  User,
  Users,
} from "lucide-react";
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

// Mock project data
const projects = [
  {
    id: 1,
    name: "Enterprise CRM Portal",
    description:
      "Customer relationship management system with MOSAIC-powered ontology",
    client: "Acme Corp",
    phase: "Implementation",
    progress: 75,
    status: "active",
    team: 8,
    dueDate: "May 30, 2025",
    priority: "High",
    aiAssistance: 85,
  },
  {
    id: 2,
    name: "Healthcare Analytics Platform",
    description:
      "AI-driven healthcare data analysis platform with FHIR integration",
    client: "MedTech Inc",
    phase: "Design",
    progress: 40,
    status: "active",
    team: 6,
    dueDate: "July 15, 2025",
    priority: "Critical",
    aiAssistance: 92,
  },
  {
    id: 3,
    name: "Financial Services Dashboard",
    description:
      "Real-time financial data visualization and analytics dashboard",
    client: "Global Finance",
    phase: "Planning",
    progress: 20,
    status: "active",
    team: 5,
    dueDate: "August 10, 2025",
    priority: "Medium",
    aiAssistance: 78,
  },
  {
    id: 4,
    name: "E-commerce Marketplace",
    description:
      "Multi-vendor e-commerce platform with integrated payment processing",
    client: "ShopDirect",
    phase: "Validation",
    progress: 90,
    status: "active",
    team: 10,
    dueDate: "June 5, 2025",
    priority: "High",
    aiAssistance: 65,
  },
  {
    id: 5,
    name: "Government Portal Redesign",
    description: "User-centered redesign of government services portal",
    client: "State Dept",
    phase: "Handover",
    progress: 95,
    status: "pending",
    team: 7,
    dueDate: "May 25, 2025",
    priority: "Medium",
    aiAssistance: 70,
  },
  {
    id: 6,
    name: "Logistics Management System",
    description: "End-to-end logistics and supply chain management application",
    client: "Global Shipping",
    phase: "Support",
    progress: 100,
    status: "completed",
    team: 4,
    dueDate: "Completed",
    priority: "Closed",
    aiAssistance: 80,
  },
];

// Function to render status badge
function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <div className="flex items-center rounded-full bg-primary/10 px-2 py-1 text-primary text-xs">
          <Clock className="mr-1 h-3 w-3" />
          Active
        </div>
      );
    case "completed":
      return (
        <div className="flex items-center rounded-full bg-green-500/10 px-2 py-1 text-green-500 text-xs">
          <CheckCircle className="mr-1 h-3 w-3" />
          Completed
        </div>
      );
    case "pending":
      return (
        <div className="flex items-center rounded-full bg-yellow-500/10 px-2 py-1 text-xs text-yellow-500">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </div>
      );
    case "issue":
      return (
        <div className="flex items-center rounded-full bg-red-500/10 px-2 py-1 text-red-500 text-xs">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Issue
        </div>
      );
    default:
      return null;
  }
}

// Function to get phase color
function getPhaseColor(phase: string) {
  switch (phase) {
    case "Initiation":
      return "bg-chart-1 text-white";
    case "Planning":
      return "bg-chart-2 text-white";
    case "Design":
      return "bg-chart-3 text-white";
    case "Implementation":
      return "bg-chart-4 text-white";
    case "Validation":
      return "bg-chart-5 text-white";
    case "Handover":
      return "bg-green-500 text-white";
    case "Support":
      return "bg-blue-400 text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function ProjectsPage() {
  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-1 font-normal text-2xl">Projects</h1>
            <p className="text-muted-foreground">
              Manage your projects across the MOSAIC lifecycle
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Input
                className="w-[200px] border-muted bg-background pl-8 md:w-[300px]"
                placeholder="Search projects..."
              />
              <Search className="absolute top-3 left-2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button className="text-primary-foreground">
              <Plus className="mr-1 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        <Tabs className="mb-6" defaultValue="all">
          <TabsList className="grid grid-cols-4 md:w-[400px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((p) => p.status === "active")
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((p) => p.status === "pending")
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects
                .filter((p) => p.status === "completed")
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-10">
          <h2 className="mb-4 font-normal text-xl">MOSAIC Project Lifecycle</h2>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-7 md:gap-4">
            <LifecyclePhaseCard
              color="bg-chart-1"
              description="Capture requirements, establish project scope"
              icon={<FileText className="h-8 w-8" />}
              number="1"
              title="Initiation & Discovery"
            />
            <LifecyclePhaseCard
              color="bg-chart-2"
              description="Set up sprints, define ontology backbone"
              icon={<Calendar className="h-8 w-8" />}
              number="2"
              title="Planning & Framework"
            />
            <LifecyclePhaseCard
              color="bg-chart-3"
              description="Technical design, schemas, API endpoints"
              icon={<Code className="h-8 w-8" />}
              number="3"
              title="Design & Architecture"
            />
            <LifecyclePhaseCard
              color="bg-chart-4"
              description="Iterative development with MOSAIC AI assistance"
              icon={<FileCode className="h-8 w-8" />}
              number="4"
              title="Implementation"
            />
            <LifecyclePhaseCard
              color="bg-chart-5"
              description="QA, performance testing, compliance checks"
              icon={<CheckCircle className="h-8 w-8" />}
              number="5"
              title="Validation & Testing"
            />
            <LifecyclePhaseCard
              color="bg-green-500"
              description="Knowledge base, documentation, training"
              icon={<Users className="h-8 w-8" />}
              number="6"
              title="Handover & Training"
            />
            <LifecyclePhaseCard
              color="bg-blue-400"
              description="Performance monitoring, predictive analytics"
              icon={<BarChart2 className="h-8 w-8" />}
              number="7"
              title="Support & Optimization"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

interface Project {
  id: number;
  name: string;
  description: string;
  client: string;
  phase: string;
  progress: number;
  status: string;
  team: number;
  dueDate: string;
  priority: string;
  aiAssistance: number;
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="font-normal text-lg">
              {project.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          {getStatusBadge(project.status)}
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="space-y-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary"
              style={{ width: `${project.progress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Client:</span>
              <span className="ml-1 truncate">{project.client}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Team:</span>
              <span className="ml-1">{project.team} members</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Due:</span>
              <span className="ml-1">{project.dueDate}</span>
            </div>
            <div className="flex items-center">
              <Brain className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">AI:</span>
              <span className="ml-1">{project.aiAssistance}%</span>
            </div>
          </div>

          <div className="flex items-center">
            <div
              className={`rounded px-2 py-1 text-xs ${getPhaseColor(project.phase)}`}
            >
              Phase: {project.phase}
            </div>
            <div className="ml-auto">
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex justify-between border-border border-t pt-4 pb-4">
        <Button className="h-8 font-light text-xs" variant="ghost">
          View Details
        </Button>
        <Button className="h-8 font-light text-xs" variant="outline">
          Open Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
}

interface LifecyclePhaseCardProps {
  title: string;
  number: string;
  color: string;
  description: string;
  icon: React.ReactNode;
}

function LifecyclePhaseCard({
  title,
  number,
  color,
  description,
  icon,
}: LifecyclePhaseCardProps) {
  return (
    <Card className="relative overflow-hidden border-border bg-card">
      <div className={`h-2 ${color} absolute top-0 left-0 w-full`} />
      <CardContent className="pt-6 pb-4 text-center">
        <div
          className={`h-10 w-10 rounded-full ${color} mx-auto mb-3 flex items-center justify-center`}
        >
          {icon}
        </div>
        <div
          className={`h-7 w-7 rounded-full border-2 ${color} mx-auto mb-2 flex items-center justify-center text-foreground`}
        >
          {number}
        </div>
        <h3 className="mb-1 font-medium text-sm">{title}</h3>
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}
