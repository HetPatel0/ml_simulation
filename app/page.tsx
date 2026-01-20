export const runtime = "nodejs";

import fs from "fs";
import path from "path";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ModeToogle } from "@/components/mode-toogle";

export default function Home() {
  const simulationsDir = path.join(
    process.cwd(),
    "public/simulations"
  );

  const files = fs
    .readdirSync(simulationsDir)
    .filter((file) => file.endsWith(".html"));

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Simulations
          </h1>
          <p className="text-muted-foreground mt-1">
            Interactive machine learning & algorithm visualizations
          </p>
        </div>

        <ModeToogle />
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file) => {
          const name = file.replace(".html", "");

          return (
            <Card
              key={file}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  {name}
                </CardTitle>
                <CardDescription>
                  Interactive simulation
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Link href={`/simulations/${name}`}>
                  <Button variant="default" className="w-full">
                    Open Simulation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
