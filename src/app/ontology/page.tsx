"use client";

import {
  Database,
  DownloadCloud,
  FileText,
  Filter,
  Layers,
  Network,
  Plus,
  Search,
  Settings,
  Share2,
  Users,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CollaborativeOntologyVisualizer } from "@/components/ontology/CollaborativeOntologyVisualizer";
import { OntologyVisualizer } from "@/components/ontology/OntologyVisualizer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ontologyEntities = {
  semantic: [
    {
      id: "sem-1",
      name: "Customer",
      type: "Semantic",
      layer: "Business Concept",
      connections: 12,
    },
    {
      id: "sem-2",
      name: "Product",
      type: "Semantic",
      layer: "Business Concept",
      connections: 8,
    },
    {
      id: "sem-3",
      name: "Order",
      type: "Semantic",
      layer: "Business Concept",
      connections: 15,
    },
    {
      id: "sem-4",
      name: "Invoice",
      type: "Semantic",
      layer: "Business Concept",
      connections: 7,
    },
    {
      id: "sem-5",
      name: "Account",
      type: "Semantic",
      layer: "Business Concept",
      connections: 10,
    },
    {
      id: "sem-6",
      name: "Payment",
      type: "Semantic",
      layer: "Business Concept",
      connections: 9,
    },
    {
      id: "sem-7",
      name: "Shipment",
      type: "Semantic",
      layer: "Business Concept",
      connections: 6,
    },
    {
      id: "sem-8",
      name: "User",
      type: "Semantic",
      layer: "Business Concept",
      connections: 11,
    },
  ],
  kinetic: [
    {
      id: "kin-1",
      name: "CustomerRecord",
      type: "Kinetic",
      layer: "Domain Object",
      connections: 8,
    },
    {
      id: "kin-2",
      name: "ProductItem",
      type: "Kinetic",
      layer: "Domain Object",
      connections: 7,
    },
    {
      id: "kin-3",
      name: "OrderProcess",
      type: "Kinetic",
      layer: "Process",
      connections: 12,
    },
    {
      id: "kin-4",
      name: "InvoiceGenerator",
      type: "Kinetic",
      layer: "Service",
      connections: 5,
    },
    {
      id: "kin-5",
      name: "AccountManager",
      type: "Kinetic",
      layer: "Service",
      connections: 9,
    },
    {
      id: "kin-6",
      name: "PaymentProcessor",
      type: "Kinetic",
      layer: "Service",
      connections: 8,
    },
  ],
  dynamic: [
    {
      id: "dyn-1",
      name: "CustomerAPI",
      type: "Dynamic",
      layer: "Interface",
      connections: 7,
    },
    {
      id: "dyn-2",
      name: "ProductCatalog",
      type: "Dynamic",
      layer: "Interface",
      connections: 6,
    },
    {
      id: "dyn-3",
      name: "OrderWorkflow",
      type: "Dynamic",
      layer: "Workflow",
      connections: 10,
    },
    {
      id: "dyn-4",
      name: "PaymentGateway",
      type: "Dynamic",
      layer: "External System",
      connections: 5,
    },
  ],
};

