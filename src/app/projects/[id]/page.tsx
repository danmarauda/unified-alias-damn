"use client";

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart2,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  Database,
  Download,
  Edit,
  Eye,
  FileCode,
  FileJson,
  FileText,
  GitCommit,
  Layers,
  MessageSquare,
  Share2,
  ShieldCheck,
  Star,
  User,
  Users,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Type definitions for project data
type TeamMember = {
  id: number;
  name: string;
  role: string;
  avatar: string;
};

type ActivityItem = {
  id: number;
  type: string;
  action: string;
  user: string;
  time: string;
};

type RiskItem = {
  id: number;
  name: string;
  severity: string;
  mitigation: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  client: string;
  phase: string;
  progress: number;
  status: string;
  team: TeamMember[];
  dueDate: string;
  startDate: string;
  priority: string;
  aiAssistance: number;
  budget: {
    allocated: number;
    spent: number;
    projected: number;
    currency: string;
  };
  keyMetrics: {
    velocity: number;
    defects: number;
    testCoverage: number;
    stakeholderSatisfaction: number;
  };
  recentActivity: ActivityItem[];
  risks: RiskItem[];
  ontologyStats: {
    totalEntities: number;
    relationships: number;
    semanticEntities: number;
    kineticEntities: number;
    dynamicEntities: number;
  };
  agentContributions: {
    codeGeneration: number;
    documentationCreation: number;
    testCaseGeneration: number;
    requirementsAnalysis: number;
    dataModelGeneration: number;
  };
};

// Mock project data (would come from an API in a real app)
const projects = [
  {
    id: "1",
    name: "Enterprise CRM Portal",
    description:
      "Customer relationship management system with AEOS-powered ontology",
    longDescription:
      "A comprehensive customer relationship management portal built for Acme Corp. The system leverages ALIAS AEOS's agentic development approach to create a flexible, scalable solution that integrates with existing enterprise systems while providing a modern user experience.",
    client: "Acme Corp",
    phase: "Implementation",
    progress: 75,
    status: "active",
    team: [
      { id: 1, name: "Sarah Chen", role: "Project Lead", avatar: "" },
      {
        id: 2,
        name: "Michael Rodriguez",
        role: "Technical Architect",
        avatar: "",
      },
      { id: 3, name: "David Park", role: "Frontend Developer", avatar: "" },
      { id: 4, name: "Lisa Johnson", role: "Backend Developer", avatar: "" },
      { id: 5, name: "Alex Mercer", role: "UX Designer", avatar: "" },
      { id: 6, name: "Samantha Wu", role: "Data Scientist", avatar: "" },
      { id: 7, name: "Thomas Reid", role: "QA Engineer", avatar: "" },
      { id: 8, name: "Olivia Martinez", role: "Business Analyst", avatar: "" },
    ],
    dueDate: "May 30, 2025",
    startDate: "Jan 15, 2025",
    priority: "High",
    aiAssistance: 85,
    budget: {
      allocated: 250_000,
      spent: 180_000,
      projected: 240_000,
      currency: "USD",
    },
    keyMetrics: {
      velocity: 92,
      defects: 12,
      testCoverage: 87,
      stakeholderSatisfaction: 4.8,
    },
    recentActivity: [
      {
        id: 1,
        type: "code",
        action: "Frontend component library update",
        user: "David Park",
        time: "2 hours ago",
      },
      {
        id: 2,
        type: "meeting",
        action: "Weekly progress review with client",
        user: "Sarah Chen",
        time: "Yesterday",
      },
      {
        id: 3,
        type: "ontology",
        action: "Customer entity schema update",
        user: "AI Assistant",
        time: "2 days ago",
      },
      {
        id: 4,
        type: "testing",
        action: "API integration tests completed",
        user: "Thomas Reid",
        time: "3 days ago",
      },
      {
        id: 5,
        type: "deployment",
        action: "Staging environment update",
        user: "Lisa Johnson",
        time: "5 days ago",
      },
    ],
    ontologyStats: {
      totalEntities: 86,
      relationships: 124,
      semanticEntities: 28,
      kineticEntities: 42,
      dynamicEntities: 16,
    },
    agentContributions: {
      codeGeneration: 68,
      documentationCreation: 92,
      testCaseGeneration: 74,
      requirementsAnalysis: 85,
      dataModelGeneration: 90,
    },
    risks: [
      {
        id: 1,
        name: "API integration delay",
        severity: "medium",
        mitigation: "Added resources to integration team",
      },
      {
        id: 2,
        name: "Performance concerns",
        severity: "low",
        mitigation: "Implemented caching strategy",
      },
    ],
  },
];

