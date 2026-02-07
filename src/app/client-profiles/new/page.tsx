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
import type { Id } from "../../../../convex/_generated/dataModel";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "prospect", label: "Prospect" },
  { value: "inactive", label: "Inactive" },
];

const sizeOptions = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "enterprise", label: "Enterprise" },
];

export default function NewClientPage() {
  const router = useRouter();
  const createClient = useMutation(api.clientProfiles.createClientProfile);

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    size: "medium",
    location: "",
    description: "",
    website: "",
    status: "prospect",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      await createClient({
        name: formData.name,
        industry: formData.industry,
        size: formData.size,
        location: formData.location,
        description: formData.description || undefined,
        website: formData.website || undefined,
        status: formData.status as "active" | "prospect" | "inactive",
        tags,
        createdBy: "temp" as unknown as Id<"users">,
      });

      router.push("/client-profiles");
    } catch (error) {
      setErrorMessage("Failed to create client. Please try again.");
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
          <CardTitle>Create New Client Profile</CardTitle>
          <CardDescription>
            Add a new client to your research database
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage ? (
            <p className="mb-4 text-destructive text-sm" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Acme Corp"
                  required
                  value={formData.name}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Input
                  id="industry"
                  onChange={(e) => handleChange("industry", e.target.value)}
                  placeholder="Technology, Healthcare, Finance..."
                  required
                  value={formData.industry}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="San Francisco, CA"
                  required
                  value={formData.location}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                  value={formData.website}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Company Size</Label>
                <Select
                  onValueChange={(value) => handleChange("size", value)}
                  value={formData.size}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => handleChange("status", value)}
                  value={formData.status}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief description of the client..."
                rows={4}
                value={formData.description}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                onChange={(e) => handleChange("tags", e.target.value)}
                placeholder="Enter tags separated by commas (e.g., enterprise, b2b, saas)"
                value={formData.tags}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => router.push("/client-profiles")}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Creating..." : "Create Client"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
