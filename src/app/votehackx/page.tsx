import type { Metadata } from 'next';
import NewsTopBar from '@/components/NewsTopBar';
import FooterSimple from '@/components/FooterSimple';
import VoteSteps from '@/components/VoteSteps';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Vote for SoterCare at hackX 11.0',
    description:
      'Most Popular Team voting is open for hackX 11.0. Back SoterCare in two quick steps.',
    path: '/votehackx',
  }),
  robots: { index: false, follow: true },
};

export default function VoteHackXPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] relative">
      <div
        className="fixed top-0 left-0 z-0 h-full w-full pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#e5e7eb 2px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <NewsTopBar backHref="/" backLabel="Home" />
      <div className="relative z-10 px-4 sm:px-6 pt-24 md:pt-40 pb-6 max-w-3xl mx-auto">
        <VoteSteps />
        <FooterSimple />
      </div>
    </main>
  );
}
