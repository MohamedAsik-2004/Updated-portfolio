import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSkills } from '../api/publicApi';
import { useInView } from '../hooks/useInView';

export default function Skills() {
  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
  });

  // Activate observer once when section comes into view (threshold 0.2)
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  const frontendSkills = skills ? skills.filter(s => s.category === 'frontend') : [];
  const backendSkills = skills ? skills.filter(s => s.category === 'backend') : [];

  return (
    <section
      ref={ref}
      id="skills"
      className="w-full py-24 bg-background border-t border-white/5 relative overflow-hidden"
    >
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full radial-glow pointer-events-none opacity-20 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Title */}
        <div className="mb-16 text-center md:text-left">
          <span className="mono-label text-primary mb-3">My Capabilities</span>
          <h2 className="headline-heading text-white">
            Technical
            <span className="text-gradient"> Skills</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2].map((grp) => (
              <div key={grp} className="glass-card rounded-2xl p-8 space-y-6">
                <div className="h-6 w-1/3 bg-surface-container rounded animate-pulse mb-6" />
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="space-y-2 animate-pulse">
                      <div className="flex justify-between">
                        <div className="h-4 w-1/4 bg-surface-container rounded" />
                        <div className="h-4 w-8 bg-surface-container rounded" />
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* Frontend Skills Section */}
            <div className="glass-card rounded-2xl p-8 border border-white/5 space-y-6">
              <h3 className="headline-heading text-lg md:text-xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-3">
                <i className="fas fa-laptop-code text-primary" />
                Frontend Skills
              </h3>
              <div className="space-y-6">
                {frontendSkills.map((skill) => (
                  <div key={skill._id} className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="flex items-center gap-2 text-on-surface">
                        <i className={`${skill.iconClass} text-primary w-5 text-center`} />
                        {skill.name}
                      </span>
                      <span className="font-mono text-tertiary">{skill.percentage}%</span>
                    </div>
                    {/* Progress Track */}
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-inverse-primary rounded-full transition-all"
                        style={{
                          width: inView ? `${skill.percentage}%` : '0%',
                          transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                    </div>
                  </div>
                ))}
                {frontendSkills.length === 0 && (
                  <p className="text-on-surface-variant text-sm italic">No frontend skills listed.</p>
                )}
              </div>
            </div>

            {/* Backend Skills Section */}
            <div className="glass-card rounded-2xl p-8 border border-white/5 space-y-6">
              <h3 className="headline-heading text-lg md:text-xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-3">
                <i className="fas fa-server text-primary" />
                Backend Skills
              </h3>
              <div className="space-y-6">
                {backendSkills.map((skill) => (
                  <div key={skill._id} className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="flex items-center gap-2 text-on-surface">
                        <i className={`${skill.iconClass} text-primary w-5 text-center`} />
                        {skill.name}
                      </span>
                      <span className="font-mono text-tertiary">{skill.percentage}%</span>
                    </div>
                    {/* Progress Track */}
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-inverse-primary rounded-full transition-all"
                        style={{
                          width: inView ? `${skill.percentage}%` : '0%',
                          transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                    </div>
                  </div>
                ))}
                {backendSkills.length === 0 && (
                  <p className="text-on-surface-variant text-sm italic">No backend skills listed.</p>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
