"use client";

import { SkillAnalytics } from "@/components/skills/skill-analytics";
import { SkillBuilder } from "@/components/skills/skill-builder";
import { SkillVersions } from "@/components/skills/skill-versions";
import { SkillsManager } from "@/components/skills/skills-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SkillsPage() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Skills Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and deploy AI skills from documentation
          </p>
        </div>
      </div>

      <Tabs className="space-y-4" defaultValue="manager">
        <TabsList>
          <TabsTrigger value="manager">Skills Manager</TabsTrigger>
          <TabsTrigger value="builder">Skill Builder</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="manager">
          <SkillsManager />
        </TabsContent>

        <TabsContent className="space-y-4" value="builder">
          <SkillBuilder />
        </TabsContent>

        <TabsContent className="space-y-4" value="versions">
          <SkillVersions />
        </TabsContent>

        <TabsContent className="space-y-4" value="analytics">
          <SkillAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
