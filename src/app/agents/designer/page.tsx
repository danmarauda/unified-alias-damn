"use client";

import {
  ArrowLeft,
  Check,
  Code,
  Copy,
  Database,
  Edit,
  FileText,
  Layers,
  PanelLeft,
  PanelRight,
  Play,
  Plus,
  Save,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";
import { AIAssistPanel } from "@/components/dashboard/AIAssistPanel";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Agent types
const agentTypes = [
  {
    id: "code-assistant",
    name: "Code Assistant",
    description: "Generates and optimizes code based on specifications",
    icon: <Code className="h-10 w-10" />,
    category: "development",
    complexity: "medium",
  },
  {
    id: "data-processor",
    name: "Data Processor",
    description: "Transforms and analyzes data structures",
    icon: <Database className="h-10 w-10" />,
    category: "data",
    complexity: "high",
  },
  {
    id: "documentation",
    name: "Documentation Generator",
    description:
      "Creates comprehensive documentation from code and specifications",
    icon: <FileText className="h-10 w-10" />,
    category: "documentation",
    complexity: "low",
  },
  {
    id: "test-generator",
    name: "Test Generator",
    description: "Generates comprehensive test cases and test scripts",
    icon: <Play className="h-10 w-10" />,
    category: "quality",
    complexity: "medium",
  },
  {
    id: "ontology-mapper",
    name: "Ontology Mapper",
    description: "Maps and transforms ontology structures",
    icon: <Layers className="h-10 w-10" />,
    category: "architecture",
    complexity: "high",
  },
];

// Agent templates
const agentTemplates = [
  {
    id: "template-1",
    name: "API Generator",
    description: "Creates RESTful APIs based on ontology entities",
    agentType: "code-assistant",
    popularity: 4.8,
    usageCount: 1243,
  },
  {
    id: "template-2",
    name: "Data Schema Analyzer",
    description: "Analyzes and optimizes database schemas",
    agentType: "data-processor",
    popularity: 4.6,
    usageCount: 987,
  },
  {
    id: "template-3",
    name: "UI Component Builder",
    description: "Generates React components from design specs",
    agentType: "code-assistant",
    popularity: 4.9,
    usageCount: 1582,
  },
];

// Code editor mock content
const exampleAgentCode = `// MOSAIC Agent Configuration
{
  "name": "Custom Code Assistant",
  "version": "1.0.0",
  "description": "Generates optimized code based on specifications",
  "type": "code-assistant",
  "capabilities": [
    "code-generation",
    "code-optimization",
    "code-review"
  ],
  "inputFormats": ["text", "json", "typescript"],
  "outputFormats": ["typescript", "javascript", "jsx", "tsx"],
  "ontologyMapping": {
    "semantic": ["Customer", "Order", "Product"],
    "kinetic": ["CustomerRecord", "OrderProcess"],
    "dynamic": ["CustomerAPI", "OrderAPI"]
  },
  "parameters": {
    "maxTokens": 4096,
    "temperature": 0.7,
    "topP": 0.95,
    "presencePenalty": 0.1,
    "frequencyPenalty": 0.1
  },
  "hooks": {
    "beforeExecution": "validateInput",
    "afterExecution": "formatOutput"
  },
  "access": {
    "projectLevel": true,
    "ontologyAccess": "read-write",
    "codebaseAccess": "read-write"
  }
}`;

// Sample agent capabilities and permissions
const agentCapabilities = [
  { id: "cap-1", name: "Code Generation", enabled: true },
  { id: "cap-2", name: "Code Optimization", enabled: true },
  { id: "cap-3", name: "Code Review", enabled: true },
  { id: "cap-4", name: "Documentation Generation", enabled: false },
  { id: "cap-5", name: "Test Generation", enabled: false },
  { id: "cap-6", name: "Dependency Analysis", enabled: true },
];

const agentPermissions = [
  { id: "perm-1", name: "Read Ontology", enabled: true },
  { id: "perm-2", name: "Write Ontology", enabled: false },
  { id: "perm-3", name: "Read Codebase", enabled: true },
  { id: "perm-4", name: "Write Codebase", enabled: true },
  { id: "perm-5", name: "Execute Commands", enabled: false },
  { id: "perm-6", name: "Access External APIs", enabled: false },
];

export default function AgentDesignerPage() {
  const [selectedAgentType, setSelectedAgentType] = useState<(typeof agentTypes)[number] | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [agentName, setAgentName] = useState("My Custom Agent");
  const [agentDescription, setAgentDescription] = useState("");
  const [designStep, setDesignStep] = useState(1);
  const [showAssistant, setShowAssistant] = useState(false);

  // Handle agent type selection
  const handleSelectAgentType = (agentType: (typeof agentTypes)[number]) => {
    setSelectedAgentType(agentType);
    setAgentDescription(agentType.description);
  };

  // Handle template selection
  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template);
    setAgentName(template.name);
    setAgentDescription(template.description);
  };

  // Move to next step
  const handleNextStep = () => {
    setDesignStep((prev) => prev + 1);
  };

  // Move to previous step
  const handlePrevStep = () => {
    setDesignStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6 flex items-center">
          <Button asChild className="mr-2" size="icon" variant="ghost">
            <a href="/agents">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>
          <div>
            <h1 className="font-normal text-2xl">Agent Designer</h1>
            <p className="text-muted-foreground">
              Create and configure custom AI agents for your MOSAIC projects
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className={`flex-1 ${showAssistant ? "lg:w-2/3" : "w-full"}`}>
            <Card className="border-border bg-card">
              <CardHeader className="border-border border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {designStep === 1
                      ? "Choose Agent Type"
                      : designStep === 2
                        ? "Configure Agent"
                        : designStep === 3
                          ? "Advanced Settings"
                          : "Test Agent"}
                  </CardTitle>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setShowAssistant(!showAssistant)}
                      size="sm"
                      variant="outline"
                    >
                      {showAssistant ? (
                        <PanelRight className="mr-1 h-4 w-4" />
                      ) : (
                        <PanelLeft className="mr-1 h-4 w-4" />
                      )}
                      {showAssistant ? "Hide Assistant" : "Show Assistant"}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Save className="mr-1 h-4 w-4" />
                      Save Draft
                    </Button>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-4 flex items-center">
                  {[1, 2, 3, 4].map((step) => (
                    <div className="flex flex-1 items-center" key={step}>
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          step === designStep
                            ? "bg-primary text-primary-foreground"
                            : step < designStep
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {step}
                      </div>
                      {step < 4 && (
                        <div
                          className={`h-1 flex-1 ${step < designStep ? "bg-primary" : "bg-secondary"}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {designStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 font-medium text-lg">
                        Choose an Agent Type
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {agentTypes.map((agentType) => (
                          <div
                            className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                              selectedAgentType?.id === agentType.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            key={agentType.id}
                            onClick={() => handleSelectAgentType(agentType)}
                          >
                            <div className="flex flex-col items-center text-center">
                              <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">
                                {agentType.icon}
                              </div>
                              <h4 className="mb-1 font-medium">
                                {agentType.name}
                              </h4>
                              <p className="text-muted-foreground text-sm">
                                {agentType.description}
                              </p>
                              <div className="mt-3 flex w-full justify-between">
                                <span className="rounded-full bg-secondary px-2 py-1 text-xs">
                                  {agentType.category}
                                </span>
                                <span className="rounded-full bg-secondary px-2 py-1 text-xs">
                                  {agentType.complexity} complexity
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedAgentType && (
                      <div>
                        <h3 className="mb-4 font-medium text-lg">
                          Or Start From a Template
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          {agentTemplates
                            .filter(
                              (template) =>
                                template.agentType === selectedAgentType.id
                            )
                            .map((template) => (
                              <div
                                className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                                  selectedTemplate?.id === template.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                                }`}
                                key={template.id}
                                onClick={() => handleSelectTemplate(template)}
                              >
                                <h4 className="mb-1 font-medium">
                                  {template.name}
                                </h4>
                                <p className="mb-2 text-muted-foreground text-sm">
                                  {template.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="mr-1 text-yellow-500">
                                      ★
                                    </div>
                                    <span className="text-sm">
                                      {template.popularity.toFixed(1)}
                                    </span>
                                  </div>
                                  <span className="text-muted-foreground text-xs">
                                    {template.usageCount} uses
                                  </span>
                                </div>
                              </div>
                            ))}

                          <div
                            className="flex h-full cursor-pointer flex-col items-center justify-center rounded-lg border border-border border-dashed p-4 text-center transition-colors hover:border-primary/50"
                            onClick={() => {
                              setSelectedTemplate(null);
                              setAgentName(`Custom ${selectedAgentType.name}`);
                              setAgentDescription(
                                `Custom ${selectedAgentType.description.toLowerCase()}`
                              );
                            }}
                          >
                            <div className="mb-2 rounded-full bg-secondary p-3 text-muted-foreground">
                              <Plus className="h-6 w-6" />
                            </div>
                            <h4 className="font-medium">Start from scratch</h4>
                            <p className="text-muted-foreground text-sm">
                              Create a custom agent
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {designStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block font-medium text-sm">
                          Agent Name
                        </label>
                        <Input
                          className="border-muted bg-background"
                          onChange={(e) => setAgentName(e.target.value)}
                          value={agentName}
                        />
                      </div>

                      <div>
                        <label className="mb-1 block font-medium text-sm">
                          Agent Type
                        </label>
                        <div className="rounded-md border border-muted bg-background px-3 py-2 text-muted-foreground">
                          {selectedAgentType?.name}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block font-medium text-sm">
                        Description
                      </label>
                      <textarea
                        className="h-24 w-full resize-none rounded-md border border-muted bg-background px-3 py-2"
                        onChange={(e) => setAgentDescription(e.target.value)}
                        value={agentDescription}
                      />
                    </div>

                    <div>
                      <h3 className="mb-3 font-medium text-sm">Capabilities</h3>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {agentCapabilities.map((capability) => (
                          <div
                            className="flex items-center space-x-2"
                            key={capability.id}
                          >
                            <input
                              checked={capability.enabled}
                              className="h-4 w-4 rounded border-muted bg-background"
                              id={capability.id}
                              type="checkbox"
                            />
                            <label className="text-sm" htmlFor={capability.id}>
                              {capability.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 font-medium text-sm">Permissions</h3>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {agentPermissions.map((permission) => (
                          <div
                            className="flex items-center space-x-2"
                            key={permission.id}
                          >
                            <input
                              checked={permission.enabled}
                              className="h-4 w-4 rounded border-muted bg-background"
                              id={permission.id}
                              type="checkbox"
                            />
                            <label className="text-sm" htmlFor={permission.id}>
                              {permission.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {designStep === 3 && (
                  <div className="space-y-6">
                    <Tabs defaultValue="code">
                      <TabsList>
                        <TabsTrigger value="code">Configuration</TabsTrigger>
                        <TabsTrigger value="ontology">
                          Ontology Mapping
                        </TabsTrigger>
                        <TabsTrigger value="parameters">Parameters</TabsTrigger>
                        <TabsTrigger value="hooks">Hooks</TabsTrigger>
                      </TabsList>

                      <TabsContent className="mt-4" value="code">
                        <div className="relative">
                          <pre className="overflow-x-auto rounded-md bg-black p-4 font-mono text-sm">
                            <code className="text-muted-foreground">
                              {exampleAgentCode}
                            </code>
                          </pre>
                          <div className="absolute top-2 right-2 flex space-x-1">
                            <Button
                              className="h-7 w-7 bg-background/20"
                              size="icon"
                              variant="ghost"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              className="h-7 w-7 bg-background/20"
                              size="icon"
                              variant="ghost"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent className="mt-4" value="ontology">
                        <div className="rounded-md border border-border p-4">
                          <h3 className="mb-3 font-medium text-sm">
                            Ontology Entity Access
                          </h3>
                          <p className="mb-4 text-muted-foreground text-sm">
                            Select which ontology entities this agent can access
                            and modify
                          </p>

                          <div className="space-y-4">
                            <div>
                              <h4 className="mb-2 flex items-center text-sm">
                                <span className="mr-2 h-3 w-3 rounded-full bg-primary" />
                                Semantic Layer
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                <div className="flex items-center rounded-full border border-primary/50 px-2 py-1 text-xs">
                                  Customer{" "}
                                  <Check className="ml-1 h-3 w-3 text-primary" />
                                </div>
                                <div className="flex items-center rounded-full border border-primary/50 px-2 py-1 text-xs">
                                  Order{" "}
                                  <Check className="ml-1 h-3 w-3 text-primary" />
                                </div>
                                <div className="flex items-center rounded-full border border-primary/50 px-2 py-1 text-xs">
                                  Product{" "}
                                  <Check className="ml-1 h-3 w-3 text-primary" />
                                </div>
                                <div className="flex items-center rounded-full border border-border px-2 py-1 text-muted-foreground text-xs">
                                  Invoice
                                </div>
                                <div className="flex items-center rounded-full border border-border px-2 py-1 text-muted-foreground text-xs">
                                  Payment
                                </div>
                                <Button
                                  className="h-6 rounded-full px-2 text-xs"
                                  size="sm"
                                  variant="outline"
                                >
                                  <Plus className="mr-1 h-3 w-3" />
                                  Add Entity
                                </Button>
                              </div>
                            </div>

                            <div>
                              <h4 className="mb-2 flex items-center text-sm">
                                <span className="mr-2 h-3 w-3 rounded-full bg-chart-2" />
                                Kinetic Layer
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                <div className="flex items-center rounded-full border border-primary/50 px-2 py-1 text-xs">
                                  CustomerRecord{" "}
                                  <Check className="ml-1 h-3 w-3 text-primary" />
                                </div>
                                <div className="flex items-center rounded-full border border-primary/50 px-2 py-1 text-xs">
                                  OrderProcess{" "}
                                  <Check className="ml-1 h-3 w-3 text-primary" />
                                </div>
                                <div className="flex items-center rounded-full border border-border px-2 py-1 text-muted-foreground text-xs">
                                  ProductCatalog
                                </div>
                                <Button
                                  className="h-6 rounded-full px-2 text-xs"
                                  size="sm"
                                  variant="outline"
                                >
                                  <Plus className="mr-1 h-3 w-3" />
                                  Add Entity
                                </Button>
                              </div>
                            </div>

                            <div>
                              <h4 className="mb-2 flex items-center text-sm">
                                <span className="mr-2 h-3 w-3 rounded-full bg-chart-3" />
                                Dynamic Layer
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                <div className="flex items-center rounded-full border border-primary/50 px-2 py-1 text-xs">
                                  CustomerAPI{" "}
                                  <Check className="ml-1 h-3 w-3 text-primary" />
                                </div>
                                <div className="flex items-center rounded-full border border-primary/50 px-2 py-1 text-xs">
                                  OrderAPI{" "}
                                  <Check className="ml-1 h-3 w-3 text-primary" />
                                </div>
                                <Button
                                  className="h-6 rounded-full px-2 text-xs"
                                  size="sm"
                                  variant="outline"
                                >
                                  <Plus className="mr-1 h-3 w-3" />
                                  Add Entity
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent className="mt-4" value="parameters">
                        <div className="rounded-md border border-border p-4">
                          <h3 className="mb-3 font-medium text-sm">
                            Model Parameters
                          </h3>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-sm">
                                Temperature
                              </label>
                              <div className="flex items-center">
                                <input
                                  className="mr-2 w-full"
                                  defaultValue="7"
                                  max="10"
                                  min="0"
                                  step="0.1"
                                  type="range"
                                />
                                <span className="font-mono text-sm">0.7</span>
                              </div>
                              <p className="mt-1 text-muted-foreground text-xs">
                                Controls randomness: lower is more deterministic
                              </p>
                            </div>

                            <div>
                              <label className="mb-1 block text-sm">
                                Max Tokens
                              </label>
                              <Input
                                className="border-muted bg-background"
                                defaultValue="4096"
                                type="number"
                              />
                              <p className="mt-1 text-muted-foreground text-xs">
                                Maximum tokens in completion
                              </p>
                            </div>

                            <div>
                              <label className="mb-1 block text-sm">
                                Top P
                              </label>
                              <div className="flex items-center">
                                <input
                                  className="mr-2 w-full"
                                  defaultValue="9.5"
                                  max="10"
                                  min="0"
                                  step="0.05"
                                  type="range"
                                />
                                <span className="font-mono text-sm">0.95</span>
                              </div>
                              <p className="mt-1 text-muted-foreground text-xs">
                                Controls diversity via nucleus sampling
                              </p>
                            </div>

                            <div>
                              <label className="mb-1 block text-sm">
                                Frequency Penalty
                              </label>
                              <div className="flex items-center">
                                <input
                                  className="mr-2 w-full"
                                  defaultValue="1"
                                  max="20"
                                  min="0"
                                  step="0.1"
                                  type="range"
                                />
                                <span className="font-mono text-sm">0.1</span>
                              </div>
                              <p className="mt-1 text-muted-foreground text-xs">
                                How much to penalize new tokens based on
                                frequency
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent className="mt-4" value="hooks">
                        <div className="rounded-md border border-border p-4">
                          <h3 className="mb-3 font-medium text-sm">
                            Execution Hooks
                          </h3>
                          <p className="mb-4 text-muted-foreground text-sm">
                            Configure functions that run before and after agent
                            execution
                          </p>

                          <div className="space-y-4">
                            <div>
                              <label className="mb-1 block font-medium text-sm">
                                Before Execution
                              </label>
                              <select className="w-full rounded-md border border-muted bg-background px-3 py-2">
                                <option value="validateInput">
                                  validateInput
                                </option>
                                <option value="prepareContext">
                                  prepareContext
                                </option>
                                <option value="checkOntology">
                                  checkOntology
                                </option>
                                <option value="custom">Custom Function</option>
                              </select>
                            </div>

                            <div>
                              <label className="mb-1 block font-medium text-sm">
                                After Execution
                              </label>
                              <select className="w-full rounded-md border border-muted bg-background px-3 py-2">
                                <option value="formatOutput">
                                  formatOutput
                                </option>
                                <option value="validateOutput">
                                  validateOutput
                                </option>
                                <option value="updateOntology">
                                  updateOntology
                                </option>
                                <option value="custom">Custom Function</option>
                              </select>
                            </div>

                            <div>
                              <label className="mb-1 block font-medium text-sm">
                                Error Handler
                              </label>
                              <select className="w-full rounded-md border border-muted bg-background px-3 py-2">
                                <option value="defaultErrorHandler">
                                  defaultErrorHandler
                                </option>
                                <option value="logAndRetry">logAndRetry</option>
                                <option value="fallbackToCache">
                                  fallbackToCache
                                </option>
                                <option value="custom">Custom Function</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {designStep === 4 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <Card className="bg-background">
                          <CardHeader className="pb-2">
                            <CardTitle className="font-normal text-base">
                              Agent Overview
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <dl className="space-y-2">
                              <div>
                                <dt className="text-muted-foreground text-sm">
                                  Name
                                </dt>
                                <dd className="font-medium">{agentName}</dd>
                              </div>
                              <div>
                                <dt className="text-muted-foreground text-sm">
                                  Type
                                </dt>
                                <dd>{selectedAgentType?.name}</dd>
                              </div>
                              <div>
                                <dt className="text-muted-foreground text-sm">
                                  Description
                                </dt>
                                <dd className="text-sm">{agentDescription}</dd>
                              </div>
                              <div>
                                <dt className="text-muted-foreground text-sm">
                                  Capabilities
                                </dt>
                                <dd>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {agentCapabilities
                                      .filter((cap) => cap.enabled)
                                      .map((cap) => (
                                        <span
                                          className="rounded-full bg-secondary px-2 py-0.5 text-xs"
                                          key={cap.id}
                                        >
                                          {cap.name}
                                        </span>
                                      ))}
                                  </div>
                                </dd>
                              </div>
                            </dl>
                          </CardContent>
                        </Card>

                        <div className="mt-4 rounded-md border border-border p-4">
                          <h3 className="mb-3 font-medium text-sm">
                            Test Agent
                          </h3>
                          <div className="space-y-3">
                            <textarea
                              className="h-24 w-full resize-none rounded-md border border-muted bg-background px-3 py-2"
                              placeholder="Enter test input for your agent..."
                            />
                            <Button>
                              <Play className="mr-1 h-4 w-4" />
                              Run Test
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Card className="h-full bg-background">
                          <CardHeader className="pb-2">
                            <CardTitle className="font-normal text-base">
                              Sample Interactions
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="rounded-md border border-border p-3">
                                <div className="flex items-start gap-3">
                                  <div className="rounded-md bg-primary/10 p-2">
                                    <User className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="mb-1 font-medium text-sm">
                                      Input
                                    </p>
                                    <p className="text-sm">
                                      Generate an API endpoint for the Customer
                                      entity that includes CRUD operations.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="rounded-md border border-border p-3">
                                <div className="flex items-start gap-3">
                                  <div className="rounded-md bg-primary/10 p-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="mb-1 font-medium text-sm">
                                      Output
                                    </p>
                                    <div className="text-sm">
                                      <p className="mb-2">
                                        Here's a RESTful API endpoint for the
                                        Customer entity:
                                      </p>
                                      <pre className="overflow-x-auto rounded-md bg-black/80 p-2 text-muted-foreground text-xs">
                                        {`import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';

const router = Router();
const controller = new CustomerController();

// Get all customers
router.get('/', controller.getAll);

// Get a specific customer
router.get('/:id', controller.getById);

// Create a new customer
router.post('/', controller.create);

// Update a customer
router.put('/:id', controller.update);

// Delete a customer
router.delete('/:id', controller.delete);

export default router;`}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between border-border border-t p-4">
                <Button
                  disabled={designStep === 1}
                  onClick={handlePrevStep}
                  variant="outline"
                >
                  Previous
                </Button>

                <div>
                  {designStep < 4 ? (
                    <Button
                      disabled={
                        (designStep === 1 && !selectedAgentType) ||
                        (designStep === 2 && !agentName.trim())
                      }
                      onClick={handleNextStep}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button className="bg-green-600 hover:bg-green-700">
                      Deploy Agent
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
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
