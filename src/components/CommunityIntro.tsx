import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CommunityIntro = () => {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <p className="text-lg md:text-2xl text-text leading-relaxed">
          SoterCare is a student-led initiative advancing healthcare technology while fostering{' '}
          <span className="font-bold text-[#3d7e93]">SoterCare Developers</span>, an open student
          developer community focused on learning through GitHub, open source, workshops, and
          real-world software engineering.
        </p>
        <Link
          href="/community"
          className="group bg-text text-bg-card px-7 py-3.5 rounded-full font-bold text-base hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          Explore Our Community
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default CommunityIntro;