// Sample data for ontology visualization
const mockOntologyData = {
  nodes: [
    {
      id: "customer",
      label: "Customer",
      type: "entity",
      layer: "semantic",
      radius: 8,
    },
    {
      id: "order",
      label: "Order",
      type: "entity",
      layer: "semantic",
      radius: 8,
    },
    {
      id: "product",
      label: "Product",
      type: "entity",
      layer: "semantic",
      radius: 8,
    },
    {
      id: "payment",
      label: "Payment",
      type: "entity",
      layer: "semantic",
      radius: 8,
    },
    {
      id: "invoice",
      label: "Invoice",
      type: "entity",
      layer: "semantic",
      radius: 8,
    },
    {
      id: "customerRecord",
      label: "CustomerRecord",
      type: "entity",
      layer: "kinetic",
      radius: 7,
    },
    {
      id: "orderProcess",
      label: "OrderProcess",
      type: "process",
      layer: "kinetic",
      radius: 7,
    },
    {
      id: "productCatalog",
      label: "ProductCatalog",
      type: "entity",
      layer: "kinetic",
      radius: 7,
    },
    {
      id: "paymentProcessor",
      label: "PaymentProcessor",
      type: "service",
      layer: "kinetic",
      radius: 7,
    },
    {
      id: "invoiceGenerator",
      label: "InvoiceGenerator",
      type: "service",
      layer: "kinetic",
      radius: 7,
    },
    {
      id: "customerAPI",
      label: "CustomerAPI",
      type: "interface",
      layer: "dynamic",
      radius: 6,
    },
    {
      id: "orderAPI",
      label: "OrderAPI",
      type: "interface",
      layer: "dynamic",
      radius: 6,
    },
    {
      id: "productAPI",
      label: "ProductAPI",
      type: "interface",
      layer: "dynamic",
      radius: 6,
    },
    {
      id: "paymentGateway",
      label: "PaymentGateway",
      type: "external",
      layer: "dynamic",
      radius: 6,
    },
  ],
  links: [
    {
      source: "customer",
      target: "customerRecord",
      type: "implements",
      strength: 1,
    },
    {
      source: "customerRecord",
      target: "customerAPI",
      type: "exposes",
      strength: 1,
    },
    { source: "customer", target: "order", type: "places", strength: 0.7 },
    { source: "order", target: "orderProcess", type: "processes", strength: 1 },
    {
      source: "orderProcess",
      target: "orderAPI",
      type: "exposes",
      strength: 1,
    },
    { source: "order", target: "invoice", type: "generates", strength: 0.7 },
    {
      source: "invoice",
      target: "invoiceGenerator",
      type: "implements",
      strength: 1,
    },
    { source: "order", target: "product", type: "contains", strength: 0.5 },
    {
      source: "product",
      target: "productCatalog",
      type: "catalogs",
      strength: 1,
    },
    {
      source: "productCatalog",
      target: "productAPI",
      type: "exposes",
      strength: 1,
    },
    { source: "order", target: "payment", type: "requires", strength: 0.7 },
    {
      source: "payment",
      target: "paymentProcessor",
      type: "processes",
      strength: 1,
    },
    {
      source: "paymentProcessor",
      target: "paymentGateway",
      type: "connects",
      strength: 1,
    },
  ],
};

