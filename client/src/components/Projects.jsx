import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getProjects } from '../api/publicApi';

export default function Projects() {
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryKeyHashFn: () => 'projects',
    queryFn: getProjects,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        duration: 0.8,
      }
    },
  };

  return (
    <section id="projects" className="w-full py-24 bg-background relative border-t border-white/5">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full radial-glow pointer-events-none opacity-40 blur-3xl z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* Title */}
        <div className="mb-16 text-center md:text-left">
          <span className="mono-label text-primary mb-3">Portfolio Works</span>
          <h2 className="headline-heading text-white">
            Featured
            <span className="text-gradient"> Projects</span>
          </h2>
        </div>

        {/* Loading State / Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl glass-card p-4 h-[420px] flex flex-col justify-between animate-pulse">
                <div>
                  <div className="w-full aspect-video rounded-xl bg-surface-container mb-6" />
                  <div className="h-6 w-2/3 bg-surface-container rounded mb-3" />
                  <div className="h-4 w-full bg-surface-container rounded mb-2" />
                  <div className="h-4 w-5/6 bg-surface-container rounded mb-4" />
                </div>
                <div className="flex gap-2 mb-2">
                  <div className="h-6 w-12 bg-surface-container rounded-full" />
                  <div className="h-6 w-16 bg-surface-container rounded-full" />
                  <div className="h-6 w-14 bg-surface-container rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12 rounded-2xl glass-card max-w-xl mx-auto border border-red-500/20">
            <i className="fas fa-exclamation-triangle text-3xl text-red-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Failed to Load Projects</h3>
            <p className="text-on-surface-variant text-sm px-6">
              Our servers encountered a delay retrieving portfolio articles. Please try reloading or checking your network status.
            </p>
          </div>
        )}

        {/* Success State / Card Grid */}
        {!isLoading && !isError && projects && (
          projects.length === 0 ? (
            <div className="text-center py-20 rounded-2xl glass-card">
              <p className="text-on-surface-variant text-lg">No projects added yet.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects.map((project) => {
                const imgUrl = project.imageUrl
                  ? (project.imageUrl.startsWith('http') ? project.imageUrl : `http://localhost:5000${project.imageUrl}`)
                  : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?fit=crop&w=800&h=500&q=80';

                return (
                  <motion.div
                    key={project._id}
                    variants={cardVariants}
                    className="rounded-2xl glass-card overflow-hidden hover:border-primary/30 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:-translate-y-2"
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="w-full aspect-video overflow-hidden bg-surface-container relative">
                        <img
                          src={imgUrl}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?fit=crop&w=800&h=500&q=80';
                          }}
                        />
                        {project.isFeatured && (
                          <span className="absolute top-4 right-4 bg-primary text-on-primary font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md shadow-black/30">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Content details */}
                      <div className="p-6">
                        <h3 className="font-montserrat font-bold text-xl text-white mb-3 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-on-surface-variant mb-4 line-clamp-3">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0">
                      {/* Tech Chips */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.techTags && project.techTags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-mono font-medium tracking-wide bg-surface-container text-secondary py-1 px-2.5 rounded-md border border-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Hyperlinks */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
                        >
                          <i className="fab fa-github text-lg" />
                          Code
                        </a>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
                        >
                          <i className="fas fa-external-link-alt text-base" />
                          Live Demo
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )
        )}

      </div>
    </section>
  );
}
