import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Github, Linkedin, Instagram } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TEAM_MEMBERS = [
    {
        name: 'Daham Dissanayake',
        role: 'Team Lead / IoT Sub Lead',
        skills: ['JavaScript', 'React', 'Python', 'C++', 'Figma', 'MySQL', 'Git', 'Adobe Creative Cloud'],
        image: '/assets/team/Daham.png',
        socials: {
            github: 'https://github.com/DahamDissanayake/',
            linkedin: 'https://www.linkedin.com/in/daham-dissanayake/',
            instagram: 'https://www.instagram.com/dhmdissanayake/'
        }
    },
    {
        name: 'Sanjula Herath',
        role: 'SysInt & Testing Sub Lead',
        skills: ['Rust', 'Python', 'Go', 'gRPC', 'Javascript', 'Java'],
        image: '/assets/team/Sanjula.png',
        socials: {
            github: 'https://github.com/sanjulaonline',
            linkedin: 'https://www.linkedin.com/in/sanjulaherath/',
            instagram: 'https://www.instagram.com/s_njula._.xz./'
        }
    },
    {
        name: 'Kanchana Wickramarathna',
        role: 'ML/ALGO Sub Lead',
        skills: ['Python', 'Java', 'React', 'Nextjs', 'OpenAI', 'LangGraph', 'LlamaIndex', 'Helicone'],
        image: '/assets/team/Kanchana.png',
        socials: {
            github: 'https://github.com/kaweeshakanchana',
            linkedin: 'https://www.linkedin.com/in/kaweesha-kanchana-228729398/',
            instagram: 'https://www.instagram.com/kaweesha_kanchana/'
        }
    },
    {
        name: 'Komudi Senarachchi',
        role: 'UI/UX Sub Lead',
        skills: ['Figma', 'Java', 'JavaScript', 'Python', 'C#', 'Nextjs', 'React'],
        image: '/assets/team/Komudi.png',
        socials: {
            github: 'https://github.com/KomuDhara',
            linkedin: 'https://www.linkedin.com/in/komudi-senarachchi-3bba102ba/',
            instagram: 'https://www.instagram.com/komu_dhara'
        }
    },
    {
        name: 'Nimna Solaman',
        role: 'Documentation Sub Lead',
        skills: ['Java', 'Python', 'React', 'Nextjs'],
        image: '/assets/team/Nimna.png',
        socials: {
            github: 'https://github.com/nimnaahh',
            linkedin: 'https://www.linkedin.com/in/nimna-minsadi-212454296/',
            instagram: 'https://www.instagram.com/tbh_idk_006/'
        }
    },
    {
        name: 'Hirusha Maduranga',
        role: 'Mobile Dev Sub Lead',
        skills: ['Java', 'Python', 'React', 'Nextjs' , 'Javascript'],
        image: '/assets/team/Hirusha.png',
        socials: {
            github: 'https://github.com/hirushaMaduranga',
            linkedin: 'https://www.linkedin.com/in/hirusha-pathum-maduranga-889845375/',
            instagram: 'https://www.instagram.com/__h_i_r_u__official'
        }
    }
];

const Team = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(contentRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                    onEnter: () => localStorage.setItem('team-animated', 'true')
                }
            }
        );
    }, { scope: sectionRef });

    return (
        <section id="team" ref={sectionRef} className="relative z-10 pt-24 pb-24 overflow-hidden bg-transparent md:pt-32">
            {/* Dotted Background removed (global) */}

            <div ref={contentRef} className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 text-center">
                    <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-m border-none text-base font-bold uppercase tracking-widest text-foreground/60 mx-auto w-fit">
                        Our Team
                    </span>
                    <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
                        Meet the Minds Behind SoterCare
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-text-muted">
                        We are a passionate group of developers, designers, and engineers dedicated to transforming elderly care through innovative technology.
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 pt-12 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {TEAM_MEMBERS.map((member, index) => (
                        <div key={index} className="relative flex flex-col items-center group">
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
                                    <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                                    <p className="mt-1 text-sm font-medium tracking-wider uppercase text-text-muted">{member.role}</p>
                                </div>

                                {/* Expanded Details (Revealed on Hover) */}
                                <div className="transition-all duration-500 ease-in-out opacity-0 max-h-0 group-hover:max-h-60 group-hover:opacity-100 bg-bg-panel/50">
                                    <div className="flex flex-col items-center gap-4 p-6 pt-2 border-t border-black/5">
                                        {/* Skills */}
                                        <p className="text-[10px] font-medium text-foreground/50 tracking-widest text-center">
                                            {member.skills.join(', ')}
                                        </p>

                                        {/* Socials */}
                                        <div className="flex items-center gap-4 pt-2">
                                            <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="p-2 transition-all bg-white rounded-full shadow-sm text-foreground/70 hover:text-black hover:scale-110">
                                                <Github size={18} />
                                            </a>
                                            <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 transition-all bg-white rounded-full shadow-sm text-foreground/70 hover:text-blue-600 hover:scale-110">
                                                <Linkedin size={18} />
                                            </a>
                                            <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 transition-all bg-white rounded-full shadow-sm text-foreground/70 hover:text-pink-600 hover:scale-110">
                                                <Instagram size={18} />
                                            </a>
                                        </div>
                                    </div>
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
