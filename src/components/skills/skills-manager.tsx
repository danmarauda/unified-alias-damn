"use client";

import { useQuery } from "convex/react";
import {
  CheckCircle,
  Clock,
  Copy,
  Download,
  Edit,
  Play,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "../../../convex/_generated/api";

type SkillsManagerProps = {};

interface Skill {
  _id: string;
  _creationTime: number;
  name: string;
  description: string;
  version: string;
  category: string;
  tags: string[];
  status: "draft" | "scraping" | "processing" | "ready" | "error";
  metadata?: {
    pageCount?: number;
    fileSize?: number;
    lastScraped?: number;
    errorMessage?: string;
  };
  isActive: boolean;
  downloadUrl?: string;
  createdAt: number;
}

const SKILL_CATEGORIES = [
  { value: "frontend", label: "Frontend", color: "bg-blue-500" },
  { value: "backend", label: "Backend", color: "bg-green-500" },
  { value: "fullstack", label: "Full Stack", color: "bg-purple-500" },
  { value: "devops", label: "DevOps", color: "bg-orange-500" },
  { value: "ai-ml", label: "AI/ML", color: "bg-red-500" },
  { value: "mobile", label: "Mobile", color: "bg-indigo-500" },
  { value: "database", label: "Database", color: "bg-yellow-500" },
  { value: "framework", label: "Framework", color: "bg-pink-500" },
  { value: "library", label: "Library", color: "bg-cyan-500" },
  { value: "tool", label: "Tool", color: "bg-gray-500" },
];

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-800",
  scraping: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
};

const STATUS_ICONS = {
  draft: Clock,
  scraping: Play,
  processing: Play,
  ready: CheckCircle,
  error: XCircle,
};

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Convex queries
  const skillData = useQuery(api.skills.listSkills, {
    paginationOpts: { numItems: 50, cursor: null },
    category: selectedCategory || undefined,
    status: (selectedStatus as any) || undefined,
    search: searchQuery || undefined,
  });

  const categories = useQuery(api.skills.getSkillCategories);
  const activeJobs = useQuery(api.skills.getActiveScrapingJobs);

  useEffect(() => {
    if (skillData) {
      setSkills(skillData.page);
      setIsLoading(false);
    }
  }, [skillData]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / 1024 ** i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Never";
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Active Jobs */}
      {activeJobs && activeJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Scraping Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeJobs.map((job) => (
              <div className="flex items-center justify-between" key={job._id}>
                <div className="flex items-center space-x-3">
                  <Play className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Processing skill...</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Progress className="w-32" value={job.progress.percentage} />
                  <span className="text-muted-foreground text-sm">
                    {job.progress.currentPage} / {job.progress.totalPages}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[200px] flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
                <Input
                  className="pl-10"
                  id="search"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills..."
                  value={searchQuery}
                />
              </div>
            </div>
            <div className="min-w-[150px]">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={setSelectedCategory}
                value={selectedCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {SKILL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[150px]">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scraping">Scraping</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Grid */}
      {isLoading ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Loading skills...</p>
        </div>
      ) : skills.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-muted-foreground">No skills found</p>
            <Button>Create your first skill</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => {
            const StatusIcon = STATUS_ICONS[skill.status];
            const categoryColor =
              SKILL_CATEGORIES.find((cat) => cat.value === skill.category)
                ?.color || "bg-gray-500";

            return (
              <Card
                className="transition-shadow hover:shadow-lg"
                key={skill._id}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1 text-lg">
                        {skill.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {skill.description}
                      </CardDescription>
                    </div>
                    <div
                      className={`h-3 w-3 rounded-full ${categoryColor} ml-3`}
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      className={STATUS_COLORS[skill.status]}
                      variant="secondary"
                    >
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {skill.status}
                    </Badge>
                    <Badge variant="outline">v{skill.version}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Tags */}
                  {skill.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {skill.tags.slice(0, 3).map((tag) => (
                        <Badge
                          className="text-xs"
                          key={tag}
                          variant="secondary"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {skill.tags.length > 3 && (
                        <Badge className="text-xs" variant="secondary">
                          +{skill.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="space-y-1 text-muted-foreground text-sm">
                    {skill.metadata?.pageCount &&
                      skill.metadata.pageCount > 0 && (
                        <div className="flex items-center">
                          <Copy className="mr-1 h-3 w-3" />
                          {skill.metadata.pageCount} pages
                        </div>
                      )}
                    {skill.metadata?.fileSize &&
                      skill.metadata.fileSize > 0 && (
                        <div className="flex items-center">
                          <Copy className="mr-1 h-3 w-3" />
                          {formatFileSize(skill.metadata.fileSize)}
                        </div>
                      )}
                    {skill.metadata?.lastScraped &&
                      skill.metadata.lastScraped > 0 && (
                        <div className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          Last scraped: {formatDate(skill.metadata.lastScraped)}
                        </div>
                      )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-1">
                      {skill.status === "draft" && (
                        <Button
                          onClick={() =>
                            console.log("Start scraping:", skill._id)
                          }
                          size="sm"
                          variant="outline"
                        >
                          <Play className="mr-1 h-3 w-3" />
                          Start
                        </Button>
                      )}
                      {skill.downloadUrl && (
                        <Button asChild size="sm" variant="outline">
                          <a download href={skill.downloadUrl}>
                            <Download className="mr-1 h-3 w-3" />
                            Download
                          </a>
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => console.log("Edit skill:", skill._id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        className="text-red-600 hover:text-red-700"
                        onClick={() => console.log("Delete skill:", skill._id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
