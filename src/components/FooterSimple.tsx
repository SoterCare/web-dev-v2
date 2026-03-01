import { Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const FooterSimple = () => {
  return (
    <footer className="relative z-10 mt-16">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="border-t border-black/10 pt-8 pb-8">
          <div className="flex flex-col items-center justify-between gap-6 text-sm md:flex-row text-text-muted">
          {/* Left: Copyright */}
          <div className="text-center md:text-left">
            &copy; {new Date().getFullYear()} SoterCare. | All Rights Reserved.
          </div>

          {/* Middle: Email */}
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-foreground/50" />
            <a
              href="mailto:support@sotercare.com"
              className="transition-colors hover:text-foreground"
            >
              support@sotercare.com
            </a>
          </div>

          {/* Right: Phone + Socials */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-foreground/50" />
              <a
                href="tel:+94704888440"
                className="transition-colors hover:text-foreground"
              >
                +94 70 4888 440
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/sotercare_"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow SoterCare on Instagram"
                className="p-2 transition-colors rounded-full hover:text-foreground hover:bg-black/5"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/sotercare/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with SoterCare on LinkedIn"
                className="p-2 transition-colors rounded-full hover:text-foreground hover:bg-black/5"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSimple;
