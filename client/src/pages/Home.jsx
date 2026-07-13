import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/publicApi';

// Component imports
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col justify-center items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="w-full h-full rounded-full border-[3px] border-primary/10 border-t-primary animate-spin" />
        </div>
        <span className="mono-label text-xs text-primary animate-pulse">
          Loading Portfolio...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col justify-center items-center gap-4 text-center px-6">
        <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-2" />
        <h2 className="headline-heading text-lg text-white">Oops! Fetching Database Failed</h2>
        <p className="text-on-surface-variant max-w-md text-sm">
          We could not resolve connections to the local API service. Please verify database seeding and server operations.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-on-surface selection:bg-primary/30 selection:text-white">
      {/* Absolute top global glowing gradient */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full radial-glow pointer-events-none opacity-30 blur-3xl z-0" />

      {/* Floating navigation bar */}
      <Navbar profile={profile} />

      {/* Sub-sections stacks */}
      <main className="relative z-10">
        <Hero profile={profile} />
        <About profile={profile} />
        <Projects />
        <Skills />
        <Certifications />
        <Contact profile={profile} />
      </main>

      {/* Landing footer */}
      <Footer />
    </div>
  );
}
