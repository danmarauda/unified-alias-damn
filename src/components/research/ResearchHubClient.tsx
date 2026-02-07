"use client";

import { useMutation, useQuery } from "convex/react";
import {
  BarChart3,
  Database,
  Edit,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "../../../convex/_generated/api";

import type { Id } from "../../../convex/_generated/dataModel";

interface ResearchItem {
  _id: Id<"clientResearch">;
  _creationTime: number;
  title: string;
  summary: string;
  findings: string;
  status: "draft" | "awaiting_approval" | "approved" | "published";
  tags: string[];
  updatedAt: number;
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "industry-analysis", label: "Industry Analysis" },
  { value: "competitive-intelligence", label: "Competitive Intelligence" },
  { value: "market-research", label: "Market Research" },
  { value: "trend-analysis", label: "Trend Analysis" },
  { value: "whitepaper", label: "Whitepaper" },
];

const statuses = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "review", label: "In Review" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "review":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-blue-100 text-blue-800";
    case "published":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "high":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "industry-analysis":
      return <FileText className="h-5 w-5" />;
    case "competitive-intelligence":
      return <BarChart3 className="h-5 w-5" />;
    case "market-research":
      return <TrendingUp className="h-5 w-5" />;
    case "trend-analysis":
      return <TrendingUp className="h-5 w-5" />;
    case "whitepaper":
      return <FileText className="h-5 w-5" />;
    default:
      return <Database className="h-5 w-5" />;
  }
};

export function ResearchHubClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Fetch research data from Convex
  const researchItems = useQuery(api.clientResearch.getAllResearch, {
    status:
      selectedStatus !== "all"
        ? (selectedStatus as
            | "draft"
            | "awaiting_approval"
            | "approved"
            | "published")
        : undefined,
    limit: 50,
  });

  const createResearch = useMutation(api.clientResearch.createResearch);
  const deleteResearch = useMutation(api.clientResearch.deleteResearch);

  const filteredItems =
    researchItems?.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;

      return matchesSearch && matchesStatus;
    }) || [];

  const handleNewResearch = () => {
    router.push("/research-hub/new");
  };

  const handleViewResearch = (id: string) => {
    router.push(`/research-hub/${id}`);
  };

  const handleEditResearch = (id: string) => {
    router.push(`/research-hub/${id}/edit`);
  };

  const handleDeleteResearch = async (id: Id<"clientResearch">) => {
    if (confirm("Are you sure you want to delete this research item?")) {
      try {
        await deleteResearch({ id });
      } catch (error) {
        console.error("Failed to delete research:", error);
        alert("Failed to delete research item. Please try again.");
      }
    }
  };

  const handleCreateSampleResearch = async () => {
    try {
      await createResearch({
        title: "Sample Industry Analysis",
        category: "industry-analysis",
        description:
          "This is a sample research item to demonstrate the functionality.",
        status: "draft",
        priority: "medium",
      });
    } catch (error) {
      console.error("Failed to create sample research:", error);
      alert("Failed to create sample research. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-semibold text-2xl text-gray-900 dark:text-white">
            Research Hub
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage and access all research resources and client insights
          </p>
        </div>
        <Button onClick={handleNewResearch}>
          <Plus className="mr-2 h-4 w-4" />
          New Research
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
          <Input
            className="pl-9"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search research..."
            value={searchTerm}
          />
        </div>

        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedStatus} value={selectedStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {researchItems ? (
        filteredItems.length === 0 ? (
          <div className="py-12 text-center">
            <Database className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-white">
              No research found
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {searchTerm ||
              selectedCategory !== "all" ||
              selectedStatus !== "all"
                ? "Try adjusting your search criteria or filters."
                : "Get started by creating your first research item."}
            </p>
            <div className="space-x-4">
              <Button onClick={handleCreateSampleResearch} variant="outline">
                Create Sample Research
              </Button>
              <Button onClick={handleNewResearch}>
                <Plus className="mr-2 h-4 w-4" />
                New Research
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card
                className="transition-shadow hover:shadow-lg"
                key={item._id}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                        <Database className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="line-clamp-2 text-base">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Updated{" "}
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-3">
                  <p className="line-clamp-3 text-gray-600 text-sm dark:text-gray-400">
                    {item.summary}
                  </p>
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          className="text-xs"
                          key={index}
                          variant="outline"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge className="text-xs" variant="outline">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex justify-between border-t pt-3">
                  <Button
                    onClick={() => handleViewResearch(item._id)}
                    size="sm"
                    variant="outline"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </Button>
                  <div className="space-x-2">
                    <Button
                      onClick={() => handleEditResearch(item._id)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteResearch(item._id)}
                      size="sm"
                      variant="outline"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              className="animate-pulse rounded-lg border bg-white p-5 dark:bg-gray-800"
              key={i}
            >
              <div className="mb-4 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mb-6 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
