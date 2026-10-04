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

// Rendered inside the promise section (see Mission), so it has no section wrapper of its own.
export default function LatestNews() {
  if (articles.length === 0) return null;

  return (
    <div id="news" className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="group bg-bg-card rounded-3xl shadow-m overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-black/[0.03]"
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#a0cbdb]/10">
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
                  <div className="w-12 h-12 rounded-full bg-[#a0cbdb]/30 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-[#3d7e93]/40" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-text leading-snug line-clamp-2 group-hover:text-[#3d7e93] transition-colors">
                {article.title}
              </h3>
              <div className="mt-auto pt-3 flex items-center justify-between gap-3">
                <span className="text-[11px] font-medium text-text-muted">
                  {formatDate(article.date)}
                </span>
                <span className="text-sm font-semibold text-[#3d7e93] group-hover:underline">
                  Read more →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold rounded-full bg-text text-bg-card shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
        >
          View all news →
        </Link>
        <Link
          href="/community"
          className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold rounded-full bg-bg-card text-text shadow-m hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Visit our community →
        </Link>
      </div>
    </div>
  );
}
