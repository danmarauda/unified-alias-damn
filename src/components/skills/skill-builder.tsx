"use client";

import { useMutation, useQuery } from "convex/react";
import { ExternalLink, Play, Square } from "lucide-react";
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
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

interface SkillBuilderProps {
  skillId?: Id<"skills">;
}

interface ScrapingProgress {
  currentPage: number;
  totalPages: number;
  percentage: number;
}

export function SkillBuilder({ skillId }: SkillBuilderProps) {
  const [isScraping, setIsScraping] = useState(false);
  const [progress, setProgress] = useState<ScrapingProgress>({
    currentPage: 0,
    totalPages: 0,
    percentage: 0,
  });
  const [logOutput, setLogOutput] = useState<string[]>([]);
  const [config, setConfig] = useState({
    sourceUrl: "",
    maxPages: 100,
    selectors: {
      content: "article, .content, .docs-content",
      links: "a[href]",
      code: "pre, code",
    },
    aiEnhancement: true,
    includeCode: true,
  });

  // Convex queries
  const skill = useQuery(
    api.skills.getSkill,
    skillId ? { id: skillId } : "skip",
  );
  const activeJobs = useQuery(api.skills.getActiveScrapingJobs);

  // Convex mutations
  const startScraping = useMutation(api.skills_mutations.startScrapingJob);
  const updateJobProgress = useMutation(
    api.skills_mutations.updateScrapingJobProgress,
  );

  useEffect(() => {
    if (skill) {
      setConfig({
        sourceUrl: skill.config.sourceUrl,
        maxPages: skill.config.maxPages || 100,
        selectors: {
          content:
            skill.config.selectors?.content ??
            "article, .content, .docs-content",
          links: skill.config.selectors?.links ?? "a[href]",
          code: skill.config.selectors?.code ?? "pre, code",
        },
        aiEnhancement: skill.config.aiEnhancement ?? true,
        includeCode: skill.config.includeCode ?? true,
      });
    }
  }, [skill]);

  const handleStartScraping = async () => {
    if (!skillId) return;

    setIsScraping(true);
    setLogOutput([]);

    try {
      const { jobId } = await startScraping({ skillId });
      addLogEntry("Scraping job started successfully");

      // Simulate progress updates (in real implementation, this would be via WebSocket or polling)
      simulateProgress(jobId);
    } catch (error) {
      addLogEntry(`Error starting scraping: ${error}`, "error");
      setIsScraping(false);
    }
  };

  const simulateProgress = (jobId: Id<"skillScrapingJobs">) => {
    let currentPage = 0;
    const totalPages = Math.floor(Math.random() * 50) + 20; // Random between 20-70 pages

    const interval = setInterval(async () => {
      currentPage += Math.floor(Math.random() * 3) + 1;
      const percentage = Math.min((currentPage / totalPages) * 100, 100);

      setProgress({
        currentPage,
        totalPages,
        percentage,
      });

      addLogEntry(`Scraped page ${currentPage} of ${totalPages}`);

      if (currentPage >= totalPages) {
        clearInterval(interval);
        setIsScraping(false);
        addLogEntry("Scraping completed successfully!", "success");

        // Update job as completed
        await updateJobProgress({
          jobId,
          progress: { currentPage: totalPages, totalPages, percentage: 100 },
          status: "completed",
          results: {
            pagesScraped: totalPages,
            filesGenerated: Math.floor(totalPages / 3),
            downloadUrl: `/api/skills/download/${skillId}`,
          },
        });
      }
    }, 2000); // Update every 2 seconds
  };

  const addLogEntry = (
    message: string,
    type: "info" | "error" | "success" | "warning" = "info",
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    const icon = type === "error" ? "❌" : type === "success" ? "✅" : "ℹ️";
    setLogOutput((prev) => [...prev, `[${timestamp}] ${icon} ${message}`]);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Configuration</CardTitle>
          <CardDescription>
            Configure the documentation source and scraping parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sourceUrl">Source URL</Label>
              <Input
                disabled={isScraping}
                id="sourceUrl"
                onChange={(e) =>
                  setConfig({ ...config, sourceUrl: e.target.value })
                }
                placeholder="https://react.dev/"
                type="url"
                value={config.sourceUrl}
              />
            </div>
            <div>
              <Label htmlFor="maxPages">Max Pages</Label>
              <Input
                disabled={isScraping}
                id="maxPages"
                min="1"
                onChange={(e) =>
                  setConfig({
                    ...config,
                    maxPages: Number.parseInt(e.target.value),
                  })
                }
                type="number"
                value={config.maxPages}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contentSelector">Content Selector</Label>
            <Input
              disabled={isScraping}
              id="contentSelector"
              onChange={(e) =>
                setConfig({
                  ...config,
                  selectors: { ...config.selectors, content: e.target.value },
                })
              }
              placeholder="article, .content, .docs-content"
              value={config.selectors.content}
            />
          </div>

          <div>
            <Label htmlFor="linksSelector">Links Selector</Label>
            <Input
              disabled={isScraping}
              id="linksSelector"
              onChange={(e) =>
                setConfig({
                  ...config,
                  selectors: { ...config.selectors, links: e.target.value },
                })
              }
              placeholder="a[href]"
              value={config.selectors.links}
            />
          </div>

          <div>
            <Label htmlFor="codeSelector">Code Selector</Label>
            <Input
              disabled={isScraping}
              id="codeSelector"
              onChange={(e) =>
                setConfig({
                  ...config,
                  selectors: { ...config.selectors, code: e.target.value },
                })
              }
              placeholder="pre, code"
              value={config.selectors.code}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                checked={config.aiEnhancement}
                className="rounded"
                disabled={isScraping}
                id="aiEnhancement"
                onChange={(e) =>
                  setConfig({ ...config, aiEnhancement: e.target.checked })
                }
                type="checkbox"
              />
              <Label htmlFor="aiEnhancement">AI Enhancement</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                checked={config.includeCode}
                className="rounded"
                disabled={isScraping}
                id="includeCode"
                onChange={(e) =>
                  setConfig({ ...config, includeCode: e.target.checked })
                }
                type="checkbox"
              />
              <Label htmlFor="includeCode">Include Code Examples</Label>
            </div>
          </div>

          {skillId && (
            <div className="flex justify-end">
              <Button
                className="min-w-[120px]"
                disabled={isScraping || !config.sourceUrl}
                onClick={handleStartScraping}
              >
                {isScraping ? (
                  <>
                    <Square className="mr-2 h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Scraping
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Panel */}
      {isScraping && (
        <Card>
          <CardHeader>
            <CardTitle>Scraping Progress</CardTitle>
            <CardDescription>
              {progress.currentPage} of {progress.totalPages} pages processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress className="h-2" value={progress.percentage} />
            <div className="flex justify-between text-muted-foreground text-sm">
              <span>{Math.round(progress.percentage)}% Complete</span>
              <span>
                {progress.currentPage} / {progress.totalPages} pages
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Log Output */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Real-time scraping progress and logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto rounded-lg bg-gray-50 p-4 font-mono text-sm dark:bg-gray-900">
            {logOutput.length === 0 ? (
              <p className="text-muted-foreground">
                No activity yet. Start scraping to see logs here.
              </p>
            ) : (
              logOutput.map((log, index) => (
                <div className="mb-1" key={index}>
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Presets</CardTitle>
            <CardDescription>Quick-start configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                className="w-full justify-start"
                size="sm"
                variant="outline"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                React Documentation
              </Button>
              <Button
                className="w-full justify-start"
                size="sm"
                variant="outline"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Vue.js Guide
              </Button>
              <Button
                className="w-full justify-start"
                size="sm"
                variant="outline"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Django Docs
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Skills</CardTitle>
            <CardDescription>Your latest skill builds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>React v18.2.0</span>
                <Badge className="text-xs" variant="secondary">
                  Ready
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Vue.js v3.3</span>
                <Badge className="text-xs" variant="secondary">
                  Ready
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Tailwind CSS</span>
                <Badge className="text-xs" variant="secondary">
                  Ready
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Statistics</CardTitle>
            <CardDescription>Build metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="font-bold text-2xl">127</div>
                <div className="text-muted-foreground text-xs">
                  Total Skills
                </div>
              </div>
              <div>
                <div className="font-bold text-2xl">1.2k</div>
                <div className="text-muted-foreground text-xs">
                  Pages Scraped
                </div>
              </div>
              <div>
                <div className="font-bold text-2xl">89%</div>
                <div className="text-muted-foreground text-xs">
                  Success Rate
                </div>
              </div>
              <div>
                <div className="font-bold text-2xl">24</div>
                <div className="text-muted-foreground text-xs">Hours Saved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
