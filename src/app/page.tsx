import { AgentActivities } from "@/components/dashboard/AgentActivities";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { NetworkOverview } from "@/components/dashboard/NetworkOverview";
import { OntologyOverview } from "@/components/dashboard/OntologyOverview";
import { ProjectsSummary } from "@/components/dashboard/ProjectsSummary";
import { MainLayout } from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col space-y-4 p-4 md:space-y-6 md:p-6">
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
          <NetworkOverview />
          <ProjectsSummary />
          <OntologyOverview />
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
          <LiveFeed />
          <AgentActivities />
        </div>

        <Leaderboard />
      </div>
    </MainLayout>
  );
}
