import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCertifications } from '../api/publicApi';
import { useInView } from '../hooks/useInView';

export default function Certifications() {
  const { data: certifications, isLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: getCertifications,
  });

  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section 
      ref={ref} 
      id="certifications" 
      className="w-full py-24 bg-background border-t border-white/5 relative overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full radial-glow pointer-events-none opacity-20 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Title Section */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-mono tracking-widest uppercase font-semibold">
              <i className="fas fa-certificate text-[10px]" /> Verified Credentials
            </span>
          </div>
          <h2 className="headline-heading text-white text-3xl md:text-5xl font-extrabold mb-4 font-montserrat">
            Featured <span className="text-gradient">Certifications</span>
          </h2>
          <p className="body-text text-sm md:text-base text-on-surface-variant font-medium">
            A curated selection of my professional credentials and technical qualifications.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-card rounded-2xl p-8 space-y-6 animate-pulse border border-white/5 h-[320px]">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-1/3 bg-surface-container rounded" />
                  <div className="h-8 w-8 bg-surface-container rounded-full" />
                </div>
                <div className="h-8 w-3/4 bg-surface-container rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-1/2 bg-surface-container rounded" />
                  <div className="h-4 w-1/3 bg-surface-container rounded" />
                </div>
                <div className="h-16 w-full bg-surface-container rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certifications?.map((cert, idx) => (
              <div
                key={cert._id}
                className="relative rounded-2xl glass-card p-6 md:p-8 border border-white/5 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between h-full group hover:shadow-xl hover:shadow-primary/5"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.6s ease ${idx * 0.15}s, transform 0.6s ease ${idx * 0.15}s`,
                }}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary font-bold uppercase tracking-wider max-w-[85%] truncate">
                      {cert.issuer}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <i className="fas fa-award text-sm" />
                    </div>
                  </div>

                  <h3 className="font-montserrat font-bold text-lg md:text-xl text-white mt-6 mb-4 group-hover:text-primary transition-colors leading-snug">
                    {cert.title}
                  </h3>

                  <div className="space-y-2 mt-4 text-on-surface-variant font-medium text-xs font-mono">
                    {cert.issueDate && (
                      <div className="flex items-center gap-2">
                        <i className="far fa-calendar-alt text-primary/70 text-xs w-4" />
                        <span>Issued: {cert.issueDate}</span>
                      </div>
                    )}
                    {cert.credentialId && (
                      <div className="flex items-center gap-2">
                        <i className="fas fa-id-card text-primary/70 text-xs w-4" />
                        <span>ID: {cert.credentialId}</span>
                      </div>
                    )}
                  </div>

                  <p className="body-text text-sm text-on-surface-variant mt-6 leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </div>
            ))}
            {(!certifications || certifications.length === 0) && (
              <div className="col-span-full text-center py-12 glass-card rounded-2xl border border-white/5">
                <i className="fas fa-certificate text-3xl text-on-surface-variant mb-3" />
                <p className="text-on-surface-variant text-sm italic">No certifications listed.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
