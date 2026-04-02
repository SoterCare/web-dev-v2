import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Github, Linkedin, Instagram, Mail, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TEAM_MEMBERS = [
  {
    name: "Daham Dissanayake",
    role: "Team Lead & IoT Sub Lead",
    contributions: [
      "Project Management",
      "Gait Analysis ML Model build",
      "IoT prototyping and soldering",
      "Web site handling",
      "Gateway backend build",
    ],
    image: "/assets/team/Daham.webp",
    email: "daham@sotercare.com",
    socials: {
      github: "https://github.com/DahamDissanayake/",
      linkedin: "https://www.linkedin.com/in/daham-dissanayake/",
      instagram: "https://www.instagram.com/dhmdissanayake/",
      website: "https://daham.serenedge.com/",
    },
  },
  {
    name: "Sanjula Herath",
    role: "Backend & Mobile Sub Lead",
    contributions: [
      "Mobile app building",
      "App backend building",
      "Testing and deployment",
      "Microservices",
    ],
    image: "/assets/team/Sanjula.webp",
    email: "sanjula@sotercare.com",
    socials: {
      github: "https://github.com/sanjulaonline",
      linkedin: "https://www.linkedin.com/in/sanjulaherath/",
      instagram: "https://www.instagram.com/s_njula._.xz./",
      website: "",
    },
  },
  {
    name: "Komudi Senarachchi",
    role: "UI/UX Sub Lead",
    contributions: [
      "Mobile UI Design",
      "3D model building",
      "Mobile app frontend development",
      "Documentation",
    ],
    image: "/assets/team/Komudi.webp",
    email: "komudi@sotercare.com",
    socials: {
      github: "https://github.com/KomuDhara",
      linkedin: "https://www.linkedin.com/in/komudi-senarachchi-3bba102ba/",
      instagram: "https://www.instagram.com/komu_dhara",
      website: "",
    },
  },
  {
    name: "Kanchana Wickramarathna",
    role: "Agent Development",
    contributions: [
      "Agent development",
      "RAG system implementation",
    ],
    image: "/assets/team/Kanchana.webp",
    email: "kanchana@sotercare.com",
    socials: {
      github: "https://github.com/kaweeshakanchana",
      linkedin: "https://www.linkedin.com/in/kaweesha-kanchana-228729398/",
      instagram: "https://www.instagram.com/kaweesha_kanchana/",
      website: "",
    },
  },
  {
    name: "Hirusha Maduranga",
    role: "Mobile Development",
    contributions: [
      "Mobile frontend development",
      "Web SEO",
      "Documentation",
    ],
    image: "/assets/team/Hirusha.webp",
    email: "hirusha@sotercare.com",
    socials: {
      github: "https://github.com/hirushaMaduranga",
      linkedin:
        "https://www.linkedin.com/in/hirusha-pathum-maduranga-889845375/",
      instagram: "https://www.instagram.com/__h_i_r_u__official",
      website: "",
    },
  },
  {
    name: "Nimna Solaman",
    role: "Documentation",
    contributions: ["Documentation"],
    image: "/assets/team/Nimna.webp",
    email: "nimna@sotercare.com",
    socials: {
      github: "https://github.com/nimnaahh",
      linkedin: "https://www.linkedin.com/in/nimna-minsadi-212454296/",
      instagram: "https://www.instagram.com/tbh_idk_006/",
      website: "",
    },
  }
];

