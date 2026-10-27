import Link from "next/link";
import Image from "next/image";
import { Plus, ArrowRight, Clock } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blurDataURL } from "@/lib/blur";

interface LearningCardProps {
  title: string;
  description: string;
  href: string;
  image: string;
  badge?: string;
  variant?: "read" | "simulation";
  /** Minutes to read — pill shows next to badge when provided. */
  readingTime?: number;
  /** Set for the first above-fold card so it preloads (LCP). */
  priority?: boolean;
  /** Disable route prefetch for cards that are far below the fold. */
  prefetch?: boolean;
}

export function LearningCard({
  title,
  description,
  href,
  image,
  badge,
  variant = "read",
  readingTime,
  priority = false,
  prefetch = true,
}: LearningCardProps) {
  const isSimulation = variant === "simulation";
  const ctaLabel = isSimulation ? "Run simulation" : "Read more";

  return (
    <Card
      className="
        group/card flex h-full flex-col overflow-hidden rounded-2xl
        border border-border/60
        bg-background
        transition-all duration-200 ease-out
        hover:-translate-y-0.5
        hover:shadow-md
        hover:border-border
        hover:bg-muted/30
        focus-visible:outline-none
        focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background
      "
    >
      {/* Image — links to destination */}
      <Link
        href={href}
        scroll={true}
        prefetch={prefetch}
        aria-label={title}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            placeholder="blur"
            blurDataURL={blurDataURL}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // Quality is meaningless for vectors and trips
            // next-image-unconfigured-qualities — only set for raster.
            quality={image.endsWith(".svg") ? undefined : 80}
            className="
              object-cover
              transition-transform duration-500 ease-out
              group-hover/card:scale-[1.04]
            "
          />
        </div>
      </Link>

      {/* Content */}
      <CardHeader className="flex flex-1 flex-col gap-4">
        <div className="flex-1 space-y-2.5">
          <div className="flex min-h-6 flex-wrap items-center gap-2">
            {badge && (
              <Badge className="w-fit border-primary/20 bg-primary/10 font-semibold text-primary">
                {badge}
              </Badge>
            )}
            {readingTime !== undefined && (
              <span className="inline-flex w-fit items-center gap-1 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                <Clock size={12} aria-hidden="true" className="text-primary" />
                {readingTime} min read
              </span>
            )}
          </div>
          <CardTitle className="line-clamp-2 min-h-14 text-xl tracking-tight">
            <Link
              href={href}
              scroll={true}
              prefetch={prefetch}
              className="rounded-sm underline-offset-4 decoration-border hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {title}
            </Link>
          </CardTitle>
          <CardDescription className="line-clamp-3 min-h-[4.875rem] text-sm leading-relaxed">
            {description}
          </CardDescription>
        </div>

        {/* CTA — Button's own h-8/px-3 own the box; the link adds nothing
            so Slot class merge can never fight the variant defaults. */}
        <Button size="sm" className="mt-auto h-8 w-fit self-start gap-1.5 px-3" asChild>
          <Link
            href={href}
            scroll={true}
            prefetch={prefetch}
            className="group inline-flex items-center"
          >
            {ctaLabel}

            {isSimulation ? (
              <ArrowRight
                size={14}
                className="
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              />
            ) : (
              <Plus
                size={14}
                className="
                  transition-all duration-300
                  group-hover:rotate-90
                  group-hover:translate-x-0.5
                "
              />
            )}
          </Link>
        </Button>
      </CardHeader>
    </Card>
  );
}
