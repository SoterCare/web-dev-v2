import React from 'react';
import Image from 'next/image';
import { Github, Linkedin, Instagram } from 'lucide-react';

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
        role: 'ML and ALGO Dev Sub Lead',
        skills: ['Java', 'Python', 'Langchain', 'LangGraph'],
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
        skills: ['Java', 'Python', 'React', 'Nextjs'],
        image: '/assets/team/Hirusha.png',
        socials: {
            github: 'https://github.com/hirushaMaduranga',
            linkedin: 'https://www.linkedin.com/in/hirusha-pathum-maduranga-889845375/',
            instagram: 'https://www.instagram.com/__h_i_r_u__official'
        }
    }
];

const Team = () => {
    return (
        <section id="team" className="py-24 bg-bg-body relative z-10 overflow-hidden">
            {/* Dotted Background similar to other sections */}
            <div className="absolute inset-0 z-0 h-[120%] w-full bg-[radial-gradient(#e5e7eb_2px,transparent_1px)] [background-size:32px_32px] -top-[10%]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-6">
                    <span className="bg-bg-card px-10 py-3 rounded-[2rem] flex items-center justify-center mb-4 shadow-sm border-none text-xs font-bold uppercase tracking-widest text-foreground/60 mx-auto w-fit">
                        Our Team
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Meet the Minds Behind SoterCare
                    </h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        We are a passionate group of developers, designers, and engineers dedicated to transforming elderly care through innovative technology.
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 pt-12">
                    {TEAM_MEMBERS.map((member, index) => (
                        <div key={index} className="group relative flex flex-col items-center">
                            {/* Image Container - Floating above */}
                            <div className="relative z-20 -mb-6 w-64 h-80 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    width={300}
                                    height={400}
                                    className="object-cover object-top w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                            </div>

                            {/* Info Card - The "Bar" */}
                            <div className="relative z-10 w-full bg-bg-card rounded-2xl shadow-md border border-black/5 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:ring-1 group-hover:ring-black/5">
                                {/* Name Bar (Always visible) */}
                                <div className="p-6 text-center pt-10">
                                    <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                                    <p className="text-sm text-text-muted font-medium uppercase tracking-wider mt-1">{member.role}</p>
                                </div>

                                {/* Expanded Details (Revealed on Hover) */}
                                <div className="max-h-0 opacity-0 group-hover:max-h-60 group-hover:opacity-100 transition-all duration-500 ease-in-out bg-bg-panel/50">
                                    <div className="p-6 pt-2 border-t border-black/5 flex flex-col items-center gap-4">
                                        {/* Skills */}
                                        <p className="text-[10px] font-medium text-foreground/50 tracking-widest text-center">
                                            {member.skills.join(', ')}
                                        </p>

                                        {/* Socials */}
                                        <div className="flex items-center gap-4 pt-2">
                                            <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-foreground/70 hover:text-black hover:scale-110 transition-all shadow-sm">
                                                <Github size={18} />
                                            </a>
                                            <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-foreground/70 hover:text-blue-600 hover:scale-110 transition-all shadow-sm">
                                                <Linkedin size={18} />
                                            </a>
                                            <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white rounded-full text-foreground/70 hover:text-pink-600 hover:scale-110 transition-all shadow-sm">
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