const Team = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const itemWidth = scrollRef.current.children[0].clientWidth + 24;
    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  useGSAP(
    () => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
            onEnter: () => localStorage.setItem("team-animated", "true"),
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative z-10 pt-12 md:pt-16 pb-20 md:pb-24 overflow-hidden bg-transparent"
    >
      <div
        ref={contentRef}
        className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m border-none text-base font-bold uppercase tracking-widest text-foreground/60 mx-auto w-fit">
            Our Team
          </span>
          <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Meet the Minds Behind SoterCare
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-text-muted">
            We are a passionate group of developers, designers, and engineers
            dedicated to transforming elderly care through innovative
            technology.
          </p>
        </div>

        {/* Team Grid (Mobile Slider / Desktop Grid) */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory pt-12 md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14 pb-8 slim-scroll md:overflow-visible"
        >
          {TEAM_MEMBERS.map((member, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center group snap-center w-[85vw] sm:w-[60vw] flex-shrink-0 md:w-auto"
            >
              {/* Image Container - Floating above */}
              <div className="relative z-20 w-56 h-72 -mb-8 transition-all duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-3">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={300}
                  height={400}
                  className="object-cover object-top w-full h-full transition-all duration-500 opacity-90 group-hover:opacity-100 drop-shadow-lg"
                />
              </div>

              {/* Info Card */}
              <div className="relative z-10 w-full overflow-hidden transition-all duration-500 ease-out bg-bg-card rounded-3xl shadow-m group-hover:shadow-xl">
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-b from-[#a0cbdb]/5 via-transparent to-transparent rounded-3xl" />

                {/* Name Bar (Always visible) */}
                <div className="relative p-6 pt-12 text-center">
                  <h3 className="text-xl font-bold text-[#a0cbdb] tracking-tight">
                    {member.name}
                  </h3>
                  {/* Decorative accent line */}
                  <div className="mx-auto mt-2.5 mb-2 w-8 h-[2px] rounded-full bg-[#a0cbdb]/30 group-hover:w-12 group-hover:bg-[#a0cbdb]/60 transition-all duration-500" />
                  <p className="text-xs font-medium tracking-wide uppercase text-text-muted/70">
                    {member.role}
                  </p>
                </div>

                {/* Expanded Details (Revealed on Hover) */}
                <div className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 max-h-0 group-hover:max-h-72 group-hover:opacity-100">
                  <div className="flex flex-col items-center gap-4 px-6 pb-6 pt-2">
                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-black/8 to-transparent" />

                    {/* Contributions */}
                    <p className="text-[11px] font-medium text-text-muted/70 text-center leading-relaxed">
                      {member.contributions.join(", ")}
                    </p>

                    {/* Email */}
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium text-text-muted/70 hover:text-[#a0cbdb] transition-colors duration-300 rounded-full bg-bg-panel/60 border border-black/5 hover:border-[#a0cbdb]/20"
                    >
                      <Mail size={14} />
                      {member.email}
                    </a>

                    {/* Socials */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <a
                        href={member.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on GitHub`}
                        className="p-2 rounded-xl bg-bg-panel/80 text-text-muted/60 hover:text-[#333] hover:bg-bg-panel hover:scale-110 transition-all duration-300 border border-transparent hover:border-black/5"
                      >
                        <Github size={16} />
                      </a>
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                        className="p-2 rounded-xl bg-bg-panel/80 text-text-muted/60 hover:text-[#0A66C2] hover:bg-bg-panel hover:scale-110 transition-all duration-300 border border-transparent hover:border-black/5"
                      >
                        <Linkedin size={16} />
                      </a>
                      <a
                        href={member.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on Instagram`}
                        className="p-2 rounded-xl bg-bg-panel/80 text-text-muted/60 hover:text-[#E4405F] hover:bg-bg-panel hover:scale-110 transition-all duration-300 border border-transparent hover:border-black/5"
                      >
                        <Instagram size={16} />
                      </a>
                      {member.socials.website && (
                        <a
                          href={member.socials.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name}'s personal website`}
                          className="p-2 rounded-xl bg-bg-panel/80 text-text-muted/60 hover:text-[#a0cbdb] hover:bg-bg-panel hover:scale-110 transition-all duration-300 border border-transparent hover:border-black/5"
                        >
                          <Globe size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-4 md:hidden pb-4">
          {TEAM_MEMBERS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 bg-[#a0cbdb]" : "w-2 bg-text-muted/30"
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
