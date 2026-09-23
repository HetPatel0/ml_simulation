import ArtHeader from "@/components/articles/layout/article-header";

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <ArtHeader />
      {children}
    </section>
  );
}
