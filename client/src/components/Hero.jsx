import React from 'react';
import { useParallaxScroll } from '../hooks/useParallaxScroll';
import { useMouseParallax } from '../hooks/useMouseParallax';

export default function Hero({ profile }) {
  // Parallax animation layers
  const bgRef = useParallaxScroll(0.2);      // Slowest layer
  const midRef = useParallaxScroll(0.5);     // Medium layer
  const contentRef = useParallaxScroll(0.8); // Fastest layer

  // Mouse tracking parallax for the background orbs
  const mouseOrbRef = useMouseParallax(0.05);

  const nameParts = profile?.name ? profile.name.trim().split(/\s+/) : ['Mohamed', 'Asik', 'K'];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const tagline = profile?.tagline || 'Flutter Developer';
  const taglineParts = tagline.trim().split(/\s+/);
  const taglineFirst = taglineParts.slice(0, Math.ceil(taglineParts.length / 2)).join(' ');
  const taglineSecond = taglineParts.slice(Math.ceil(taglineParts.length / 2)).join(' ');

  const heroPhotoUrl = profile?.heroPhoto
    ? (profile.heroPhoto.startsWith('http') ? profile.heroPhoto : `http://localhost:5000${profile.heroPhoto}`)
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=500&h=500&q=80';

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-background flex items-center pt-24 md:pt-0">

      {/* Parallax Layer 1: Slowest - Background Radial Glow Orbs */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 pointer-events-none will-change-transform"
      >
        <div
          ref={mouseOrbRef}
          className="absolute inset-0 w-full h-full"
        >
          {/* Top Left Orb */}
          <div className="absolute top-[-100px] left-[-100px] md:top-[-200px] md:left-[-200px] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full radial-glow pointer-events-none blur-3xl opacity-40 animate-pulse" />
          {/* Bottom Right Orb */}
          <div className="absolute bottom-[-150px] right-[-150px] md:bottom-[-200px] md:right-[-200px] w-[400px] h-[400px] md:w-[800px] md:h-[800px] rounded-full radial-glow pointer-events-none blur-3xl opacity-40" />
        </div>
      </div>

      {/* Parallax Layer 2: Medium - Social Sidebar Fixed Left */}
      <div
        ref={midRef}
        className="absolute left-6 top-1/3 z-20 flex flex-col gap-6 will-change-transform"
      >
        <a
          href="https://www.linkedin.com/in/mohamed-asik-k-487a762a0/"
          target="_blank"
          aria-label="LinkedIn"
          rel="noopener noreferrer"
          className="text-on-surface-variant hover:text-primary transition-all duration-300 text-xl hover:scale-125"
        >
          <i className="fab fa-linkedin-in"></i>
        </a>
        <a
          href="https://github.com/MohamedAsik-2004"
          target="_blank"
          aria-label="GitHub"
          rel="noopener noreferrer"
          className="text-on-surface-variant hover:text-primary transition-all duration-350 text-xl hover:scale-125"
        >
          <i className="fab fa-github"></i>
        </a>
        <a
          href="https://www.instagram.com/rx_asik_ttp/?hl=en"
          target="_blank"
          aria-label="Instagram"
          rel="noopener noreferrer"
          className="text-on-surface-variant hover:text-primary transition-all duration-300 text-xl hover:scale-125"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <div className="w-[1px] h-20 bg-outline-variant mx-auto mt-2" />
      </div>

      {/* Parallax Layer 3: Fastest - 12-Column Grid Content */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 md:py-0 will-change-transform"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-center md:text-left">

          {/* Left Column (4): Name & Sub-greeting */}
          <div className="md:col-span-4 flex flex-col justify-center relative z-10 pr-2">
            <span className="mono-label text-primary mb-3 text-sm md:text-base font-semibold">Hello, I'm</span>
            <h1 className="display-heading text-white font-bold leading-tight">
              {firstName}
              {lastName && (
                <>
                  <br />
                  <span className="text-on-surface font-light">{lastName}</span>
                </>
              )}
            </h1>
          </div>

          {/* Center Column (4): Hero Photo and Accent Halo */}
          <div className="md:col-span-4 flex justify-center items-end relative h-[380px] md:h-[500px]">
            {/* Glowing purple radial background positioned exactly behind */}
            <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full bg-[#6C25FF]/25 blur-[80px] -translate-y-8 pointer-events-none z-0" />

            <img
              src={heroPhotoUrl}
              alt={profile?.name || "Profile cutout"}
              className="h-full max-h-[360px] md:max-h-[480px] w-auto object-contain pointer-events-none select-none relative z-10"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=500&h=500&q=80';
              }}
            />
          </div>

          {/* Right Column (4): Role Title with Ghost Copy */}
          <div className="md:col-span-4 flex flex-col justify-center relative mt-6 md:mt-0 z-10">
            <span className="mono-label text-primary mb-3 text-sm md:text-base font-semibold">Creative</span>

            <div className="relative">
              <h2 className="display-heading text-white relative z-10 font-bold leading-none">
                <span className="text-gradient leading-none block">{taglineFirst}</span>
                {taglineSecond && (
                  <span className="text-white leading-none block mt-1">{taglineSecond}</span>
                )}
              </h2>
              {/* Ghost duplicate text overlay */}
              <div
                className="absolute top-2 left-2 w-full select-none pointer-events-none opacity-10 leading-none font-extrabold text-[40px] md:text-[72px] font-montserrat hidden md:block"
                style={{
                  WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.25)',
                  color: 'transparent'
                }}
              >
                {taglineFirst}
                {taglineSecond && (
                  <>
                    <br />
                    {taglineSecond}
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
