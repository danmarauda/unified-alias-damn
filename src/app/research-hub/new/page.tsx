"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "../../../../convex/_generated/api";

const categories = [
  { value: "industry-analysis", label: "Industry Analysis" },
  { value: "competitive-intelligence", label: "Competitive Intelligence" },
  { value: "market-research", label: "Market Research" },
  { value: "trend-analysis", label: "Trend Analysis" },
  { value: "whitepaper", label: "Whitepaper" },
];

const statuses = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "In Review" },
  { value: "approved", label: "Approved" },
  { value: "published", label: "Published" },
];

const priorities = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
];

export default function NewResearchPage() {
  const router = useRouter();
  const createResearch = useMutation(api.clientResearch.createResearch);

  const [formData, setFormData] = useState({
    title: "",
    category: "industry-analysis",
    description: "",
    status: "draft",
    priority: "medium",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      await createResearch({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        status: formData.status as
          | "draft"
          | "review"
          | "approved"
          | "published",
        priority: formData.priority as "low" | "medium" | "high",
      });

      router.push("/research-hub");
    } catch (error) {
      console.error("Failed to create research:", error);
      alert("Failed to create research. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Research</CardTitle>
          <CardDescription>
            Add a new research item to your research hub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter research title"
                required
                value={formData.title}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  onValueChange={(value) => handleChange("category", value)}
                  value={formData.category}
                >
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  onValueChange={(value) => handleChange("status", value)}
                  value={formData.status}
                >
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

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  onValueChange={(value) => handleChange("priority", value)}
                  value={formData.priority}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter detailed description of the research..."
                required
                rows={6}
                value={formData.description}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                onChange={(e) => handleChange("tags", e.target.value)}
                placeholder="Enter tags separated by commas (e.g., AI, healthcare, trends)"
                value={formData.tags}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => router.push("/research-hub")}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Creating..." : "Create Research"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
