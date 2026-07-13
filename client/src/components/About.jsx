import React from 'react';
import { useParallaxScroll } from '../hooks/useParallaxScroll';

export default function About({ profile }) {
  // Parallax section background shifting
  const bgShiftRef = useParallaxScroll(-0.03); // Shifts -30px on scroll based on scroll levels

  const profilePhotoUrl = profile?.profilePhoto
    ? (profile.profilePhoto.startsWith('http') ? profile.profilePhoto : `http://localhost:5000${profile.profilePhoto}`)
    : 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=600&h=800&q=80';

  const handleScrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const resumeUrl = profile?.resumePath
    ? (profile.resumePath.startsWith('http') ? profile.resumePath : `http://localhost:5000${profile.resumePath}`)
    : 'http://localhost:5000/uploads/resume/resume.pdf';

  // Core Tech stack pills
  const coreTech = ['MongoDB', 'Express', 'React', 'Node.js', 'TailwindCSS'];

  return (
    <section id="about" className="relative w-full py-24 bg-background overflow-hidden">

      {/* Background shifting element */}
      <div
        ref={bgShiftRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-5 select-none will-change-transform"
      >
        <div className="absolute top-10 left-10 text-[100px] md:text-[200px] font-extrabold font-montserrat text-white tracking-widest leading-none">
          CREATIVITY
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left Column: Glass Card Image */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-3xl glass-card p-4 overflow-hidden group shadow-2xl">
            <div className="w-full h-full relative rounded-2xl overflow-hidden bg-surface-container">
              <img
                src={profilePhotoUrl}
                alt={`${profile?.name || 'Profile'} Card`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=600&h=800&q=80';
                }}
              />
            </div>

            {/* "Open to Work" Badge Overlay */}
            {profile?.isAvailable && (
              <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-background/80 backdrop-blur-xl border border-primary/30 py-2 px-4 rounded-full shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 absolute" />
                <span className="text-[12px] font-mono tracking-wider font-semibold text-white ml-1">
                  Open to Work
                </span>
                <i className="fas fa-check-circle text-primary text-xs ml-1" />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Descriptions & Actions */}
        <div className="lg:col-span-7 flex flex-col">
          <span className="mono-label text-primary mb-3">About Me</span>
          <h2 className="headline-heading text-white mb-6">
            Creativity
            <br />
            <span className="text-gradient">Is My Passion</span>
          </h2>

          <p className="body-text mb-4 text-on-surface-variant">
            {profile?.bio1 || 'I am a highly motivated Junior Full-Stack Developer specializing in MERN stack. I build robust and elegant interfaces with cutting-edge technologies.'}
          </p>

          <p className="body-text mb-8 text-on-surface-variant">
            {profile?.bio2 || 'I focus on bridging the gap between design and functionality, creating beautiful user experiences that scale seamlessly.'}
          </p>

          {/* Core tech stack pills */}
          <div className="mb-8">
            <h3 className="mono-label text-tertiary mb-3 text-xs">Core Tech Stack</h3>
            <div className="flex flex-wrap gap-2.5">
              {coreTech.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-1.5 rounded-full glass-card border border-white/5 text-sm text-secondary font-medium tracking-wide"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Call to Actions */}
          <div className="flex flex-wrap gap-4">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-full bg-primary text-on-primary font-semibold text-sm tracking-wide uppercase primary-glow hover:bg-white hover:text-background transition-all duration-300"
            >
              Resume PDF
            </a>

            <button
              onClick={handleScrollToContact}
              className="px-8 py-3.5 rounded-full border border-outline-variant text-on-surface hover:border-primary hover:text-primary transition-all duration-300 text-sm font-semibold tracking-wide uppercase"
            >
              Let's Talk
            </button>
          </div>
        </div>

      </div>

    </section>
  );
}
