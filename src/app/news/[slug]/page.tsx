import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
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

        <article className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-[#3d7e93] transition-colors mb-8"
            >
              ← Back to news
            </Link>

            {/* Cover image */}
            {article.coverImage && (
              <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden mb-8 bg-[#a0cbdb]/10">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Meta: date + tags */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-[#3d7e93] uppercase tracking-widest">
                {formatDate(article.date)}
              </span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium text-text-muted bg-black/[0.05] px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-text leading-snug mb-6">
              {article.title}
            </h1>

            {/* Summary */}
            <p className="text-lg text-[#3d7e93] font-medium leading-relaxed mb-8 border-l-2 border-[#a0cbdb] pl-4">
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

            {/* Footer nav */}
            <div className="mt-12 pt-8 border-t border-black/[0.06]">
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-[#3d7e93] transition-colors"
              >
                ← Back to news
              </Link>
            </div>
          </div>
        </article>

        <FooterSimple />
      </div>
    </main>
  );
}
