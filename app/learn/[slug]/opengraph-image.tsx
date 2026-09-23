import { articleMetadata } from "@/lib/metadata";
import { OG_CONTENT_TYPE, OG_SIZE, servePublicImage } from "@/lib/og-image";

export const alt = "ML Simulations article";
export const size = { ...OG_SIZE };
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return Object.keys(articleMetadata).map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return servePublicImage(articleMetadata[slug]?.image ?? "/og/home.jpg");
}
