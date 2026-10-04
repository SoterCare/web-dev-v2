import React from "react";

interface SectionHeaderProps {
  chip: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

const SectionHeader = ({ chip, title, subtitle }: SectionHeaderProps) => (
  <div className="text-center mb-10 md:mb-14 flex flex-col items-center">
    <span className="bg-bg-card px-8 md:px-10 py-2 md:py-3 rounded-[2rem] shadow-m text-sm md:text-base font-bold uppercase tracking-widest text-foreground/60 mb-4 w-fit">
      {chip}
    </span>
    <h2 className="text-4xl md:text-6xl font-bold tracking-tight">{title}</h2>
    {subtitle && (
      <p className="mt-4 max-w-2xl text-lg md:text-xl text-text-muted leading-relaxed">{subtitle}</p>
    )}
  </div>
);

export default SectionHeader;
