import Link from 'next/link';
import Image from 'next/image';
import type { NewsArticle } from '@/types/news';
import { sortArticles } from '@/lib/news-sort';
import newsJson from '../../data/news.json';

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const articles = sortArticles(newsJson.articles as NewsArticle[]).slice(0, 3);

export default function LatestNews() {
  if (articles.length === 0) return null;

  return (
    <section
      id="news"
      className="relative z-10 pt-4 md:pt-8 pb-16 md:pb-24 overflow-hidden bg-transparent"
    >
      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center flex flex-col items-center">
          <span className="bg-bg-card px-6 sm:px-10 py-2.5 sm:py-3 rounded-[2rem] inline-flex items-center justify-center mb-4 shadow-m text-sm sm:text-base font-bold uppercase tracking-widest text-text-muted">
            Latest News
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text">
            What&apos;s Happening
          </h2>
        </div>

        {/* Cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group bg-bg-card rounded-3xl shadow-m overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-black/[0.03]"
            >
              {/* Cover image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#a0cbdb]/10">
                {article.coverImage ? (
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#a0cbdb]/30 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#3d7e93]/40" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                {/* Date */}
                <p className="text-xs font-semibold text-[#3d7e93] uppercase tracking-widest mb-2">
                  {formatDate(article.date)}
                </p>

                {/* Title */}
                <h3 className="text-xl font-bold text-text leading-snug mb-2 group-hover:text-[#3d7e93] transition-colors line-clamp-3">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-text-muted leading-relaxed line-clamp-3 flex-1">
                  {article.summary}
                </p>

                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium text-text-muted bg-black/[0.05] px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <span className="mt-4 text-sm font-semibold text-[#3d7e93] group-hover:underline">
                  Read more →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-bg-card shadow-m text-text-muted hover:text-[#3d7e93] transition-colors border border-black/[0.04]"
          >
            View all news →
          </Link>
        </div>
      </div>
    </section>
  );
}
