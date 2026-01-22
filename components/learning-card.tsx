"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LearningCardProps {
  title: string;
  description: string;
  href: string;
  image: string;
  badge: string;
}

export function LearningCard({
  title,
  description,
  href,
  image,
  badge,
}: LearningCardProps) {
  return (
    <Card className="group overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-video">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition group-hover:scale-105"
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
        <Button size="sm" className="w-fit gap-1 self-start" asChild>
          <Link href={href}>
            Read more
            <Plus size={14} />
          </Link>
        </Button>
      </CardHeader>
    </Card>
  );
}
