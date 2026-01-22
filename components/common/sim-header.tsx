// components/simulations/SimHeader.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SimHeaderProps {
  title: string;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
  showBackButton?: boolean;
}

export function SimHeader({ 
  title, 
  description, 
  children,
  showBackButton = true 
}: SimHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/simulations");
    }
  };

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Back Button Row */}
      {showBackButton && (
        <div className="flex items-center justify-center py-4">
          <div className="relative flex w-full max-w-7xl items-center px-4 md:px-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="group gap-2"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back
            </Button>
          </div>
        </div>
      )}

      {/* Title and Description */}
      <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground text-base md:text-lg mb-4">
            {description}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}

// Example Usage:
// 
// Basic usage with just title and description:
// <SimHeader 
//   title="Gradient Descent"
//   description="Visualize how gradient descent optimization finds the minimum"
// />
//
// Without back button:
// <SimHeader 
//   title="My Simulation"
//   description="Description here"
//   showBackButton={false}
// />
//
// With additional content (controls, buttons, etc.):
// <SimHeader 
//   title="Logistic Regression"
//   description="Understanding binary classification"
// >
//   <div className="flex gap-2">
//     <Button>Reset</Button>
//     <Button>Play</Button>
//   </div>
// </SimHeader>