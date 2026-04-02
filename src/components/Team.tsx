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
    // itemWidth = width of one card + gap (gap-x-6 = 24px)
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
      {/* Dotted Background removed (global) */}

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
          className="flex overflow-x-auto snap-x snap-mandatory pt-12 md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 pb-8 slim-scroll md:overflow-visible"
        >
          {TEAM_MEMBERS.map((member, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center group snap-center w-[85vw] sm:w-[60vw] flex-shrink-0 md:w-auto"
            >
              {/* Image Container - Floating above */}
              <div className="relative z-20 w-64 -mb-6 transition-transform duration-300 h-80 group-hover:scale-105 group-hover:-translate-y-2">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={300}
                  height={400}
                  className="object-cover object-top w-full h-full transition-opacity opacity-90 group-hover:opacity-100"
                />
              </div>

              {/* Info Card - The "Bar" */}
              <div className="relative z-10 w-full overflow-hidden transition-all duration-300 border shadow-md bg-bg-card rounded-2xl border-black/5 group-hover:shadow-xl group-hover:ring-1 group-hover:ring-black/5">
                {/* Name Bar (Always visible) */}
                <div className="p-6 pt-10 text-center">
                  <h3 className="text-2xl font-bold text-[#a0cbdb]">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-text-muted">
                    {member.role}
                  </p>
                </div>

                {/* Expanded Details (Revealed on Hover) */}
                <div className="transition-all duration-500 ease-in-out opacity-0 max-h-0 group-hover:max-h-60 group-hover:opacity-100 bg-bg-panel/50">
                  <div className="flex flex-col items-center gap-4 p-6 pt-2 border-t border-black/5">
                    {/* Contributions */}
                    <p className="text-[11px] font-medium text-foreground/60 text-center leading-relaxed">
                      {/* Using member as any here temporarily because TS might warn without type definition change */}
                      {(member as any).contributions.join(", ")}
                    </p>

                    <a
                      href={`mailto:${member.email}`}
                      className="text-s text-text-muted hover:text-foreground transition-colors flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/50 border border-black/5"
                    >
                      <Mail size={12} />
                      {member.email}
                    </a>

                    {/* Socials */}
                    <div className="flex items-center gap-4 pt-1">
                      <a
                        href={member.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on GitHub`}
                        className="p-2 bg-white rounded-full text-foreground/70 hover:text-black hover:scale-110 transition-all shadow-sm"
                      >
                        <Github size={18} />
                      </a>
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                        className="p-2 transition-all bg-white rounded-full shadow-sm text-foreground/70 hover:text-blue-600 hover:scale-110"
                      >
                        <Linkedin size={18} />
                      </a>
                      <a
                        href={member.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on Instagram`}
                        className="p-2 transition-all bg-white rounded-full shadow-sm text-foreground/70 hover:text-pink-600 hover:scale-110"
                      >
                        <Instagram size={18} />
                      </a>
                      {member.socials.website && (
                        <a
                          href={member.socials.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name}'s personal website`}
                          className="p-2 transition-all bg-white rounded-full shadow-sm text-foreground/70 hover:text-blue-500 hover:scale-110"
                        >
                          <Globe size={18} />
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
