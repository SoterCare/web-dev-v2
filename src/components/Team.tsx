import React from 'react';
import Image from 'next/image';
import { Github, Linkedin, Instagram } from 'lucide-react';

const TEAM_MEMBERS = [
    {
        name: 'Daham Dissanayake',
        role: 'Full Stack Developer',
        skills: ['React', 'Next.js', 'Node.js'],
        image: '/assets/team/daham-pic.png',
        socials: {
            github: '#',
            linkedin: '#',
            instagram: '#'
        }
    },
    {
        name: 'Member Name',
        role: 'UI/UX Designer',
        skills: ['Figma', 'Adobe XD', 'Prototyping'],
        image: '/assets/team/member2.png',
        socials: {
            github: '#',
            linkedin: '#',
            instagram: '#'
        }
    },
    {
        name: 'Member Name',
        role: 'IoT Specialist',
        skills: ['C++', 'Arduino', 'Python'],
        image: '/assets/team/member3.png',
        socials: {
            github: '#',
            linkedin: '#',
            instagram: '#'
        }
    },
    {
        name: 'Member Name',
        role: 'AI Engineer',
        skills: ['TensorFlow', 'PyTorch', 'Data Analysis'],
        image: '/assets/team/member4.png',
        socials: {
            github: '#',
            linkedin: '#',
            instagram: '#'
        }
    },
    {
        name: 'Member Name',
        role: 'Backend Developer',
        skills: ['Express', 'MongoDB', 'SQL'],
        image: '/assets/team/member5.png',
        socials: {
            github: '#',
            linkedin: '#',
            instagram: '#'
        }
    },
    {
        name: 'Member Name',
        role: 'Frontend Developer',
        skills: ['Tailwind', 'TypeScript', 'React'],
        image: '/assets/team/member6.png',
        socials: {
            github: '#',
            linkedin: '#',
            instagram: '#'
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
                <div className="text-center mb-24">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24 pt-12">
                    {TEAM_MEMBERS.map((member, index) => (
                        <div key={index} className="group relative flex flex-col items-center">
                            {/* Image Container - Floating above */}
                            <div className="relative z-20 -mb-6 w-48 h-56 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-2">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    width={200}
                                    height={240}
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
                                            <a href={member.socials.github} className="p-2 bg-white rounded-full text-foreground/70 hover:text-black hover:scale-110 transition-all shadow-sm">
                                                <Github size={18} />
                                            </a>
                                            <a href={member.socials.linkedin} className="p-2 bg-white rounded-full text-foreground/70 hover:text-blue-600 hover:scale-110 transition-all shadow-sm">
                                                <Linkedin size={18} />
                                            </a>
                                            <a href={member.socials.instagram} className="p-2 bg-white rounded-full text-foreground/70 hover:text-pink-600 hover:scale-110 transition-all shadow-sm">
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
