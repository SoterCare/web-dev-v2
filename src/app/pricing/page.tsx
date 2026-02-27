import Navbar from '@/components/Navbar';
import FooterSimple from '@/components/FooterSimple';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | SoterCare',
  description: 'View pricing plans for SoterCare elderly care solutions.',
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fafafa] text-foreground relative">
        {/* Background pattern */}
        <div className="fixed top-0 left-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-foreground">
            Pricing Page
          </h1>
        </div>

        <FooterSimple />
      </main>
    </>
  );
}
