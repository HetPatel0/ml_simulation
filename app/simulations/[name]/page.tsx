"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function SimulationPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = React.use(params); // 

  const router = useRouter();

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="h-12 shrink-0 flex items-center gap-3 px-4  border-b">
        <button
          onClick={() => router.back()}
          className="px-3 py-1 rounded-2xl border "
        >
          Back
        </button>

        <span className="font-semibold">{name}</span>
      </div>

      {/* Simulation */}
      <iframe
        src={`/simulations/${name}.html`}
        className="flex-1 w-full border-none"
      />
    </div>
  );
}
