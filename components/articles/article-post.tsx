import * as React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ArticlePostProps = {
  title: string;
  author: string;
  date?: string;
  description?: React.ReactNode;
  image?: {
    src: string;
    alt?: string;
  };
  children?: React.ReactNode;
  className?: string;
};

export function ArticlePost({
  title,
  author,
  date,
  description,
  image,
  children,
  className,
}: ArticlePostProps) {
  return (
    <article className={cn("mx-auto max-w-[90ch] px-6 py-16", className)}>
      {/* Header */}
      <header className="space-y-6">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight">
          {title}
        </h1>

        <div className="text-sm text-muted-foreground">
          By <span className="font-medium text-foreground">{author}</span>
          {date && <span className="mx-1">·</span>}
          {date && <time>{date}</time>}
        </div>

        {description && (
          <p className="text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </header>

      {/* Optional Image */}
      {image ? (
        <figure className="relative my-10 aspect-video border-2 rounded-xl">
          <Image
            src={image.src}
            alt={image.alt ?? title}
            priority
            fill
            className="object-cover rounded-xl"
            quality={100}
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </figure>
      ) : (
        <div></div>
      )}

      {/* Content */}
      {children && (
        <div
          className={cn(
            "prose prose-neutral max-w-none",
            "prose-headings:font-semibold",
            "prose-h2:mt-12",
            "prose-h3:mt-8",
            "prose-p:leading-relaxed",
            "prose-li:leading-relaxed",
            "prose-code:text-sm",
            "prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
            "dark:prose-invert",
          )}
        >
          {children}
        </div>
      )}
    </article>
  );
}
