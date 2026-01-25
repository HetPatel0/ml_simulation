"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SimHeaderProps {
  title: string;
  subtitle: React.ReactNode;
}

export default function SimHeader({ title, subtitle }: SimHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <header className="w-full">
      <div className="flex items-center justify-center border-b py-5">
        <div className="relative flex w-full max-w-6xl items-center px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="group absolute left-7 gap-2 cursor-pointer"
          >
            <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Back
          </Button>

          <div className="mx-auto h-6" />
        </div>
      </div>
      <div className="mt-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      </div>
    </header>
  );
}
