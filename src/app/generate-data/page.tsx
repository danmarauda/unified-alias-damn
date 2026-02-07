import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GenerateDataPage() {
  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-6">
        <Card className="w-full max-w-lg border-border bg-card">
          <CardHeader className="border-border border-b">
            <CardTitle className="font-normal text-lg">Generate Data</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="mb-6 text-muted-foreground">
              Generate data for the Dria decentralized AI inference network.
              This feature allows you to test the network with your own data.
            </p>

            <div className="flex items-center justify-between">
              <Link href="/">
                <Button className="border-muted" variant="outline">
                  Back to Dashboard
                </Button>
              </Link>

              <Button className="bg-primary text-black hover:bg-primary/90">
                Generate Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
