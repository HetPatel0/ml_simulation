import { ContentTopBar } from "@/components/layout/content-topbar";
import type { ReactNode } from "react";

interface SimHeaderProps {
  title: string;
  subtitle: ReactNode;
}

export default function SimHeader({ title, subtitle }: SimHeaderProps) {
  return (
    <ContentTopBar
      shareTitle={title}
      title={title}
      subtitle={subtitle}
      fallbackHref="/"
    />
  );
}
