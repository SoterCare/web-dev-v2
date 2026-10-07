import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import NewsTopBar from '@/components/NewsTopBar';
import FooterSimple from '@/components/FooterSimple';
import JsonLd from '@/components/JsonLd';
import { readNews } from '@/lib/news-store';
import { pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import type { ContentBlock } from '@/types/news';

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
  return pageMetadata({
    title: article.title,
    description: article.summary,
    path: `/news/${article.slug}`,
    image: article.coverImage ? { url: article.coverImage, alt: article.title } : undefined,
    article: { publishedTime: article.date, tags: article.tags },
  });
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

  const url = `${SITE_URL}/news/${article.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsArticle',
        '@id': `${url}#article`,
        headline: article.title,
        description: article.summary,
        datePublished: article.date,
        ...(article.coverImage && { image: [`${SITE_URL}${article.coverImage}`] }),
        ...(article.tags.length > 0 && { keywords: article.tags }),
        mainEntityOfPage: url,
        author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE_URL}/news` },
          { '@type': 'ListItem', position: 3, name: article.title, item: url },
        ],
      },
    ],
  };

  const paragraphs = article.body.split(/\n\n+/).filter(Boolean);
  const blocks: ContentBlock[] | undefined =
    article.bodyBlocks && article.bodyBlocks.length > 0 ? article.bodyBlocks : undefined;

  return (
    <main className="min-h-screen bg-[#fafafa] relative">
      <JsonLd data={jsonLd} id="article-jsonld" />
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
              <span className="block text-xs font-semibold text-[#3d7e93] mb-2">
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
            <h1 className="!text-[40px] !font-bold !leading-[1.25] text-text mb-3 sm:mb-4">
              {article.title}
            </h1>

            {/* Summary */}
            <p className="text-base sm:text-lg text-[#3d7e93] font-medium leading-relaxed mb-6 sm:mb-8 border-l-2 border-[#a0cbdb] pl-4">
              {article.summary}
            </p>

            {/* Body */}
            {blocks ? (
              <div className="space-y-5">
                {blocks.map((block, i) => {
                  if (block.type === 'text') {
                    const paras = block.content.split(/\n\n+/).filter(Boolean);
                    if (paras.length === 0) return null;
                    return (
                      <div key={i} className="space-y-5">
                        {paras.map((para, j) => (
                          <p key={j} className="text-base text-text-muted leading-relaxed">
                            {para}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  if (block.type === 'image' && block.src) {
                    return (
                      <figure key={i}>
                        <div className="w-full overflow-hidden rounded-2xl bg-[#a0cbdb]/10">
                          <Image
                            src={block.src}
                            alt={block.caption || ''}
                            width={0}
                            height={0}
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="w-full"
                            style={{ height: 'auto', display: 'block' }}
                          />
                        </div>
                        {block.caption && (
                          <figcaption className="mt-2.5 text-center text-sm text-[var(--text-muted)] italic">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              <div className="space-y-5">
                {paragraphs.map((para, i) => (
                  <p key={i} className="text-base text-text-muted leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            )}

            {/* Footer spacer */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-black/[0.06]" />
          </div>
        </article>

        <FooterSimple />
      </div>
    </main>
  );
}
