import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ profile }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 10) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id) => {
    setIsMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const resumeUrl = profile?.resumePath
    ? (profile.resumePath.startsWith('http') ? profile.resumePath : `http://localhost:5000${profile.resumePath}`)
    : 'http://localhost:5000/uploads/resume/resume.pdf';

  const menuItems = [
    { label: 'About Me', target: 'about' },
    { label: 'Projects', target: 'projects' },
    { label: 'Contact', target: 'contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20 py-4'
          : 'bg-transparent py-6 border-b border-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-montserrat font-bold text-2xl tracking-tight text-white hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span className="text-gradient">Asik.Dev</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.target}
                onClick={() => handleScrollTo(item.target)}
                className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase duration-300"
              >
                {item.label}
              </button>
            ))}

            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 text-sm font-medium tracking-wide uppercase"
            >
              Resume
            </a>
          </div>

          {/* Hamburger Icon */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-on-surface hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="h-6 w-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileOpen ? (
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.83 4.828 4.829z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl flex flex-col justify-center items-center md:hidden"
          >
            <div className="flex flex-col items-center gap-8">
              {menuItems.map((item) => (
                <button
                  key={item.target}
                  onClick={() => handleScrollTo(item.target)}
                  className="text-2xl font-semibold tracking-wide uppercase text-on-surface hover:text-primary transition-colors"
                >
                  {item.label}
                </button>
              ))}

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileOpen(false)}
                className="mt-4 px-10 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 text-lg font-medium tracking-wide uppercase"
              >
                Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
