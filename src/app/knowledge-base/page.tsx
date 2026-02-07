"use client";

import {
  Book,
  Bookmark,
  Brain,
  Clock,
  Code,
  Database,
  Download,
  Eye,
  EyeOff,
  FileText,
  Filter,
  MoveUp,
  RefreshCw,
  Search,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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

// Mock knowledge base articles
const knowledgeArticles = [
  {
    id: 1,
    title: "Getting Started with ALIAS AEOS",
    description:
      "Learn the basics of the ALIAS Agentic Enterprise Operating System and how to set up your first project.",
    category: "Documentation",
    tags: ["beginner", "setup", "overview"],
    author: "ALIAS Team",
    dateUpdated: "May 15, 2025",
    views: 1243,
    type: "guide",
  },
  {
    id: 2,
    title: "Ontology-Driven Development Principles",
    description:
      "Deep dive into how ontology drives the development process in MOSAIC projects.",
    category: "Best Practices",
    tags: ["ontology", "methodology", "advanced"],
    author: "Dr. Sarah Chen",
    dateUpdated: "May 12, 2025",
    views: 892,
    type: "article",
  },
  {
    id: 3,
    title: "Setting Up AI Agents for Project Requirements",
    description:
      "How to configure and deploy AI agents to capture and process project requirements.",
    category: "Tutorials",
    tags: ["ai", "agents", "requirements"],
    author: "Michael Rodriguez",
    dateUpdated: "May 10, 2025",
    views: 756,
    type: "tutorial",
  },
  {
    id: 4,
    title: "Semantic Layer Design Patterns",
    description:
      "Best practices for designing the semantic layer of your ontology for different domains.",
    category: "Best Practices",
    tags: ["semantic", "ontology", "design"],
    author: "Lisa Johnson",
    dateUpdated: "May 8, 2025",
    views: 624,
    type: "article",
  },
  {
    id: 5,
    title: "MOSAIC CI/CD Pipeline Configuration",
    description:
      "Set up continuous integration and deployment pipelines optimized for MOSAIC projects.",
    category: "Tutorials",
    tags: ["devops", "ci-cd", "automation"],
    author: "David Park",
    dateUpdated: "May 5, 2025",
    views: 583,
    type: "tutorial",
  },
  {
    id: 6,
    title: "Agent-Driven Code Generation Best Practices",
    description:
      "Guidelines for effective use of AI agents in generating and reviewing code.",
    category: "Best Practices",
    tags: ["ai", "code-generation", "quality"],
    author: "Alex Mercer",
    dateUpdated: "May 1, 2025",
    views: 921,
    type: "guide",
  },
  {
    id: 7,
    title: "ALIAS AEOS Architecture Overview",
    description:
      "Technical architecture of the AEOS framework and its core components.",
    category: "Documentation",
    tags: ["architecture", "technical", "advanced"],
    author: "ALIAS Team",
    dateUpdated: "April 28, 2025",
    views: 1105,
    type: "technical",
  },
  {
    id: 8,
    title: "Integrating External APIs with Ontology Models",
    description:
      "How to connect external APIs with your ontology-driven data models.",
    category: "Tutorials",
    tags: ["integration", "api", "data-models"],
    author: "Samantha Wu",
    dateUpdated: "April 25, 2025",
    views: 674,
    type: "tutorial",
  },
];

// Mock categories with counts
const categories = [
  { name: "Documentation", count: 15 },
  { name: "Tutorials", count: 23 },
  { name: "Best Practices", count: 18 },
  { name: "Case Studies", count: 7 },
  { name: "API Reference", count: 12 },
  { name: "Release Notes", count: 6 },
];

// Mock popular tags
const popularTags = [
  { name: "ontology", count: 42 },
  { name: "ai", count: 38 },
  { name: "agents", count: 25 },
  { name: "integration", count: 19 },
  { name: "architecture", count: 16 },
  { name: "best-practices", count: 15 },
  { name: "automation", count: 14 },
  { name: "tutorial", count: 13 },
];

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter articles based on search query and active tab
  const filteredArticles = knowledgeArticles.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "docs" && article.category === "Documentation") ||
      (activeTab === "tutorials" && article.category === "Tutorials") ||
      (activeTab === "best-practices" && article.category === "Best Practices");

    return matchesSearch && matchesTab;
  });

  // Get icon for article type
  const getArticleTypeIcon = (type: string) => {
    switch (type) {
      case "guide":
        return <Book className="h-4 w-4" />;
      case "tutorial":
        return <Code className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
      case "technical":
        return <Database className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActiveTabTitle = (tab: string) => {
    switch (tab) {
      case "docs":
        return "Documentation";
      case "tutorials":
        return "Tutorials";
      case "best-practices":
        return "Best Practices";
      case "all":
        return "All Articles";
      default:
        return "Knowledge Articles";
    }
  };

  const getArticleBadgeClass = (type: string) => {
    switch (type) {
      case "guide":
        return "bg-primary/10 text-primary";
      case "tutorial":
        return "bg-chart-2/10 text-chart-2";
      case "article":
        return "bg-chart-3/10 text-chart-3";
      default:
        return "bg-chart-4/10 text-chart-4";
    }
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-1 font-normal text-2xl">Knowledge Base</h1>
            <p className="text-muted-foreground">
              Explore documentation, tutorials, and best practices for ALIAS
              AEOS
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Input
                className="w-[250px] border-muted bg-background pl-8 md:w-[350px]"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge base..."
                value={searchQuery}
              />
              <Search className="absolute top-3 left-2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button className="border-muted" variant="outline">
              <Filter className="mr-1 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sidebar */}
          <div className="w-full flex-shrink-0 space-y-6 md:w-64 lg:w-72">
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center font-normal text-base">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-1">
                  <Button
                    className="h-9 w-full justify-start px-2 text-sm"
                    onClick={() => setActiveTab("all")}
                    variant={activeTab === "all" ? "default" : "ghost"}
                  >
                    All Articles
                    <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">
                      {knowledgeArticles.length}
                    </span>
                  </Button>

                  {categories.map((category) => (
                    <Button
                      className="h-9 w-full justify-start px-2 text-sm"
                      key={category.name}
                      onClick={() =>
                        setActiveTab(
                          category.name.toLowerCase().replace(" ", "-"),
                        )
                      }
                      variant={
                        activeTab ===
                        category.name.toLowerCase().replace(" ", "-")
                          ? "default"
                          : "ghost"
                      }
                    >
                      {category.name}
                      <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs">
                        {category.count}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center font-normal text-base">
                  <Tag className="mr-2 h-5 w-5 text-primary" />
                  Popular Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      className="flex items-center rounded-full bg-secondary px-2 py-1 text-xs hover:bg-secondary/80"
                      key={tag.name}
                      onClick={() => setSearchQuery(tag.name)}
                    >
                      {tag.name}
                      <span className="ml-1 text-muted-foreground">
                        ({tag.count})
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center font-normal text-base">
                  <MoveUp className="mr-2 h-5 w-5 text-primary" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <Link
                    className="flex items-center transition-colors hover:text-primary"
                    href="#"
                  >
                    <Brain className="mr-2 h-4 w-4 text-muted-foreground" />
                    AI Agent Documentation
                  </Link>
                  <Link
                    className="flex items-center transition-colors hover:text-primary"
                    href="#"
                  >
                    <Database className="mr-2 h-4 w-4 text-muted-foreground" />
                    Ontology Design Guide
                  </Link>
                  <Link
                    className="flex items-center transition-colors hover:text-primary"
                    href="#"
                  >
                    <RefreshCw className="mr-2 h-4 w-4 text-muted-foreground" />
                    Latest Updates
                  </Link>
                  <Link
                    className="flex items-center transition-colors hover:text-primary"
                    href="#"
                  >
                    <Download className="mr-2 h-4 w-4 text-muted-foreground" />
                    Download Resources
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-normal text-base">
                  {getActiveTabTitle(activeTab)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button className="h-8 text-xs" size="sm" variant="ghost">
                    <Eye className="mr-1 h-4 w-4" />
                    Most Viewed
                  </Button>
                  <Button className="h-8 text-xs" size="sm" variant="ghost">
                    <Clock className="mr-1 h-4 w-4" />
                    Recent
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredArticles.map((article) => (
                    <Card
                      className="bg-background transition-colors hover:border-primary/50"
                      key={article.id}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-2">
                          <div
                            className={`rounded-md p-2 ${getArticleBadgeClass(
                              article.type,
                            )}`}
                          >
                            {getArticleTypeIcon(article.type)}
                          </div>

                          <div className="flex-1">
                            <h3 className="mb-1 font-medium">
                              {article.title}
                            </h3>
                            <p className="mb-2 line-clamp-2 text-muted-foreground text-xs">
                              {article.description}
                            </p>

                            <div className="mb-2 flex flex-wrap gap-1">
                              {article.tags.map((tag) => (
                                <span
                                  className="rounded-sm bg-secondary px-1.5 py-0.5 text-xs"
                                  key={tag}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-muted-foreground text-xs">
                              <div className="flex items-center">
                                <span>{article.author}</span>
                                <span className="mx-2">•</span>
                                <span>{article.dateUpdated}</span>
                              </div>
                              <div className="flex items-center">
                                <Eye className="mr-1 h-3 w-3" />
                                {article.views}
                              </div>
                            </div>
                          </div>

                          <Button
                            className="h-8 w-8 flex-shrink-0"
                            size="icon"
                            variant="ghost"
                          >
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <EyeOff className="mb-4 h-12 w-12 text-muted-foreground opacity-20" />
                    <h3 className="mb-1 font-medium text-lg">
                      No articles found
                    </h3>
                    <p className="max-w-md text-center text-muted-foreground">
                      No articles match your search criteria. Try adjusting your
                      search terms or filters.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveTab("all");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center border-border border-t py-4">
                <Button className="border-muted" variant="outline">
                  Load More Articles
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
