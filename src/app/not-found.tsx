import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist. Return to SoterCare homepage.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg-body flex items-center justify-center px-4 relative overflow-hidden">
      {/* Search Background Pattern */}
      <div className="dotted-bg" />

      {/* Content Container */}
      <div className="relative z-10 text-center max-w-md bg-bg-card/50 backdrop-blur-sm p-8 rounded-[2rem] border border-white/20 shadow-m">
        <h1 className="text-8xl font-bold text-text mb-2">404</h1>
        <span className="text-2xl font-medium text-text-muted mb-6">Page Not Found</span>
        <p className="text-text-muted mb-8 leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-bg-panel text-text px-8 py-3 rounded-xl font-medium hover:scale-105 active:scale-95 transition-all shadow-m border border-white/10"
        >
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}
