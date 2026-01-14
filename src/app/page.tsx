"use client";

import { useRef } from 'react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ReactLenis, useLenis } from 'lenis/react';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import ContactForm from '@/components/ContactForm';
import Newsletter from '@/components/Newsletter';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  const lenis = useLenis(({scroll}) =>{});
  return (
    <ReactLenis root> 
    <main className="min-h-screen bg-[#fafafa] text-foreground selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <Hero />
      <Mission />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
    </ReactLenis>
  );
}
