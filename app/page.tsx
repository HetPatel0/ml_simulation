import type { Metadata } from "next";
import { HomeClient } from "@/components/hero/home-client";

export const metadata: Metadata = {
  title: "ML Simulations - Interactive Machine Learning Education",
  description:
    "Watch machine learning algorithms come alive through interactive visualizations. Adjust parameters, see results instantly.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <HomeClient />
    </main>
  );
}
