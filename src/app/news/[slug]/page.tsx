import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import NewsTopBar from '@/components/NewsTopBar';
import FooterSimple from '@/components/FooterSimple';
import JsonLd from '@/components/JsonLd';
import { readNews } from '@/lib/news-store';
import { sortArticles } from '@/lib/news-sort';
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

  const moreNews = sortArticles(articles)
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

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
        author: { '@type': 'Organization', name: `The ${SITE_NAME} team`, url: `${SITE_URL}/#team` },
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
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                <span className="text-text-muted font-medium">
                  {' · By '}
                  <Link href="/#team" className="hover:underline">
                    the SoterCare team
                  </Link>
                </span>
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

            {/* About SoterCare: links back into the product, so readers (and crawlers) arriving on
                an article can find what SoterCare actually does. */}
            <aside className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-black/[0.06]">
              <p className="text-base text-text-muted leading-relaxed">
                SoterCare is building a camera-free smart care system for care homes in Sri Lanka.{' '}
                <Link href="/#how-it-works" className="font-semibold text-[#3d7e93] hover:underline">
                  See how it works
                </Link>
                {', '}
                <Link href="/#team" className="font-semibold text-[#3d7e93] hover:underline">
                  meet the team
                </Link>
                {' or '}
                <Link href="/community" className="font-semibold text-[#3d7e93] hover:underline">
                  join our developer community
                </Link>
                .
              </p>
            </aside>
          </div>
        </article>

        {moreNews.length > 0 && (
          <section className="relative z-10 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-baseline justify-between mb-5 sm:mb-6">
                <h2 className="!text-2xl sm:!text-3xl !font-bold !leading-tight text-text">More news</h2>
                <Link href="/news" className="text-sm font-semibold text-[#3d7e93] hover:underline">
                  All news →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                {moreNews.map((a) => (
                  <Link
                    key={a.id}
                    href={`/news/${a.slug}`}
                    className="group bg-bg-card rounded-3xl shadow-m overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 border border-black/[0.03]"
                  >
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#a0cbdb]/10">
                      {a.coverImage && (
                        <Image
                          src={a.coverImage}
                          alt={a.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 330px"
                          className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-5 flex flex-col">
                      <time dateTime={a.date} className="text-xs font-semibold text-[#3d7e93] mb-2">
                        {formatDate(a.date)}
                      </time>
                      <h3 className="text-lg font-bold text-text leading-snug line-clamp-3 group-hover:text-[#3d7e93] transition-colors">
                        {a.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <FooterSimple />
      </div>
    </main>
  );
}
