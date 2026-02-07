"use client";

import { useQuery } from "convex/react";
import {
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Eye,
  History,
  Plus,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "../../../convex/_generated/api";

export function SkillVersions() {
  // Fetch all skill versions from Convex
  const versions = useQuery(api.skills.getAllSkillVersions, { limit: 20 });
  const isLoading = versions === undefined;

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / 1024 ** i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString();

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / 86_400_000);
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    if (days < 14) return "1 week ago";
    return `${Math.floor(days / 7)} weeks ago`;
  };

  return (
    <div className="space-y-6">
      {/* Version History Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">Skill Versions</h2>
          <p className="text-muted-foreground">
            Manage and track skill versions over time
          </p>
        </div>
        <Button>
          <History className="mr-2 h-4 w-4" />
          Version History
        </Button>
      </div>

      {/* Version Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Version Timeline</CardTitle>
          <CardDescription>Historical versions of your skills</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div className="flex items-start space-x-4" key={i}>
                  <Skeleton className="mt-1 h-4 w-4 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : versions.length === 0 ? (
            <EmptyState
              icon={History}
              title="No version history"
              description="Version history will appear here once skills are created and updated."
              variant="default"
            />
          ) : (
            <div className="space-y-6">
              {versions.map((version, index) => (
                <div className="relative" key={version._id}>
                  {/* Timeline line */}
                  {index < versions.length - 1 && (
                    <div className="absolute top-12 left-6 h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
                  )}

                  <div className="flex items-start space-x-4">
                    {/* Timeline dot */}
                    <div className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-blue-500" />

                    <div className="flex-1 space-y-3">
                      {/* Version Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className="font-mono text-lg" variant="outline">
                            v{version.version}
                          </Badge>
                          <span className="text-muted-foreground text-sm">
                            {version.skillName}
                          </span>
                          <Badge variant="secondary">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDate(version.createdAt)}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">
                            <Tag className="mr-1 h-3 w-3" />
                            {version.pageCount} pages
                          </Badge>
                          <Badge variant="secondary">
                            {formatFileSize(version.fileSize)}
                          </Badge>
                        </div>
                      </div>

                      {/* Changelog */}
                      <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                        <p className="text-sm">{version.changelog}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-xs">
                          {formatRelativeTime(version.createdAt)}
                        </div>
                        <div className="flex gap-2">
                          <Button asChild size="sm" variant="outline">
                            <a download href={version.downloadUrl}>
                              <Download className="mr-1 h-3 w-3" />
                              Download
                            </a>
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Version Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Version Comparison</CardTitle>
          <CardDescription>
            Compare different versions side by side
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div className="space-y-4" key={i}>
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : versions.length < 2 ? (
            <EmptyState
              icon={CheckCircle}
              title="Not enough versions"
              description="Create at least two versions of a skill to compare them."
              variant="compact"
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {versions.slice(0, 2).map((version) => (
                <div className="space-y-4" key={version._id}>
                  <div className="flex items-center space-x-2">
                    <Badge className="font-mono text-lg" variant="outline">
                      v{version.version}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      {formatRelativeTime(version.createdAt)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Skill</span>
                      <span className="font-medium">{version.skillName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pages</span>
                      <span className="font-medium">{version.pageCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Size</span>
                      <span className="font-medium">
                        {formatFileSize(version.fileSize)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5 className="mb-2 font-medium">Changelog</h5>
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
                      <p className="text-sm">{version.changelog}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Version Management */}
      <Card>
        <CardHeader>
          <CardTitle>Version Management</CardTitle>
          <CardDescription>Manage and deploy skill versions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-gray-50 dark:bg-gray-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Create Version</CardTitle>
                <CardDescription>
                  Build a new version from source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  New Version
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Rollback</CardTitle>
                <CardDescription>Revert to previous version</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <History className="mr-2 h-4 w-4" />
                  Rollback
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Deploy</CardTitle>
                <CardDescription>Deploy version to production</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Deploy
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
