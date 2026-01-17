"use client";

import { useRef } from 'react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ReactLenis, useLenis } from 'lenis/react';

import Navbar from '@/components/Navbar';
import SplashScreen from '@/components/SplashScreen';
import Hero from '@/components/Hero';
import Mission from '@/components/Mission';
import Product from '@/components/Product';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Team from '@/components/Team';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-foreground selection:bg-blue-100 selection:text-blue-900">
      <SplashScreen />
      <Navbar />
      <Hero />
      <Mission />
      <Product />
      <Features />
      <Pricing />
      <FAQ />
      <Team />
      <Footer />
    </main>
  );
}
