import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import NewsTopBar from '@/components/NewsTopBar';
import FooterSimple from '@/components/FooterSimple';
import {
  Github,
  ArrowRight,
  Users,
  GraduationCap,
  Trophy,
  Handshake,
  Sparkles,
  BookOpen,
  MessageSquare,
  GitPullRequest,
  FolderGit2,
  Rocket,
  BrainCircuit,
  Cloud,
  Radio,
  Link2,
  Code2,
  Heart,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Community',
  description:
    'SoterCare Developers — the student developer community of SoterCare. Learn through GitHub, open source, workshops, and real-world software engineering.',
};

const COMMUNITY_URL = 'https://github.com/SoterCare/community';
const ORG_URL = 'https://github.com/SoterCare';
const RESOURCES_URL = 'https://github.com/SoterCare/awesome-student-resources';

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-bg-card px-6 py-2.5 rounded-[2rem] shadow-m text-xs sm:text-sm font-bold uppercase tracking-widest text-text-muted w-fit">
      {children}
    </span>
  );
}

function SectionHeading({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-5 md:gap-6 mb-12 md:mb-16">
      <Badge>{badge}</Badge>
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text leading-tight">{title}</h2>
      {subtitle && (
        <p className="max-w-2xl text-base md:text-lg text-text-muted leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

function StatCard({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="bg-bg-card rounded-3xl shadow-sm border border-black/5 p-6 md:p-8 text-center">
      <div className="text-3xl md:text-4xl font-bold text-[#3d7e93] mb-2">{value}</div>
      <div className="text-sm md:text-base text-text font-semibold leading-snug">{label}</div>
      {sub && <div className="text-xs text-text-muted mt-1">{sub}</div>}
    </div>
  );
}

function GalleryPhoto({
  src,
  alt,
  caption,
  fill: fillHeight,
}: {
  src: string;
  alt: string;
  caption: string;
  fill?: boolean;
}) {
  return (
    <div
      className={`group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-black/5 ${
        fillHeight ? 'h-full min-h-[16rem] md:min-h-full' : 'aspect-[4/3]'
      }`}
    >

      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
        <span className="text-white text-xs sm:text-sm font-semibold">{caption}</span>
      </div>
    </div>
  );
}

function PartnerCard({
  name,
  logo,
  Icon,
  dark,
}: {
  name: string;
  logo?: string;
  Icon?: React.ElementType;
  dark?: boolean;
}) {
  return (
    <div className="bg-bg-card rounded-2xl shadow-sm border border-black/5 p-5 flex flex-col items-center gap-3 w-40 sm:w-44">
      <div
        className={`h-14 w-full rounded-xl overflow-hidden flex items-center justify-center p-2 ${
          dark ? 'bg-[#111]' : 'bg-black/[0.03]'
        }`}
      >
        {logo?.endsWith('.svg') ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={`${name} logo`} className="object-contain h-full w-full" />
        ) : logo ? (
          <Image
            src={logo}
            alt={`${name} logo`}
            width={112}
            height={56}
            className="object-contain h-full w-full"
          />
        ) : Icon ? (
          <Icon size={22} className="text-[#3d7e93]" />
        ) : (
          <Handshake size={22} className="text-[#3d7e93]" />
        )}
      </div>
      <span className="text-xs sm:text-sm font-semibold text-text text-center leading-snug">{name}</span>
    </div>
  );
}

function LinkCard({
  Icon,
  title,
  desc,
  href,
}: {
  Icon: React.ElementType;
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-bg-card p-6 md:p-8 rounded-3xl shadow-sm border border-black/5 flex flex-col gap-3 hover:shadow-xl transition-all duration-300"
    >
      <Icon className="text-[#3d7e93]" size={28} />
      <h3 className="text-xl font-bold text-text">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed flex-1">{desc}</p>
      <span className="text-xs font-semibold text-[#3d7e93] group-hover:underline flex items-center gap-1">
        Visit <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

function EventCard({
  title,
  result,
  href,
  newsHref,
}: {
  title: string;
  result: string;
  href: string;
  newsHref?: string;
}) {
  return (
    <div className="bg-bg-card p-6 rounded-3xl shadow-sm border border-black/5 flex flex-col gap-2">
      <h3 className="text-lg font-bold text-text">{title}</h3>
      <p className="text-sm text-[#3d7e93] font-semibold">{result}</p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-[#3d7e93] transition-colors">
          Read on GitHub →
        </a>
        {newsHref && (
          <Link href={newsHref} className="text-text-muted hover:text-[#3d7e93] transition-colors">
            Read on our News →
          </Link>
        )}
      </div>
    </div>
  );
}

export default function CommunityPage() {
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
          <div className="absolute inset-0 z-0 flex flex-col justify-center gap-4 md:gap-6 overflow-hidden select-none pointer-events-none opacity-[0.05]">
            {[
              { text: 'OPEN SOURCE', dir: 'left', duration: '32s' },
              { text: 'SOTERCARE DEVELOPERS', dir: 'right', duration: '40s' },
              { text: 'LEARN TOGETHER · SHIP TOGETHER', dir: 'left', duration: '46s' },
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
            <Badge>SoterCare Developers</Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text leading-[1.1] tracking-tight">
              The Student Developer Community <span className="text-[#3d7e93]">of SoterCare</span>
            </h1>
            <p className="max-w-2xl text-base md:text-xl text-text-muted leading-relaxed">
              An open student developer community helping students learn through GitHub, open source,
              workshops, and real-world software projects — in AI, Cloud, IoT, Blockchain, Web3, and
              software engineering. Open to any student, from any university, in any field.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <a
                href={COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-text text-bg-card px-7 py-3.5 rounded-full font-bold text-base hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <Github size={18} />
                Explore on GitHub
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                href="#join"
                className="bg-bg-card text-text px-7 py-3.5 rounded-full font-bold text-base shadow-m hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Join Us
              </Link>
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            <SectionHeading badge="About" title="What is SoterCare Developers?" />
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {[
                { q: 'Who is it for?', a: 'Any student — any university, any year, any experience level. You do not need any connection to SoterCare’s healthcare product to belong here.' },
                { q: 'How do I join?', a: 'No application. Star the repo, introduce yourself in Discussions, come to an event, or open your first pull request.' },
                { q: 'What do members do?', a: 'Run and attend workshops, hack at hackathons, contribute to open source, mentor newer members, and document what we learn.' },
                { q: 'Why GitHub?', a: 'It’s where the work actually lives — events, guides, and history, version-controlled and open for anyone to improve.' },
              ].map((item) => (
                <div key={item.q} className="bg-bg-card p-6 md:p-8 rounded-3xl shadow-sm border border-black/5">
                  <h3 className="text-lg md:text-xl font-bold text-text mb-2">{item.q}</h3>
                  <p className="text-sm md:text-base text-text-muted leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm md:text-base text-text-muted max-w-2xl mx-auto leading-relaxed">
              SoterCare Developers is built by the team behind{' '}
              <a href="https://sotercare.com" className="text-[#3d7e93] font-semibold hover:underline">
                SoterCare
              </a>
              , a student-led healthcare technology venture — but this community stands on its own. No
              product code lives here, and no prior connection to SoterCare&apos;s product is required.
            </p>
          </div>
        </section>

        {/* ── LEARNING AREAS ── */}
        <section id="learning-areas" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-[#3d7e93]/[0.04]">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              badge="Learning Areas"
              title="What members explore"
              subtitle="Through workshops, hackathons, and real contributions — not just lectures."
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { Icon: BrainCircuit, label: 'Artificial Intelligence & Machine Learning' },
                { Icon: Cloud, label: 'Cloud Computing' },
                { Icon: Radio, label: 'Internet of Things (IoT)' },
                { Icon: Link2, label: 'Blockchain & Web3' },
                { Icon: Code2, label: 'Software Engineering & Full-Stack' },
                { Icon: Heart, label: 'Open Source Collaboration' },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  className="bg-bg-card p-5 md:p-6 rounded-2xl shadow-sm border border-black/5 flex flex-col items-center text-center gap-3"
                >
                  <Icon size={26} className="text-[#3d7e93]" />
                  <span className="text-sm md:text-base font-semibold text-text leading-snug">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section id="mission" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <SectionHeading
              badge="Mission"
              title="Learning together, shipping real things"
              subtitle="To empower students to build meaningful, open technology by learning together, shipping real projects, and lifting each other up through mentorship and community."
            />
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6 text-left">
              {[
                'Beginners are welcome — always.',
                'Learning in public.',
                'Ship real things.',
                'Credit generously.',
                'Care for the community, not just the code.',
              ].map((value, i) => (
                <div
                  key={value}
                  className={`bg-bg-card p-5 md:p-6 rounded-2xl shadow-sm border border-black/5 flex items-start gap-3 ${
                    i === 4 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <Sparkles size={18} className="text-[#3d7e93] mt-0.5 flex-shrink-0" />
                  <span className="text-sm md:text-base text-text font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE PROOF: COMMUNITY IMPACT + COMMUNITY IN ACTION ── */}
        <div className="bg-white/70">
          {/* ── COMMUNITY IMPACT ── */}
          <section id="impact" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-8 md:pb-10">
            <div className="max-w-6xl mx-auto">
              <SectionHeading badge="Community Impact" title="Real numbers, verified as we go" />
              <div className="bg-bg-card rounded-3xl shadow-sm border border-black/5 overflow-hidden mb-10">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-black/[0.06]">
                  {[
                    { value: '700+', label: 'Students Directly Engaged', sub: 'the three events below, summed' },
                    { value: '500+', label: 'VisioNEX Hackathon', sub: 'school students · 40+ schools' },
                    { value: '100+', label: 'Sandbox @ IIT', sub: 'across all sessions · Jul 25, 2026' },
                    { value: '100+', label: 'Algorand Workshop', sub: 'trained on AlgoKit 3.0' },
                  ].map((stat) => (
                    <div key={stat.label} className="p-6 md:p-8 text-center">
                      <div className="text-3xl md:text-4xl font-bold text-[#3d7e93] mb-2">{stat.value}</div>
                      <div className="text-sm md:text-base text-text font-semibold leading-snug">{stat.label}</div>
                      <div className="text-xs text-text-muted mt-1">{stat.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-bg-card rounded-3xl shadow-sm border border-black/5 p-6 md:p-8 text-center">
                <p className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-3">
                  Community members have also competed in
                </p>
                <p className="text-sm md:text-base text-text leading-relaxed">
                  🏆 Hult Prize (Finalist) · 🥈 CuttingEdge 2026 (2nd Runner-Up, Best SDGP Community &amp;
                  Project) · 🚀 NIA Innovation Voucher Programme 2026 (Selected) · 🎯 CodeSprint 11
                  (Finalist)
                </p>
                <p className="mt-3 text-xs text-text-muted max-w-xl mx-auto">
                  These competition wins recognize Team SoterCare&apos;s product work, not the community
                  directly — the same people build both.
                </p>
              </div>
            </div>
          </section>

          {/* ── COMMUNITY IN ACTION ── */}
          <section id="community-in-action" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 pt-8 md:pt-10 pb-12 md:pb-20">
            <div className="max-w-6xl mx-auto">
              <SectionHeading
                badge="Community in Action"
                title="Real students, real events"
                subtitle="Every photo links to the full event write-up — see the people behind the numbers."
              />
              <div className="grid grid-cols-2 md:grid-cols-4 md:grid-flow-dense gap-4 md:gap-6">
                {[
                  { src: '/assets/community/visionex-hackathon.jpg', alt: 'VisioNEX Hackathon 2', caption: 'VisioNEX Hackathon', feature: true },
                  { src: '/assets/community/algorand-workshop.jpg', alt: 'Algorand Foundation Workshop', caption: 'Algorand Workshop' },
                  { src: '/assets/community/cuttingedge-projexpo.jpg', alt: 'CuttingEdge 2026 PROJEXPO', caption: 'CuttingEdge PROJEXPO' },
                  { src: '/assets/community/nsoc-collab.jpg', alt: 'Nexus Spring of Code collaboration', caption: 'Nexus Spring of Code' },
                  { src: '/assets/community/gssoc.jpg', alt: 'GirlScript Summer of Code 2026', caption: 'GirlScript Summer of Code' },
                  { src: '/assets/community/solana-event.jpg', alt: 'Solana Community Event', caption: 'Solana Community Event' },
                  { src: '/assets/community/us-delegation.jpg', alt: 'U.S. Delegation Visit', caption: 'U.S. Delegation Visit' },
                  { src: '/assets/community/codesprint-11.jpg', alt: 'CodeSprint 11', caption: 'CodeSprint 11' },
                ].map(({ feature, ...photo }) => (
                  <div key={photo.src} className={feature ? 'md:col-span-2 md:row-span-2 md:h-full' : undefined}>
                    <GalleryPhoto {...photo} fill={feature} />
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <a
                  href={`${COMMUNITY_URL}/blob/main/events/media-coverage.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#3d7e93] hover:underline"
                >
                  See the full photo archive →
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* ── WORKSHOPS ── */}
        <section id="workshops" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              badge="Workshops"
              title="Hands-on sessions across our stack"
              subtitle="AI, Cloud, and Blockchain (Algorand & Solana), plus developer bootcamps and technical talks."
            />
            <div className="grid sm:grid-cols-2 gap-6">
              <EventCard
                title="Algorand Foundation Workshop"
                result="AlgoKit 3.0 · 100+ students trained"
                href={`${COMMUNITY_URL}/blob/main/events/algorand-workshop.md`}
              />
              <EventCard
                title="Solana Community Event"
                result="Solana ecosystem & Web3 introduction"
                href={`${COMMUNITY_URL}/blob/main/events/solana-workshop.md`}
              />
            </div>
          </div>
        </section>

        {/* ── EVENTS ── */}
        <section id="events" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-6xl mx-auto">
            <SectionHeading
              badge="Events"
              title="Hackathons, meetups, and milestones"
              subtitle="Every event has a full write-up — overview, impact, gallery, and team — documented in the open."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <EventCard
                title="VisioNEX Hackathon 2"
                result="500+ students · 40+ schools"
                href={`${COMMUNITY_URL}/blob/main/events/visionex-hackathon-2.md`}
              />
              <EventCard
                title="VisioNEX Hackathon 1"
                result="Flagship launch edition"
                href={`${COMMUNITY_URL}/blob/main/events/visionex-hackathon-1.md`}
              />
              <EventCard
                title="CuttingEdge 2026 PROJEXPO IIT"
                result="Best SDGP Community & Project"
                href={`${COMMUNITY_URL}/blob/main/events/cuttingedge-2026.md`}
              />
              <EventCard
                title="Hult Prize IIT"
                result="Finalist"
                href={`${COMMUNITY_URL}/blob/main/events/hult-prize.md`}
              />
              <EventCard
                title="U.S. Delegation Visit"
                result="University of Oklahoma"
                href={`${COMMUNITY_URL}/blob/main/events/us-delegation.md`}
                newsHref="/news/u-s-delegation-visit-from-the-university-of-oklahoma"
              />
              <EventCard
                title="NIA Innovation Voucher Programme"
                result="Selected"
                href={`${COMMUNITY_URL}/blob/main/events/nia-innovation-voucher.md`}
                newsHref="/news/team-sotercare-selected-as-a-finalist-in-the-nia-innovation-voucher-programme-2026"
              />
              <EventCard
                title="CodeSprint 11"
                result="Finalist"
                href={`${COMMUNITY_URL}/blob/main/events/codesprint-11.md`}
                newsHref="/news/team-sotercare-named-a-finalist-at-codesprint-11"
              />
            </div>
            <div className="text-center mt-8">
              <a
                href={`${COMMUNITY_URL}/tree/main/events`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#3d7e93] hover:underline"
              >
                See every event on GitHub →
              </a>
            </div>
          </div>
        </section>

        {/* ── OPEN SOURCE ── */}
        <section id="open-source" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              badge="Open Source"
              title="Open source is how we learn"
              subtitle="We maintain beginner-friendly issues across our repositories, and every contribution — code, docs, or design — is credited."
            />
            <div className="grid sm:grid-cols-3 gap-6">
              <LinkCard
                Icon={GitPullRequest}
                title="First Contribution Guide"
                desc="A step-by-step walkthrough from fork to your first merged pull request."
                href={`${COMMUNITY_URL}/blob/main/guides/first-contribution.md`}
              />
              <LinkCard
                Icon={BookOpen}
                title="Open Source Contribution Guide"
                desc="Issues, PRs, reviews, and etiquette — going deeper once you've made your first PR."
                href={`${COMMUNITY_URL}/blob/main/guides/open-source-contribution-guide.md`}
              />
              <LinkCard
                Icon={Sparkles}
                title="Good First Issues"
                desc="Beginner-friendly, scoped tasks reserved for newcomers across SoterCare's repos."
                href="https://github.com/search?q=org%3ASoterCare+label%3A%22good+first+issue%22+state%3Aopen&type=issues"
              />
            </div>
          </div>
        </section>

        {/* ── COMMUNITY PROJECTS ── */}
        <section id="projects" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              badge="Community Projects"
              title="Built and maintained in the open"
              subtitle="Real, ongoing projects this community owns — not just the product SoterCare ships."
            />
            <div className="grid sm:grid-cols-2 gap-6">
              <LinkCard
                Icon={FolderGit2}
                title="community"
                desc="Events, guides, templates, and everything the community maintains together."
                href={COMMUNITY_URL}
              />
              <LinkCard
                Icon={Rocket}
                title="awesome-student-resources"
                desc="A curated, categorized catalog of free learning resources and student opportunities."
                href={RESOURCES_URL}
              />
            </div>
          </div>
        </section>

        {/* ── LEARNING RESOURCES ── */}
        <section id="resources" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              badge="Learning Resources"
              title="Free, curated, and topic-organized"
              subtitle="9 categories covering programming, cloud, AI, blockchain, careers, and student opportunities."
            />
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Programming',
                'Web Development',
                'Artificial Intelligence',
                'Cloud',
                'Blockchain',
                'Open Source',
                'Hackathons',
                'Careers',
                'Student Programs',
              ].map((cat) => (
                <span
                  key={cat}
                  className="bg-bg-card px-5 py-2.5 rounded-full shadow-sm border border-black/5 text-sm font-semibold text-text"
                >
                  {cat}
                </span>
              ))}
            </div>
            <div className="text-center mt-8">
              <a
                href={RESOURCES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#3d7e93] hover:underline"
              >
                Browse all resources on GitHub →
              </a>
            </div>
          </div>
        </section>

        {/* ── PARTNERS ── */}
        <section id="partners" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              badge="Partners"
              title="Communities we build alongside"
              subtitle="We collaborate with foundations, student organizations, and technology communities to deliver workshops, hackathons, and open-source initiatives. These are community collaborations — not corporate sponsorships or official endorsements."
            />
            <div className="flex flex-wrap justify-center gap-4 md:gap-5">
              <PartnerCard name="Nexus Spring of Code" logo="/assets/partners/nsoc-logo.png" />
              <PartnerCard name="Algorand Foundation" logo="/assets/partners/algorand-logo.png" />
              <PartnerCard name="Solana Community" logo="/assets/partners/solana-logo.png" dark />
              <PartnerCard name="GirlScript Summer of Code" logo="/assets/partners/gssoc-logo.png" />
              <PartnerCard name="IEEE" logo="/assets/partners/ieee-logo.svg" />
              <PartnerCard name="AWS Student Community at IIT" logo="/assets/partners/aws-logo.svg" />
              <PartnerCard name="Informatics Institute of Technology" logo="/assets/partners/iit-logo.png" />
            </div>
          </div>
        </section>

        {/* ── GITHUB ── */}
        <section id="github" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              badge="GitHub"
              title="GitHub is central to how we work"
              subtitle="Documentation, planning, issues, and pull requests — everything version-controlled and public."
            />
            <div className="grid sm:grid-cols-2 gap-6">
              <LinkCard
                Icon={Github}
                title="GitHub Organization"
                desc="github.com/SoterCare — every public repository the community and product maintain."
                href={ORG_URL}
              />
              <LinkCard
                Icon={FolderGit2}
                title="Community Repository"
                desc="Events, guides, templates, and the source of everything on this page."
                href={COMMUNITY_URL}
              />
              <LinkCard
                Icon={BookOpen}
                title="Student Resources"
                desc="A free, curated catalog across 9 categories for students learning to build."
                href={RESOURCES_URL}
              />
              <LinkCard
                Icon={GitPullRequest}
                title="Contributing Guide"
                desc="How to contribute — first-timers especially welcome, no experience required."
                href={`${COMMUNITY_URL}/blob/main/CONTRIBUTING.md`}
              />
            </div>
          </div>
        </section>

        {/* ── JOIN US ── */}
        <section id="join" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center bg-bg-card rounded-[2rem] md:rounded-[2.5rem] shadow-m p-8 md:p-14">
            <Badge>Join Us</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mt-6 mb-4 leading-tight">
              No application. Just show up.
            </h2>
            <p className="text-base md:text-lg text-text-muted leading-relaxed mb-8 max-w-xl mx-auto">
              Star the repo, say hello in Discussions, come to an event, or open your first pull
              request — any of these makes you a member.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-left mb-8">
              {[
                { Icon: Users, text: 'Star and watch the community repository' },
                { Icon: MessageSquare, text: 'Introduce yourself in Discussions' },
                { Icon: Trophy, text: 'Come to a workshop or hackathon' },
                { Icon: GraduationCap, text: 'Make your first contribution' },
              ].map((step) => (
                <div key={step.text} className="flex items-center gap-3 bg-bg-body/60 rounded-2xl p-4">
                  <step.Icon size={20} className="text-[#3d7e93] flex-shrink-0" />
                  <span className="text-sm md:text-base text-text font-medium">{step.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`${COMMUNITY_URL}/blob/main/JOIN.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-text text-bg-card px-7 py-3.5 rounded-full font-bold text-base hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                Read the Join Guide
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href={`${COMMUNITY_URL}/discussions`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-bg-body text-text px-7 py-3.5 rounded-full font-bold text-base shadow-m hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Open Discussions
              </a>
            </div>
          </div>
        </section>

        <FooterSimple />
      </div>
    </main>
  );
}
