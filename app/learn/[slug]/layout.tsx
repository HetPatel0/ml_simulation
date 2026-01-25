import ArtHeader from "@/components/common/article-header";

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
