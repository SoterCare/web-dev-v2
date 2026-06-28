import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import NewsTopBar from '@/components/NewsTopBar';
import FooterSimple from '@/components/FooterSimple';
import { readNews } from '@/lib/news-store';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { articles } = readNews();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { articles } = readNews();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.summary,
  };
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const { articles } = readNews();
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const paragraphs = article.body.split(/\n\n+/).filter(Boolean);

  return (
    <main className="min-h-screen bg-[#fafafa] relative">
      {/* Dotted background */}
      <div
        className="fixed top-0 left-0 z-0 h-full w-full pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#e5e7eb 2px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10">
        <NewsTopBar backHref="/news" backLabel="Back to News" />

        <article className="pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Cover image */}
            {article.coverImage && (
              <div className="w-full overflow-hidden rounded-3xl mb-6 sm:mb-8 bg-[#a0cbdb]/10">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                  className="w-full"
                  style={{ height: 'auto', display: 'block' }}
                />
              </div>
            )}

            {/* Meta: date then tags on next line */}
            <div className="mb-5">
              <span className="block text-xs font-semibold text-[#3d7e93] uppercase tracking-widest mb-2">
                {formatDate(article.date)}
              </span>
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-text-muted bg-black/[0.05] px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="!text-[32px] !font-bold !leading-[1.25] text-text mb-3 sm:mb-4">
              {article.title}
            </h1>

            {/* Summary */}
            <p className="text-base sm:text-lg text-[#3d7e93] font-medium leading-relaxed mb-6 sm:mb-8 border-l-2 border-[#a0cbdb] pl-4">
              {article.summary}
            </p>

            {/* Body */}
            <div className="space-y-5">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-base text-text-muted leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Footer spacer */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-black/[0.06]" />
          </div>
        </article>

        <FooterSimple />
      </div>
    </main>
  );
}
