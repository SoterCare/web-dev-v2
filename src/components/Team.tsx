import React, { useRef } from "react";
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
      "Gait Analysis ML Model",
      "IoT Prototyping",
      "Web Development",
      "Gateway Backend",
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
      "Mobile App",
      "App Backend",
      "Testing & Deployment",
      "Microservices",
    ],
    image: "/assets/team/Sanjula.webp",
    email: "sanjula@sotercare.com",
    socials: {
      github: "https://github.com/sanjulaonline",
      linkedin: "https://www.linkedin.com/in/sanjulaherath/",
      instagram: "https://www.instagram.com/s_njula._.xz./",
      website: "https://www.sanjula.online/",
    },
  },
  {
    name: "Komudi Senarachchi",
    role: "UI/UX Sub Lead",
    contributions: [
      "Mobile UI Design",
      "3D Modelling",
      "Frontend Development",
      "Documentation",
    ],
    image: "/assets/team/Komudi.webp",
    email: "komudi@sotercare.com",
    socials: {
      github: "https://github.com/KomuDhara",
      linkedin: "https://www.linkedin.com/in/komudi-senarachchi-3bba102ba/",
      instagram: "https://www.instagram.com/komu_dhara",
      website: "https://komudidhara-portfolio.vercel.app/",
    },
  },
];

const Team = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
        <div className="mb-12 text-center">
          <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m text-base font-bold uppercase tracking-widest text-text-muted mx-auto w-fit">
            Our Team
          </span>
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Meet the Minds Behind SoterCare
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-text-muted">
            A tight team of developers, designers, and engineers building the
            future of elderly care.
          </p>
        </div>

        {/* Cards — 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {TEAM_MEMBERS.map((member, index) => (
            <div
              key={index}
              className="group bg-bg-card rounded-3xl shadow-m overflow-hidden flex flex-col hover:shadow-xl transition-all duration-500"
            >
              {/* Photo — full picture via object-contain, tinted bg */}
              <div className="relative w-full h-64 bg-[#a0cbdb]/10 group-hover:bg-[#a0cbdb]/15 transition-colors duration-500 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 80vw, 33vw"
                  className="object-contain object-bottom group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
              </div>

              {/* Name + role — always visible */}
              <div className="px-5 pt-4 pb-3">
                <p className="text-sm font-medium text-[#3d7e93] mb-0.5">
                  {member.role}
                </p>
                <h3 className="text-lg font-bold text-text tracking-tight">
                  {member.name}
                </h3>
                <div className="w-7 h-[2px] bg-[#a0cbdb] rounded-full mt-2.5" />
              </div>

              {/* Details — always visible on mobile, reveal on hover on desktop */}
              <div
                className="
                  overflow-hidden transition-all duration-500 ease-out px-5
                  max-h-[200px] opacity-100 pb-5
                  md:max-h-0 md:opacity-0 md:pb-0
                  md:group-hover:max-h-[200px] md:group-hover:opacity-100 md:group-hover:pb-5
                "
              >
                {/* Contribution tags */}
                <div className="flex flex-wrap gap-1.5 mb-3 pt-1">
                  {member.contributions.map((c, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium text-text-muted bg-black/[0.05] px-2.5 py-1 rounded-full"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                {/* Social icons */}
                <div className="flex items-center gap-0.5 pt-3 border-t border-black/[0.06]">
                  <a
                    href={`mailto:${member.email}`}
                    aria-label={`Email ${member.name}`}
                    className="p-2 rounded-xl text-text-muted hover:text-[#3d7e93] hover:bg-[#a0cbdb]/10 transition-all duration-200"
                  >
                    <Mail size={15} />
                  </a>
                  <a
                    href={member.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on GitHub`}
                    className="p-2 rounded-xl text-text-muted hover:text-text hover:bg-black/5 transition-all duration-200"
                  >
                    <Github size={15} />
                  </a>
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="p-2 rounded-xl text-text-muted hover:text-[#0A66C2] hover:bg-black/5 transition-all duration-200"
                  >
                    <Linkedin size={15} />
                  </a>
                  <a
                    href={member.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on Instagram`}
                    className="p-2 rounded-xl text-text-muted hover:text-[#E4405F] hover:bg-black/5 transition-all duration-200"
                  >
                    <Instagram size={15} />
                  </a>
                  {member.socials.website && (
                    <a
                      href={member.socials.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name}'s website`}
                      className="p-2 rounded-xl text-text-muted hover:text-[#3d7e93] hover:bg-[#a0cbdb]/10 transition-all duration-200"
                    >
                      <Globe size={15} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