export default function OntologyPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "graph"
  const [collaborationEnabled, setCollaborationEnabled] = useState(true);

  // Filter entities based on search term
  const filteredEntities = {
    semantic: ontologyEntities.semantic.filter((entity) =>
      entity.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    kinetic: ontologyEntities.kinetic.filter((entity) =>
      entity.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    dynamic: ontologyEntities.dynamic.filter((entity) =>
      entity.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  };

  // Combined entities for "All" tab
  const allEntities = [
    ...filteredEntities.semantic,
    ...filteredEntities.kinetic,
    ...filteredEntities.dynamic,
  ];

  // Get active entities based on current tab
  const getActiveEntities = () => {
    switch (activeTab) {
      case "semantic":
        return filteredEntities.semantic;
      case "kinetic":
        return filteredEntities.kinetic;
      case "dynamic":
        return filteredEntities.dynamic;
      default:
        return allEntities;
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "semantic":
        return "Semantic Layer";
      case "kinetic":
        return "Kinetic Layer";
      case "dynamic":
        return "Dynamic Layer";
      case "all":
        return "All Entities";
      default:
        return "Ontology";
    }
  };

  const entityBadgeClass: Record<string, string> = {
    Semantic: "bg-primary/10 text-primary",
    Kinetic: "bg-chart-2/10 text-chart-2",
    Dynamic: "bg-chart-3/10 text-chart-3",
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-1 font-normal text-2xl">Ontology Manager</h1>
            <p className="text-muted-foreground">
              Manage and visualize your organizational knowledge graph
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="text-xs"
              onClick={() => setCollaborationEnabled(!collaborationEnabled)}
              size="sm"
              variant={collaborationEnabled ? "default" : "outline"}
            >
              <Users className="mr-1 h-4 w-4" />
              {collaborationEnabled ? "Collaboration On" : "Collaboration Off"}
            </Button>
            <Button
              className="border-muted px-4 font-light text-xs"
              variant="outline"
            >
              <Share2 className="mr-1 h-4 w-4" />
              SHARE
            </Button>
            <Button
              className="border-muted px-4 font-light text-xs"
              variant="outline"
            >
              <DownloadCloud className="mr-1 h-4 w-4" />
              EXPORT
            </Button>
            <Button className="px-4 font-light text-primary-foreground text-xs">
              <Plus className="mr-1 h-4 w-4" />
              NEW ENTITY
            </Button>
          </div>
        </div>

        <Tabs className="space-y-4" defaultValue="entities">
          <TabsList>
            <TabsTrigger value="entities">Entities</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-4" value="entities">
            <div className="flex flex-col gap-6 md:flex-row">
              {/* Sidebar */}
              <div className="w-full flex-shrink-0 md:w-64 lg:w-72">
                <Card className="border-border bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center font-normal text-base">
                      <Layers className="mr-2 h-5 w-5 text-primary" />
                      Ontology Layers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative mb-4">
                      <Input
                        className="border-muted bg-background pl-8 text-sm"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search entities..."
                        value={searchTerm}
                      />
                      <Search className="absolute top-3 left-2 h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="space-y-1">
                      <Button
                        className="h-9 w-full justify-start px-2 text-sm"
                        onClick={() => setActiveTab("all")}
                        variant={activeTab === "all" ? "default" : "ghost"}
                      >
                        <Network className="mr-2 h-4 w-4" />
                        All Entities
                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">
                          {allEntities.length}
                        </span>
                      </Button>

                      <Button
                        className="h-9 w-full justify-start px-2 text-sm"
                        onClick={() => setActiveTab("semantic")}
                        variant={activeTab === "semantic" ? "default" : "ghost"}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Semantic Layer
                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">
                          {filteredEntities.semantic.length}
                        </span>
                      </Button>

                      <Button
                        className="h-9 w-full justify-start px-2 text-sm"
                        onClick={() => setActiveTab("kinetic")}
                        variant={activeTab === "kinetic" ? "default" : "ghost"}
                      >
                        <Database className="mr-2 h-4 w-4" />
                        Kinetic Layer
                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">
                          {filteredEntities.kinetic.length}
                        </span>
                      </Button>

                      <Button
                        className="h-9 w-full justify-start px-2 text-sm"
                        onClick={() => setActiveTab("dynamic")}
                        variant={activeTab === "dynamic" ? "default" : "ghost"}
                      >
                        <Workflow className="mr-2 h-4 w-4" />
                        Dynamic Layer
                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">
                          {filteredEntities.dynamic.length}
                        </span>
                      </Button>
                    </div>

                    <div className="mt-4 border-border border-t pt-4">
                      <p className="mb-2 font-medium text-sm">Quick Filters</p>
                      <div className="space-y-1">
                        <Button
                          className="h-8 w-full justify-start px-2 text-sm"
                          variant="ghost"
                        >
                          <span className="mr-2 h-3 w-3 rounded-full bg-primary" />
                          Business Concepts
                        </Button>
                        <Button
                          className="h-8 w-full justify-start px-2 text-sm"
                          variant="ghost"
                        >
                          <span className="mr-2 h-3 w-3 rounded-full bg-chart-2" />
                          Domain Objects
                        </Button>
                        <Button
                          className="h-8 w-full justify-start px-2 text-sm"
                          variant="ghost"
                        >
                          <span className="mr-2 h-3 w-3 rounded-full bg-chart-3" />
                          Services
                        </Button>
                        <Button
                          className="h-8 w-full justify-start px-2 text-sm"
                          variant="ghost"
                        >
                          <span className="mr-2 h-3 w-3 rounded-full bg-chart-4" />
                          Interfaces
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main content */}
              <div className="flex-1">
                <Card className="border-border bg-card">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="font-normal text-base">
                      {getTabTitle(activeTab)}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button className="h-8 w-8" size="icon" variant="ghost">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Button className="h-8 w-8" size="icon" variant="ghost">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {getActiveEntities().map((entity) => (
                        <Card className="bg-background" key={entity.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{entity.name}</h3>
                                <p className="text-muted-foreground text-xs">
                                  {entity.layer}
                                </p>
                              </div>
                              <div
                                className={`rounded-full px-2 py-1 text-xs ${
                                  entityBadgeClass[entity.type] ??
                                  "bg-muted text-foreground"
                                }`}
                              >
                                {entity.type}
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between border-border border-t pt-3">
                              <span className="text-xs">
                                <span className="text-muted-foreground">
                                  Connections:
                                </span>{" "}
                                {entity.connections}
                              </span>
                              <Button
                                className="h-7 px-2 text-xs"
                                size="sm"
                                variant="ghost"
                              >
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {getActiveEntities().length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Search className="mb-4 h-12 w-12 text-muted-foreground opacity-20" />
                        <h3 className="mb-1 font-medium text-lg">
                          No entities found
                        </h3>
                        <p className="max-w-md text-center text-muted-foreground">
                          No ontology entities match your search criteria. Try
                          adjusting your filters or create a new entity.
                        </p>
                        <Button className="mt-4">
                          <Plus className="mr-1 h-4 w-4" />
                          Create New Entity
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visualization">
            {collaborationEnabled ? (
              <CollaborativeOntologyVisualizer
                data={mockOntologyData}
                height={600}
                projectId="enterprise-crm"
              />
            ) : (
              <OntologyVisualizer data={mockOntologyData} height={600} />
            )}

            <div className="mt-4 flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                {collaborationEnabled
                  ? "Collaborative mode: You can see other users' cursors and changes in real-time."
                  : "Solo mode: You're working alone. Enable collaboration to work with others."}
              </p>
              <Button
                onClick={() => setCollaborationEnabled(!collaborationEnabled)}
                size="sm"
                variant={collaborationEnabled ? "default" : "outline"}
              >
                <Users className="mr-1 h-4 w-4" />
                {collaborationEnabled
                  ? "Disable Collaboration"
                  : "Enable Collaboration"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Ontology Templates</CardTitle>
                <CardDescription>
                  Ready-to-use ontology patterns for common domains
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Card className="bg-background">
                    <CardContent className="p-4">
                      <h3 className="mb-1 font-medium">E-commerce Domain</h3>
                      <p className="mb-4 text-muted-foreground text-sm">
                        Includes customer, product, order, and payment entities
                        with standard relationships.
                      </p>
                      <Button size="sm" variant="outline">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-background">
                    <CardContent className="p-4">
                      <h3 className="mb-1 font-medium">Healthcare Domain</h3>
                      <p className="mb-4 text-muted-foreground text-sm">
                        Patient, provider, appointment, and medical record
                        entities with FHIR compliance.
                      </p>
                      <Button size="sm" variant="outline">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-background">
                    <CardContent className="p-4">
                      <h3 className="mb-1 font-medium">Financial Services</h3>
                      <p className="mb-4 text-muted-foreground text-sm">
                        Account, transaction, customer, and product entities
                        with financial relationships.
                      </p>
                      <Button size="sm" variant="outline">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Ontology Settings</CardTitle>
                <CardDescription>
                  Configure your ontology preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-1 font-medium text-sm">
                      Visualization Settings
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Default view mode</label>
                        <select className="rounded-md border border-border bg-background px-2 py-1">
                          <option>Graph</option>
                          <option>Grid</option>
                          <option>Tree</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Show relationships</label>
                        <input
                          className="h-4 w-4 rounded border-border bg-background"
                          defaultChecked
                          type="checkbox"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">
                          Real-time collaboration
                        </label>
                        <input
                          checked={collaborationEnabled}
                          className="h-4 w-4 rounded border-border bg-background"
                          onChange={(e) =>
                            setCollaborationEnabled(e.target.checked)
                          }
                          type="checkbox"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-1 font-medium text-sm">
                      System Integration
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Sync with codebase</label>
                        <input
                          className="h-4 w-4 rounded border-border bg-background"
                          defaultChecked
                          type="checkbox"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">
                          Generate TypeScript types
                        </label>
                        <input
                          className="h-4 w-4 rounded border-border bg-background"
                          defaultChecked
                          type="checkbox"
                        />
                      </div>
                    </div>
                  </div>

                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
