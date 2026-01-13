import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-transparent pt-20 border-t border-white/50 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-text tracking-tight">
                SmartCare
              </span>
            </Link>
            <p className="leading-relaxed font-light">
              Advanced health monitoring solutions for elderly care, providing peace of mind to families worldwide.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-card text-text-muted hover:text-text hover:bg-bg-panel transition-all shadow-m hover:-translate-y-0.5">
                   <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-tight">Support</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-muted hover:text-foreground transition-colors font-medium text-sm">Help Center</Link></li>
              <li><Link href="#" className="text-muted hover:text-foreground transition-colors font-medium text-sm">Safety Information</Link></li>
              <li><Link href="#" className="text-muted hover:text-foreground transition-colors font-medium text-sm">Cancellation Options</Link></li>
              <li><Link href="#" className="text-muted hover:text-foreground transition-colors font-medium text-sm">Report Issue</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-tight">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-muted hover:text-foreground transition-colors font-medium text-sm">About us</Link></li>
              <li><Link href="#" className="text-muted hover:text-foreground transition-colors font-medium text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted hover:text-foreground transition-colors font-medium text-sm">Community</Link></li>
              <li><Link href="#" className="text-muted hover:text-foreground transition-colors font-medium text-sm">Careers</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold text-lg mb-6 tracking-tight">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail size={18} className="text-foreground mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-muted text-sm">support@smartcare.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="text-foreground mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-muted text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="text-foreground mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-muted text-sm">123 Health Ave, Wellness City, WC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 py-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-muted text-sm">
            © {new Date().getFullYear()} SmartCare Systems. All rights reserved.
          </p>
          <div className="flex justify-center md:justify-end space-x-6 mt-4 md:mt-0">
             <Link href="#" className="text-muted hover:text-foreground text-sm font-medium">Terms of Service</Link>
             <Link href="#" className="text-muted hover:text-foreground text-sm font-medium">Privacy Policy</Link>
             <Link href="#" className="text-muted hover:text-foreground text-sm font-medium">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
