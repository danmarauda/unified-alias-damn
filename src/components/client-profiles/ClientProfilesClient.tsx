"use client";

import { useQuery } from "convex/react";
import { Filter, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "../../../convex/_generated/api";
import { ClientCard } from "./client-card";

// Interface matching the actual Convex schema for clientProfiles
interface ClientProfile {
  _id: string;
  _creationTime: number;
  name: string;
  industry: string;
  size: string;
  location: string;
  description?: string;
  website?: string;
  status: "active" | "prospect" | "inactive";
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export function ClientProfilesClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Fetch client profiles from Convex
  const clients = useQuery(api.clientProfiles.getAllClients, {
    search: searchTerm || undefined,
    limit: 50,
  });

  const filteredClients =
    clients?.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.location.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const handleNewProfile = () => {
    router.push("/client-profiles/new");
  };

  const handleClientClick = (clientId: string) => {
    router.push(`/client-profiles/${clientId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-semibold text-2xl text-gray-900 dark:text-white">
              Client Profiles
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage and view client information
            </p>
          </div>
          <Button onClick={handleNewProfile}>
            <Plus className="mr-2 h-4 w-4" />
            New Profile
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
            <Input
              className="pl-9"
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clients..."
              value={searchTerm}
            />
          </div>
          <Button className="sm:w-auto" variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {clients ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.length > 0 ? (
              filteredClients.map((client: ClientProfile) => (
                <ClientCard
                  client={{
                    _id: client._id,
                    name: client.name,
                    industry: client.industry,
                    status: client.status,
                    riskLevel: "medium",
                    lastUpdate: new Date(client.updatedAt).toLocaleDateString(),
                    engagementScore:
                      client.status === "active"
                        ? 85
                        : client.status === "prospect"
                          ? 65
                          : 45,
                  }}
                  key={client._id}
                  onClick={() => handleClientClick(client._id)}
                />
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No clients found matching your search criteria.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                className="animate-pulse rounded-lg border bg-white p-5 dark:bg-gray-800"
                key={i}
              >
                <div className="mb-4 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mb-6 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="h-16 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-16 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
