import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

interface Props {
  backHref: string;
  backLabel: string;
}

export default function NewsTopBar({ backHref, backLabel }: Props) {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div className="rounded-[1.5rem] px-5 py-3 flex items-center justify-between bg-bg-card shadow-m border border-white/10">
        {/* Back button */}
        <Link
          href={backHref}
          className="flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-[#3d7e93] transition-colors group"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-bg-panel group-hover:bg-[#a0cbdb]/20 transition-colors">
            <ArrowLeft size={15} />
          </span>
          <span className="hidden sm:inline">{backLabel}</span>
        </Link>

        {/* Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <Image
            src="/assets/SoterCare-Primary-logo-brandblue.webp"
            alt="SoterCare"
            width={0}
            height={0}
            sizes="100vw"
            className="h-9 w-auto object-contain"
            style={{ width: 'auto', height: '36px' }}
          />
        </Link>

        {/* Right spacer — mirrors back button width so logo stays centred */}
        <div className="w-8 h-8 sm:w-24" aria-hidden />
      </div>
    </nav>
  );
}
