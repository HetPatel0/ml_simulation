"use client";

import * as React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SimulationErrorBoundaryProps {
  children: React.ReactNode;
}

export class SimulationErrorBoundary extends React.Component<
  SimulationErrorBoundaryProps,
  { error: Error | null }
> {
  constructor(props: SimulationErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="mx-auto my-10 flex max-w-md flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center"
        >
          <AlertTriangle className="h-7 w-7 text-destructive" />
          <p className="text-sm font-medium text-foreground">
            This simulation failed to load.
          </p>
          <p className="text-xs text-muted-foreground">
            {this.state.error.message}
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => this.setState({ error: null })}
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
