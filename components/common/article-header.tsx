"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArtHeader() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <header className="w-full max-w-6xl mx-auto">
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
    </header>
  );
}
