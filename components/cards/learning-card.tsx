"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, ArrowRight } from "lucide-react";

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
}

export function LearningCard({
  title,
  description,
  href,
  image,
  badge,
  variant = "read",
}: LearningCardProps) {
  const isSimulation = variant === "simulation";
  const ctaLabel = isSimulation ? "Run simulation" : "Read more";

  return (
    <Card
      className="
        group/card overflow-hidden rounded-2xl
        border-2 border-border/60
        bg-background
        transition-all duration-200 ease-out
        hover:-translate-y-0.5
        hover:shadow-xl
        hover:border-border
        hover:bg-muted/30
        focus-visible:outline-none
        focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background
      "
    >
      {/* Image */}
      <div className="relative aspect-video group">
        <Image
          src={image}
          alt={title}
          fill
          loading="lazy"
          placeholder="blur"
          blurDataURL={blurDataURL}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={80}
          className="
            object-cover
            transition-transform duration-500 ease-out
            group-hover:scale-[1.04]
          "
        />
        <Badge className="absolute top-3 left-3">{badge}</Badge>
      </div>

      {/* Content */}
      <CardHeader className="flex flex-col gap-4">
        <div className="space-y-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>

        {/* CTA */}
        <Button size="sm" className="w-fit self-start p-0" asChild>
          <Link
            href={href}
            scroll={true}
            className="group inline-flex items-center gap-1 px-3 py-1.5"
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
