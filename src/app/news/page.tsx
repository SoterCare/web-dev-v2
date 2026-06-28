import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import NewsTopBar from '@/components/NewsTopBar';
import FooterSimple from '@/components/FooterSimple';
import { readNews } from '@/lib/news-store';

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news and updates from SoterCare — product announcements, research milestones, and team updates.',
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function NewsPage() {
  const { articles } = readNews();
  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));

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
        <NewsTopBar backHref="/" backLabel="Back to SoterCare" />

        <section className="relative z-10 pt-24 sm:pt-28 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text">Latest News</h1>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-text-muted max-w-xl mx-auto">
                Product announcements, research milestones, and team updates from SoterCare.
              </p>
            </div>

            {/* News grid */}
            {sorted.length === 0 ? (
              <p className="text-center text-text-muted py-24">No articles yet. Check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {sorted.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="group bg-bg-card rounded-3xl shadow-m overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300"
                  >
                    {/* Cover image */}
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

                    {/* Card body */}
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

                      {/* Tags */}
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
                ))}
              </div>
            )}
          </div>
        </section>

        <FooterSimple />
      </div>
    </main>
  );
}
