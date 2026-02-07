"use client";

import {
  ArrowLeft,
  Book,
  Code,
  Download,
  FileText,
  HelpCircle,
  MessageSquare,
  Search,
  Star,
  Wrench as Tool,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { type SVGProps, useState } from "react";
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

const BarChart = (props: SVGProps<SVGSVGElement>) => (
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
    {...props}
  >
    <line x1="18" x2="18" y1="20" y2="10" />
    <line x1="12" x2="12" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="14" />
    <line x1="3" x2="21" y1="20" y2="20" />
  </svg>
);

const agentTemplates = [
  {
    id: 1,
    name: "Documentation Assistant",
    description: "Helps users navigate and understand project documentation",
    category: "Knowledge Base",
    icon: <Book className="h-5 w-5 text-primary" />,
    popularity: 4.8,
    installations: 1240,
    author: "Dria Team",
    features: ["Documentation search", "Code examples", "Step-by-step guides"],
  },
  {
    id: 2,
    name: "Code Helper",
    description: "Assists with coding tasks, debugging, and best practices",
    category: "Development",
    icon: <Code className="h-5 w-5 text-primary" />,
    popularity: 4.7,
    installations: 895,
    author: "Dria Team",
    features: ["Code generation", "Debugging assistance", "Language support"],
  },
  {
    id: 3,
    name: "Technical Support",
    description: "Provides technical support and troubleshooting assistance",
    category: "Support",
    icon: <HelpCircle className="h-5 w-5 text-primary" />,
    popularity: 4.9,
    installations: 1650,
    author: "Dria Team",
    features: [
      "Error diagnostics",
      "Guided troubleshooting",
      "System information",
    ],
  },
  {
    id: 4,
    name: "API Reference",
    description: "Specialized in API documentation and usage examples",
    category: "Development",
    icon: <FileText className="h-5 w-5 text-primary" />,
    popularity: 4.6,
    installations: 720,
    author: "Dria Team",
    features: ["API endpoints", "Parameter descriptions", "Response examples"],
  },
  {
    id: 5,
    name: "Data Analyst",
    description: "Helps with data analysis, visualization, and insights",
    category: "Data",
    icon: <BarChart className="h-5 w-5 text-primary" />,
    popularity: 4.5,
    installations: 680,
    author: "Community",
    features: ["Data processing", "Chart generation", "Statistical analysis"],
  },
  {
    id: 6,
    name: "Tool Integration Assistant",
    description:
      "Helps integrate external tools and services with your project",
    category: "Development",
    icon: <Tool className="h-5 w-5 text-primary" />,
    popularity: 4.4,
    installations: 570,
    author: "Community",
    features: [
      "API integration",
      "Authentication setup",
      "Webhook configuration",
    ],
  },
];

export default function AgentLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Knowledge Base",
    "Development",
    "Support",
    "Data",
  ];

  const filteredAgents = agentTemplates.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || agent.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
            <h1 className="font-light text-2xl">Agent Library</h1>
          </div>

          <div className="relative flex-1 md:w-64">
            <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
            <Input
              className="bg-background pl-8"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              value={searchQuery}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              className={
                selectedCategory === category ? "bg-primary text-black" : ""
              }
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <Card
              className="overflow-hidden border-border bg-card"
              key={agent.id}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="rounded-md bg-primary/10 p-2">
                    {agent.icon}
                  </div>
                  <div className="flex items-center text-amber-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-sm">{agent.popularity}</span>
                  </div>
                </div>
                <CardTitle className="mt-2">{agent.name}</CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="text-muted-foreground text-xs">Features</div>
                <ul className="mt-1 space-y-1">
                  {agent.features.map((feature) => (
                    <li
                      className="flex items-center text-sm"
                      key={`${agent.id}-${feature}`}
                    >
                      <Zap className="mr-1.5 h-3 w-3 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">
                    By <span className="text-foreground">{agent.author}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Download className="mr-1 h-3 w-3" />
                    {agent.installations.toLocaleString()}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button className="w-full bg-primary text-black hover:bg-primary/90">
                  Use Template
                </Button>
              </CardFooter>
            </Card>
          ))}

          {filteredAgents.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="font-medium text-lg">No agents found</h3>
              <p className="text-muted-foreground">
                No agent templates match your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
