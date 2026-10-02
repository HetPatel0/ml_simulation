import { ContentTopBar } from "@/components/layout/content-topbar";

export default function ArtHeader() {
  return <ContentTopBar fallbackHref="/" showShare={false} className="mx-auto max-w-6xl" />;
}
