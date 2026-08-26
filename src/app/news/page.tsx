import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import NewsTopBar from '@/components/NewsTopBar';
import FooterSimple from '@/components/FooterSimple';
import { readNews } from '@/lib/news-store';
import { sortArticles } from '@/lib/news-sort';
import type { NewsArticle } from '@/types/news';

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news and updates from SoterCare — product announcements, research milestones, and team updates.',
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-bg-card px-6 py-2.5 rounded-[2rem] shadow-m text-xs sm:text-sm font-bold uppercase tracking-widest text-text-muted w-fit">
      {children}
    </span>
  );
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function cols(articles: NewsArticle[], n: number): NewsArticle[][] {
  return Array.from({ length: n }, (_, i) => articles.filter((_, idx) => idx % n === i));
}

function ArticleCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group bg-bg-card rounded-3xl shadow-m overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 block"
    >
      {article.coverImage ? (
        <div className="w-full overflow-hidden flex-shrink-0 bg-[#a0cbdb]/10">
          <Image
            src={article.coverImage}
            alt={article.title}
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full group-hover:scale-[1.03] transition-transform duration-500"
            style={{ height: 'auto', display: 'block' }}
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-[#a0cbdb]/10 flex items-center justify-center flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#a0cbdb]/30 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-[#3d7e93]/40" />
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col">
        <p className="text-xs font-semibold text-[#3d7e93] uppercase tracking-widest mb-2">
          {formatDate(article.date)}
        </p>
        <h2 className="!text-[23px] !font-semibold !leading-[1.3] text-text mb-1.5 group-hover:text-[#3d7e93] transition-colors">
          {article.title}
        </h2>
        <p className="text-sm text-text-muted leading-relaxed line-clamp-3">
          {article.summary}
        </p>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
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

        <p className="mt-3 text-xs font-semibold text-[#3d7e93] group-hover:underline">
          Read more →
        </p>
      </div>
    </Link>
  );
}

export default function NewsPage() {
  const { articles } = readNews();
  const sorted = sortArticles(articles);

  return (
    <main className="min-h-screen bg-[#fafafa] relative">
      <div
        className="fixed top-0 left-0 z-0 h-full w-full pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#e5e7eb 2px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10">
        <NewsTopBar backHref="/" backLabel="Back to SoterCare" />

        {/* ── HERO ── */}
        <section className="relative pt-28 sm:pt-32 md:pt-40 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Marquee band — the same signature device from the homepage Hero/Footer, retuned to this page's own words */}
          <div className="absolute inset-x-0 top-24 sm:top-28 md:top-36 z-0 flex flex-col gap-4 md:gap-6 overflow-hidden select-none pointer-events-none opacity-[0.05]">
            {[
              { text: 'ANNOUNCEMENTS', dir: 'left', duration: '32s' },
              { text: 'SOTERCARE NEWSROOM', dir: 'right', duration: '40s' },
              { text: 'MILESTONES · UPDATES · STORIES', dir: 'left', duration: '46s' },
            ].map((row, i) => {
              const repeated = Array(6).fill(`${row.text} · `).join('');
              return (
                <div key={i} className="overflow-hidden py-1 sm:py-2">
                  <div
                    className="flex whitespace-nowrap will-change-transform"
                    style={{ animation: `marquee-${row.dir} ${row.duration} linear infinite` }}
                  >
                    <span className="text-[9rem] md:text-[13rem] font-black tracking-tighter leading-[0.8] text-black">
                      {repeated}
                    </span>
                    <span className="text-[9rem] md:text-[13rem] font-black tracking-tighter leading-[0.8] text-black" aria-hidden="true">
                      {repeated}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-6 md:gap-8">
            <Badge>SoterCare News</Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text leading-[1.1] tracking-tight">
              The Newsroom <span className="text-[#3d7e93]">of SoterCare</span>
            </h1>
            <p className="max-w-2xl text-base md:text-xl text-text-muted leading-relaxed">
              Product announcements, research milestones, competition wins, and team updates —
              everything happening at SoterCare, written as it happens.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <Link
                href="#latest"
                className="group bg-text text-bg-card px-7 py-3.5 rounded-full font-bold text-base hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                Read the Latest
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/community"
                className="bg-bg-card text-text px-7 py-3.5 rounded-full font-bold text-base shadow-m hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Visit Community
              </Link>
            </div>
          </div>
        </section>

        <section id="latest" className="scroll-mt-24 relative z-10 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {sorted.length === 0 ? (
              <p className="text-center text-text-muted py-24">No articles yet. Check back soon.</p>
            ) : (
              <>
                {/* Mobile — 1 column */}
                <div className="flex flex-col gap-6 md:hidden">
                  {sorted.map((a) => <ArticleCard key={a.id} article={a} />)}
                </div>

                {/* Tablet — 2 columns, left-to-right order */}
                <div className="hidden md:flex lg:hidden gap-6 items-start">
                  {cols(sorted, 2).map((column, ci) => (
                    <div key={ci} className="flex-1 flex flex-col gap-6">
                      {column.map((a) => <ArticleCard key={a.id} article={a} />)}
                    </div>
                  ))}
                </div>

                {/* Desktop — 3 columns, left-to-right order */}
                <div className="hidden lg:flex gap-6 items-start">
                  {cols(sorted, 3).map((column, ci) => (
                    <div key={ci} className="flex-1 flex flex-col gap-6">
                      {column.map((a) => <ArticleCard key={a.id} article={a} />)}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <FooterSimple />
      </div>
    </main>
  );
}
