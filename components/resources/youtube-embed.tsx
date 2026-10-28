type YouTubeEmbedProps = {
  src: string;
  title: string;
};

export function YouTubeEmbed({ src, title }: YouTubeEmbedProps) {
  return (
    <div className="aspect-video overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
      <iframe
        className="h-full w-full"
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
