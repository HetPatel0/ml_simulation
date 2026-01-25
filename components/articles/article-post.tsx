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

      {children && (
        <div
          className={cn(
            "max-w-none text-neutral-800 dark:text-neutral-200",

            // --- PARAGRAPHS ---
            "[&>p]:text-lg",
            "[&>p]:leading-6",
            "[&>p]:mb-4",
            "[&>p]:font-normal",

            // --- H2 (Styled as H1) ---
            "[&>h2]:text-2xl",
            "[&>h2]:font-semibold!", 
            "[&>h2]:tracking-tighter",
            "[&>h2]:leading-tight",
            "[&>h2]:mb-2", 

            // --- H3 ---
            "[&>h3]:text-xl",
            "[&>h3]:font-bold",
            "[&>h3]:mt-12",
            "[&>h3]:mb-4",

            // --- DROP CAP ---
            "[&>p:first-of-type]:first-letter:text-5xl",
            "[&>p:first-of-type]:first-letter:font-semi-bold",
            "[&>p:first-of-type]:first-letter:float-left",
            "[&>p:first-of-type]:first-letter:mr-3",
            "[&>p:first-of-type]:first-letter:leading-none",

            "[&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-8",
            "[&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-8",
            "[&>li]:mb-2",
          )}
        >
          {children}
        </div>
      )}
    </article>
  );
}
