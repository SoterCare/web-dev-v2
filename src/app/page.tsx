import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import ContactForm from '@/components/ContactForm';
import BlogSection from '@/components/BlogSection';
import Newsletter from '@/components/Newsletter';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <ContactForm />
      <BlogSection />
      <Newsletter />
      <FAQ />
      <Footer />
    </main>
  );
}
