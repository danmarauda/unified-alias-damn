"use client";

import { useMutation, useQuery } from "convex/react";
import { Building, Calendar, Edit, Globe, MapPin, Save, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
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

type ClientStatus = "active" | "prospect" | "inactive";
type ClientFormState = {
  name: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  website: string;
  status: ClientStatus;
};

const statusOptions = [
  { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
  { value: "prospect", label: "Prospect", color: "bg-blue-100 text-blue-800" },
  { value: "inactive", label: "Inactive", color: "bg-gray-100 text-gray-800" },
];

const sizeOptions = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "enterprise", label: "Enterprise" },
];

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const client = useQuery(api.clientProfiles.getClientById, {
    clientId: clientId as unknown as Id<"clientProfiles">,
  });
  const updateClient = useMutation(api.clientProfiles.updateClientProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ClientFormState>({
    name: "",
    industry: "",
    size: "medium",
    location: "",
    description: "",
    website: "",
    status: "prospect",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        industry: client.industry,
        size: client.size,
        location: client.location,
        description: client.description || "",
        website: client.website || "",
        status: client.status,
      });
    }
  }, [client]);

  if (!client) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Client not found
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async () => {
    setErrorMessage(null);
    try {
      await updateClient({
        clientId: clientId as unknown as Id<"clientProfiles">,
        name: formData.name,
        industry: formData.industry,
        size: formData.size,
        location: formData.location,
        description: formData.description || undefined,
        website: formData.website || undefined,
        status: formData.status,
      });
      setIsEditing(false);
    } catch (error) {
      setErrorMessage("Failed to update client. Please try again.");
    }
  };

  const handleChange = <Field extends keyof ClientFormState>(
    field: Field,
    value: ClientFormState[Field],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getStatusBadgeColor = (status: string) => {
    const option = statusOptions.find((s) => s.value === status);
    return option?.color || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl">Client Profile</h1>
        <div className="space-x-2">
          {isEditing ? (
            <>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleSave}
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{client.name}</CardTitle>
              <CardDescription>{client.industry}</CardDescription>
            </div>
            <Badge className={getStatusBadgeColor(client.status)}>
              {statusOptions.find((s) => s.value === client.status)?.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {errorMessage ? (
            <p className="text-destructive text-sm" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-muted-foreground text-xs">
                    Location
                  </Label>
                  {isEditing ? (
                    <Input
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="City, Country"
                      value={formData.location}
                    />
                  ) : (
                    <p className="font-medium">{client.location}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-muted-foreground text-xs">
                    Website
                  </Label>
                  {isEditing ? (
                    <Input
                      onChange={(e) => handleChange("website", e.target.value)}
                      placeholder="https://example.com"
                      value={formData.website}
                    />
                  ) : (
                    <p className="font-medium">
                      {client.website || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-muted-foreground text-xs">
                    Industry
                  </Label>
                  {isEditing ? (
                    <Input
                      onChange={(e) => handleChange("industry", e.target.value)}
                      placeholder="Technology, Healthcare..."
                      value={formData.industry}
                    />
                  ) : (
                    <p className="font-medium">{client.industry}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label className="text-muted-foreground text-xs">
                    Last Updated
                  </Label>
                  <p className="font-medium">
                    {new Date(client.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">
                  Company Size
                </Label>
                {isEditing ? (
                  <Select
                    onValueChange={(value) => handleChange("size", value)}
                    value={formData.size}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline">
                    {sizeOptions.find((s) => s.value === client.size)?.label}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Status</Label>
                {isEditing ? (
                  <Select
                    onValueChange={(value) =>
                      handleChange("status", value as ClientStatus)
                    }
                    value={formData.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={getStatusBadgeColor(client.status)}>
                    {
                      statusOptions.find((s) => s.value === client.status)
                        ?.label
                    }
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">Description</Label>
            {isEditing ? (
              <Textarea
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Description of the client..."
                rows={4}
                value={formData.description}
              />
            ) : (
              <p className="text-muted-foreground text-sm">
                {client.description || "No description available"}
              </p>
            )}
          </div>

          {client.tags && client.tags.length > 0 && (
            <div className="space-y-2">
              <Label className="font-medium text-sm">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {client.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
