"use client";

import { ArrowRight, Layers } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/lib/hooks/use-stats";

export function OntologyOverview() {
  const { data, isLoading, error } = useStats();

  const ontology = {
    semanticEntities: isLoading ? 0 : data?.ontology?.semanticEntities || 124,
    kineticEntities: isLoading ? 0 : data?.ontology?.kineticEntities || 67,
    dynamicEntities: isLoading ? 0 : data?.ontology?.dynamicEntities || 39,
    relationships: isLoading ? 0 : data?.ontology?.relationships || 215,
  };

  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center font-normal text-base">
          <Layers className="mr-2 h-5 w-5 text-primary" />
          Ontology Structure
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        ) : (
          <>
            <div className="mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-primary" />
                  <span className="text-sm">Semantic Layer</span>
                </div>
                <span className="font-medium">{ontology.semanticEntities}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-chart-2" />
                  <span className="text-sm">Kinetic Layer</span>
                </div>
                <span className="font-medium">{ontology.kineticEntities}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-chart-3" />
                  <span className="text-sm">Dynamic Layer</span>
                </div>
                <span className="font-medium">{ontology.dynamicEntities}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-chart-4" />
                  <span className="text-sm">Relationships</span>
                </div>
                <span className="font-medium">{ontology.relationships}</span>
              </div>
            </div>
            <div className="mt-3 border-border border-t pt-3">
              <Link
                className="flex items-center text-primary text-sm hover:underline"
                href="/ontology"
              >
                View full ontology <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