// Function to get project by ID
function getProject(id: string) {
  return projects.find((p) => p.id === id) || null;
}

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
      return "bg-chart-1";
    case "Planning":
      return "bg-chart-2";
    case "Design":
      return "bg-chart-3";
    case "Implementation":
      return "bg-chart-4";
    case "Validation":
      return "bg-chart-5";
    case "Handover":
      return "bg-green-500";
    case "Support":
      return "bg-blue-400";
    default:
      return "bg-muted";
  }
}

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (params?.id) {
      const projectData = getProject(params.id as string);
      setProject(projectData);
    }
  }, [params?.id]);

  if (!project) {
    return (
      <MainLayout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 md:p-6">
          <AlertTriangle className="mb-4 h-16 w-16 text-muted-foreground" />
          <h1 className="mb-2 font-medium text-2xl">Project Not Found</h1>
          <p className="mb-6 text-muted-foreground">
            The project you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <Link href="/projects">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        {/* Project header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-2 flex items-center">
              <Link className="mr-4" href="/projects">
                <Button className="h-8 w-8" size="icon" variant="ghost">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="font-normal text-2xl">{project.name}</h1>
              {getStatusBadge(project.status)}
            </div>
            <p className="max-w-2xl text-muted-foreground">
              {project.longDescription || project.description}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              className="border-muted font-light text-xs"
              variant="outline"
            >
              <Share2 className="mr-1 h-4 w-4" />
              Share
            </Button>
            <Button
              className="border-muted font-light text-xs"
              variant="outline"
            >
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button className="font-light text-primary-foreground text-xs">
              <Brain className="mr-1 h-4 w-4" />
              AI Assist
            </Button>
          </div>
        </div>

        {/* Project overview row */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
          <InfoCard
            icon={<Calendar className="h-5 w-5 text-primary" />}
            indicator={
              <div
                className={`h-2 w-2 rounded-full ${getPhaseColor(project.phase)}`}
              />
            }
            subtitle={`Phase: ${project.phase}`}
            title="Timeline"
            value={`${project.startDate} - ${project.dueDate}`}
          />

          <InfoCard
            icon={<Users className="h-5 w-5 text-primary" />}
            subtitle={`Lead: ${project.team.find((t) => t.role.includes("Lead"))?.name || "Unassigned"}`}
            title="Team"
            value={`${project.team.length} Members`}
          />

          <InfoCard
            icon={<User className="h-5 w-5 text-primary" />}
            subtitle={`Priority: ${project.priority}`}
            title="Client"
            value={project.client}
          />

          <InfoCard
            icon={<Brain className="h-5 w-5 text-primary" />}
            indicator={
              <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${project.aiAssistance}%` }}
                />
              </div>
            }
            subtitle="Automated workflows"
            title="AI Assistance"
            value={`${project.aiAssistance}%`}
          />

          <InfoCard
            icon={<BarChart2 className="h-5 w-5 text-primary" />}
            indicator={
              <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            }
            subtitle={`Budget: $${project.budget.spent.toLocaleString()} / $${project.budget.allocated.toLocaleString()}`}
            title="Progress"
            value={`${project.progress}% Complete`}
          />
        </div>

        <Tabs className="space-y-4" defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="ontology">Ontology</TabsTrigger>
            <TabsTrigger value="ai-agents">AI Agents</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-4" value="overview">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Key metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center font-normal text-base">
                    <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <MetricItem
                      icon={<Activity className="h-4 w-4 text-primary" />}
                      label="Sprint Velocity"
                      max={100}
                      value={project.keyMetrics.velocity}
                    />
                    <MetricItem
                      icon={
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      }
                      inverse
                      label="Open Defects"
                      max={50}
                      value={project.keyMetrics.defects}
                    />
                    <MetricItem
                      icon={<ShieldCheck className="h-4 w-4 text-green-500" />}
                      label="Test Coverage"
                      max={100}
                      value={project.keyMetrics.testCoverage}
                    />
                    <MetricItem
                      icon={<Star className="h-4 w-4 text-yellow-500" />}
                      label="Stakeholder Satisfaction"
                      max={100}
                      suffix={`${project.keyMetrics.stakeholderSatisfaction}/5`}
                      value={project.keyMetrics.stakeholderSatisfaction * 20}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center font-normal text-base">
                    <Activity className="mr-2 h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.recentActivity.map((activity) => (
                      <div
                        className="flex items-start space-x-3 border-border border-b pb-3 last:border-0"
                        key={activity.id}
                      >
                        <div className="rounded bg-primary/10 p-1.5 text-primary">
                          {activity.type === "code" && (
                            <Code className="h-4 w-4" />
                          )}
                          {activity.type === "meeting" && (
                            <MessageSquare className="h-4 w-4" />
                          )}
                          {activity.type === "ontology" && (
                            <Database className="h-4 w-4" />
                          )}
                          {activity.type === "testing" && (
                            <ShieldCheck className="h-4 w-4" />
                          )}
                          {activity.type === "deployment" && (
                            <GitCommit className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm">
                            {activity.action}
                          </p>
                          <div className="flex justify-between text-muted-foreground text-xs">
                            <span>{activity.user}</span>
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risks and Issues */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center font-normal text-base">
                    <AlertTriangle className="mr-2 h-5 w-5 text-primary" />
                    Risks & Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {project.risks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <CheckCircle className="mb-2 h-12 w-12 text-green-500 opacity-50" />
                      <p className="text-muted-foreground">
                        No active risks or issues
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {project.risks.map((risk) => (
                        <div
                          className="rounded-md border border-border p-3"
                          key={risk.id}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-medium">{risk.name}</h3>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs ${
                                risk.severity === "high"
                                  ? "bg-red-500/10 text-red-500"
                                  : risk.severity === "medium"
                                    ? "bg-yellow-500/10 text-yellow-500"
                                    : "bg-green-500/10 text-green-500"
                              }`}
                            >
                              {risk.severity}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Mitigation: {risk.mitigation}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center font-normal text-base">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {project.team.map((member) => (
                    <div
                      className="flex flex-col items-center rounded-md border border-border p-4"
                      key={member.id}
                    >
                      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {member.avatar ? (
                          <img
                            alt={member.name}
                            className="h-full w-full rounded-full object-cover"
                            src={member.avatar}
                          />
                        ) : (
                          <span className="font-medium text-xl">
                            {member.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-center font-medium">{member.name}</h3>
                      <p className="text-center text-muted-foreground text-sm">
                        {member.role}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ontology">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center font-normal text-base">
                  <Layers className="mr-2 h-5 w-5 text-primary" />
                  Project Ontology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 font-medium text-sm">
                      Ontology Structure
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-primary" />
                          <span className="text-sm">Semantic Layer</span>
                        </div>
                        <span className="font-medium">
                          {project.ontologyStats.semanticEntities}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-chart-2" />
                          <span className="text-sm">Kinetic Layer</span>
                        </div>
                        <span className="font-medium">
                          {project.ontologyStats.kineticEntities}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-chart-3" />
                          <span className="text-sm">Dynamic Layer</span>
                        </div>
                        <span className="font-medium">
                          {project.ontologyStats.dynamicEntities}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-chart-4" />
                          <span className="text-sm">Relationships</span>
                        </div>
                        <span className="font-medium">
                          {project.ontologyStats.relationships}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button className="mr-2">
                        <Eye className="mr-1 h-4 w-4" />
                        View Ontology
                      </Button>
                      <Button variant="outline">
                        <Download className="mr-1 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 font-medium text-sm">Key Entities</h3>
                    <div className="overflow-x-auto rounded-md bg-black/80 p-4 text-muted-foreground text-xs">
                      <pre>
                        {JSON.stringify(
                          {
                            Customer: {
                              type: "SemanticEntity",
                              properties: [
                                "id",
                                "name",
                                "contact",
                                "accountLevel",
                              ],
                              relationships: ["has_orders", "has_invoices"],
                            },
                            Order: {
                              type: "SemanticEntity",
                              properties: ["id", "date", "amount", "status"],
                              relationships: [
                                "belongs_to_customer",
                                "contains_products",
                              ],
                            },
                            CustomerRecord: {
                              type: "KineticEntity",
                              properties: ["lastUpdated", "dataSource"],
                              operations: ["update", "retrieve", "archive"],
                            },
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-agents">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center font-normal text-base">
                  <Brain className="mr-2 h-5 w-5 text-primary" />
                  AI Agent Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 font-medium text-sm">
                      Agent Contribution by Area
                    </h3>
                    <div className="space-y-4">
                      <MetricItem
                        icon={<Code className="h-4 w-4 text-primary" />}
                        label="Code Generation"
                        max={100}
                        value={project.agentContributions.codeGeneration}
                      />
                      <MetricItem
                        icon={<FileText className="h-4 w-4 text-primary" />}
                        label="Documentation"
                        max={100}
                        value={project.agentContributions.documentationCreation}
                      />
                      <MetricItem
                        icon={<ShieldCheck className="h-4 w-4 text-primary" />}
                        label="Test Case Generation"
                        max={100}
                        value={project.agentContributions.testCaseGeneration}
                      />
                      <MetricItem
                        icon={<FileJson className="h-4 w-4 text-primary" />}
                        label="Requirements Analysis"
                        max={100}
                        value={project.agentContributions.requirementsAnalysis}
                      />
                      <MetricItem
                        icon={<Database className="h-4 w-4 text-primary" />}
                        label="Data Model Generation"
                        max={100}
                        value={project.agentContributions.dataModelGeneration}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 font-medium text-sm">
                      Agent Operations
                    </h3>
                    <div className="space-y-3">
                      <div className="rounded-md border border-border p-4">
                        <div className="flex items-center">
                          <div className="mr-3 rounded-md bg-primary/10 p-2 text-primary">
                            <FileJson className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Requirements Agent</h4>
                            <p className="text-muted-foreground text-sm">
                              Processes client requirements and generates
                              ontology entities
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-md border border-border p-4">
                        <div className="flex items-center">
                          <div className="mr-3 rounded-md bg-primary/10 p-2 text-primary">
                            <Code className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Code Assistant</h4>
                            <p className="text-muted-foreground text-sm">
                              Generates code based on ontology models and
                              specifications
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-md border border-border p-4">
                        <div className="flex items-center">
                          <div className="mr-3 rounded-md bg-primary/10 p-2 text-primary">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">QA Tester</h4>
                            <p className="text-muted-foreground text-sm">
                              Creates and runs test cases for components and
                              integrations
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button className="w-full">
                        <Brain className="mr-1 h-4 w-4" />
                        Create Custom Agent
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center font-normal text-base">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Project Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <DocumentCard
                    title="Project Specification"
                    type="document"
                    updatedAt="May 15, 2025"
                    updatedBy="Sarah Chen"
                  />
                  <DocumentCard
                    title="System Architecture"
                    type="diagram"
                    updatedAt="May 10, 2025"
                    updatedBy="Michael Rodriguez"
                  />
                  <DocumentCard
                    title="API Documentation"
                    type="api"
                    updatedAt="May 8, 2025"
                    updatedBy="Lisa Johnson"
                  />
                  <DocumentCard
                    title="User Interface Mockups"
                    type="design"
                    updatedAt="May 5, 2025"
                    updatedBy="Alex Mercer"
                  />
                  <DocumentCard
                    title="Database Schema"
                    type="database"
                    updatedAt="May 3, 2025"
                    updatedBy="David Park"
                  />
                  <DocumentCard
                    title="Test Plan"
                    type="test"
                    updatedAt="May 1, 2025"
                    updatedBy="Thomas Reid"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// Helper component for info cards
type InfoCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  indicator?: React.ReactNode;
};

function InfoCard({ icon, title, value, subtitle, indicator }: InfoCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start">
          <div className="mr-3 rounded-md bg-primary/10 p-2">{icon}</div>
          <div>
            <h3 className="text-muted-foreground text-sm">{title}</h3>
            <div className="font-medium">{value}</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">{subtitle}</span>
          {indicator}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for metrics with progress bars
type MetricItemProps = {
  label: string;
  value: number;
  max?: number;
  icon?: React.ReactNode;
  suffix?: string;
  inverse?: boolean;
};

function MetricItem({
  label,
  value,
  max = 100,
  icon,
  suffix,
  inverse = false,
}: MetricItemProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className="text-sm">{label}</span>
        </div>
        <span className="font-medium text-sm">{suffix || `${value}%`}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full ${inverse ? "bg-yellow-500" : "bg-primary"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Helper component for document cards
type DocumentCardProps = {
  title: string;
  type: string;
  updatedAt: string;
  updatedBy: string;
};

function DocumentCard({
  title,
  type,
  updatedAt,
  updatedBy,
}: DocumentCardProps) {
  const getIcon = () => {
    switch (type) {
      case "document":
        return <FileText className="h-6 w-6" />;
      case "diagram":
        return <Workflow className="h-6 w-6" />;
      case "api":
        return <Code className="h-6 w-6" />;
      case "design":
        return <FileCode className="h-6 w-6" />;
      case "database":
        return <Database className="h-6 w-6" />;
      case "test":
        return <ShieldCheck className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  return (
    <div className="rounded-md border border-border p-4 transition-colors hover:border-primary/50">
      <div className="flex items-center space-x-3">
        <div className="rounded-md bg-primary/10 p-2 text-primary">
          {getIcon()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium">{title}</h3>
          <div className="flex justify-between text-muted-foreground text-xs">
            <span>{updatedBy}</span>
            <span>{updatedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
