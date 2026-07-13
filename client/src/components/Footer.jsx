import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0a0d0e] border-t border-white/10 py-16 relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left relative z-10">

        {/* Column 1: Brand & Tagline */}
        <div className="space-y-4">
          <h3 className="font-montserrat font-bold text-xl text-white tracking-tight">
            <span className="text-gradient">Asik.Dev</span>
          </h3>
          <p className="text-sm text-on-surface-variant max-w-xs mx-auto md:mx-0 leading-relaxed">
            Crafting premium, high-performance web applications using the MERN stack. Bridging function and modern design.
          </p>
        </div>

        {/* Column 2: Navigation Links */}
        <div className="space-y-4">
          <h4 className="mono-label text-xs text-tertiary">Quick Navigation</h4>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit mx-auto md:mx-0 uppercase tracking-widest font-mono text-[11px]"
            >
              Back To Top
            </button>
            <button
              onClick={() => handleScrollTo('about')}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit mx-auto md:mx-0 uppercase tracking-widest font-mono text-[11px]"
            >
              About Me
            </button>
            <button
              onClick={() => handleScrollTo('projects')}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit mx-auto md:mx-0 uppercase tracking-widest font-mono text-[11px]"
            >
              Projects
            </button>
            <button
              onClick={() => handleScrollTo('skills')}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit mx-auto md:mx-0 uppercase tracking-widest font-mono text-[11px]"
            >
              Skills
            </button>
            <button
              onClick={() => handleScrollTo('contact')}
              className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit mx-auto md:mx-0 uppercase tracking-widest font-mono text-[11px]"
            >
              Contact
            </button>
            <Link
              to="/admin/login"
              className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 w-fit mx-auto md:mx-0 uppercase tracking-widest font-mono text-[11px]"
            >
              Admin Panel
            </Link>
          </div>
        </div>

        {/* Column 3: Social Links */}
        <div className="space-y-4">
          <h4 className="mono-label text-xs text-tertiary">Connect With Me</h4>
          <div className="flex justify-center md:justify-start gap-4">
            <a
              href="https://www.linkedin.com/in/mohamed-asik-k-487a762a0/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full bg-surface-container border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-350 hover:scale-110"
            >
              <i className="fab fa-linkedin-in text-lg" />
            </a>
            <a
              href="https://github.com/MohamedAsik-2004"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-10 h-10 rounded-full bg-surface-container border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-350 hover:scale-110"
            >
              <i className="fab fa-github text-lg" />
            </a>
            <a
              href="https://www.instagram.com/rx_asik_ttp/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-surface-container border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-350 hover:scale-110"
            >
              <i className="fab fa-instagram text-lg" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-10 h-10 rounded-full bg-surface-container border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-350 hover:scale-110"
            >
              <i className="fab fa-youtube text-lg" />
            </a>
          </div>
        </div>

      </div>

      {/* Copyright footer bar */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-on-surface-variant/60 font-mono tracking-wide">
          © {currentYear} Asik.Dev. All rights reserved.
        </p>
        <div className="flex gap-4 items-center">
          <p className="text-xs text-on-surface-variant/40 font-mono">
            Handcrafted in Chennai, Tamil Nadu.
          </p>
          <span className="text-on-surface-variant/20 font-mono text-xs">|</span>
          <Link to="/admin/login" className="text-xs text-on-surface-variant/40 hover:text-primary transition-colors duration-300 font-mono">
            Admin Area
          </Link>
        </div>
      </div>

    </footer>
  );
}
